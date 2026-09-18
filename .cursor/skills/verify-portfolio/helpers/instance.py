#!/usr/bin/env python3
"""Local verification lifecycle. State is data; never execute it or trust a PID alone."""
import argparse
import contextlib
import ctypes
import errno
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import signal
import socket
import stat
import subprocess
import sys
import time
import urllib.request

REPO = Path(__file__).resolve().parents[4]
TITLES = {
    "/": "Steve Defendre | Full-stack developer",
    "/about": "About Steve Defendre | Veteran software builder",
    "/projects": "Projects | Steve Defendre",
    "/contact": "Contact Steve Defendre | Project inquiries",
}


class Refused(RuntimeError):
    pass


def inputs(run_id, port, host):
    if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_-]{0,63}", run_id):
        raise Refused("RUN_ID must be 1-64 letters, digits, underscores or hyphens; start with a letter/digit")
    if not re.fullmatch(r"[0-9]{1,5}", str(port)) or not 1024 <= int(port) <= 65535:
        raise Refused("port must be an integer from 1024 through 65535")
    if host != "127.0.0.1":
        raise Refused("host must be the literal loopback address 127.0.0.1")
    return int(port)


def command(args, empty_ok=False):
    result = subprocess.run(args, capture_output=True, text=True, timeout=10,
                            env={**os.environ, "LC_ALL": "C"})
    if result.returncode and not (empty_ok and result.returncode == 1 and not result.stderr):
        raise Refused(f"process discovery failed: {args[0]}")
    return result.stdout.strip()


def mac_process(pid):
    # Public libproc ABI: proc_bsdinfo / PROC_PIDTBSDINFO and proc_pidpath.
    # https://github.com/apple-oss-distributions/xnu/blob/main/bsd/sys/proc_info.h
    class BSDInfo(ctypes.Structure):
        _fields_ = [(name, ctypes.c_uint32) for name in (
            "flags", "status", "xstatus", "pid", "ppid", "uid", "gid", "ruid",
            "rgid", "svuid", "svgid", "reserved")] + [
            ("comm", ctypes.c_char * 16), ("name", ctypes.c_char * 32)] + [
            (name, ctypes.c_uint32) for name in (
                "nfiles", "pgid", "pjobc", "tdev", "tpgid", "nice")] + [
            ("start_sec", ctypes.c_uint64), ("start_usec", ctypes.c_uint64)]
    lib = ctypes.CDLL("/usr/lib/libproc.dylib", use_errno=True)
    lib.proc_pidinfo.argtypes = [ctypes.c_int, ctypes.c_int, ctypes.c_uint64,
                                ctypes.c_void_p, ctypes.c_int]
    lib.proc_pidinfo.restype = ctypes.c_int
    info = BSDInfo()
    size = lib.proc_pidinfo(pid, 3, 0, ctypes.byref(info), ctypes.sizeof(info))
    if size == 0 and ctypes.get_errno() == errno.ESRCH:
        return None
    if size != ctypes.sizeof(info) or info.pid != pid:
        raise Refused("kernel process identity unavailable")
    if info.status == 5:  # SZOMB
        return None
    lib.proc_pidpath.argtypes = [ctypes.c_int, ctypes.c_void_p, ctypes.c_uint32]
    lib.proc_pidpath.restype = ctypes.c_int
    executable = ctypes.create_string_buffer(4096)
    if lib.proc_pidpath(pid, executable, len(executable)) <= 0:
        raise Refused("kernel executable path unavailable")
    boot = command(["sysctl", "-n", "kern.bootsessionuuid"])
    if not boot or not info.start_sec:
        raise Refused("kernel start identity unavailable")
    return info.uid, f"{boot}:{info.start_sec}:{info.start_usec}", os.fsdecode(executable.value)


def identity(pid):
    """None means definitely absent/zombie. Discovery errors are not absence."""
    if type(pid) is not int or pid <= 1:
        raise Refused("invalid process ID")
    if sys.platform == "linux":
        proc = Path(f"/proc/{pid}")
        try:
            fields = (proc / "stat").read_text().rsplit(")", 1)[1].split()
            start = Path("/proc/sys/kernel/random/boot_id").read_text().strip() + ":" + fields[19]
            uid = proc.stat().st_uid
            cwd = os.readlink(proc / "cwd")
            cmd = (proc / "cmdline").read_bytes()
            # Read exe last: an address space never comes back, so a readable exe
            # proves cwd and cmdline above were read from a live process.
            executable = os.readlink(proc / "exe")
        except FileNotFoundError:
            # Exit releases the address space (exe, cwd, cmdline) about a millisecond
            # before stat reports Z. No exe link means the task has left userspace.
            if not (proc / "exe").exists():
                return None
            raise Refused("process identity unavailable")
    elif sys.platform == "darwin":
        process = mac_process(pid)
        if process is None:
            return None
        uid, start, executable = process
        try:
            cwd_rows = command(["lsof", "-a", "-p", str(pid), "-d", "cwd", "-Fn"]).splitlines()
            paths = [row[1:] for row in cwd_rows if row.startswith("n")]
            if len(paths) != 1:
                raise Refused("process working directory unavailable")
            cwd = paths[0]
            cmd = command(["ps", "-ww", "-p", str(pid), "-o", "command="]).encode()
        except Refused:
            # A TERM recipient can exit between kernel inspection and lsof/ps.
            # Only kernel-confirmed absence may turn discovery failure into gone.
            if mac_process(pid) is None:
                return None
            raise
    else:
        raise Refused("supported platforms are macOS and Linux")
    if not cmd or not executable or not start:
        raise Refused("process launch identity unavailable")
    return {"pid": pid, "start": start, "uid": uid, "cwd": cwd,
            "command_sha256": hashlib.sha256(cmd).hexdigest(), "executable": executable}


def listeners(port):
    # lsof supports both macOS and Linux. An unavailable tool is an error.
    output = command(["lsof", "-nP", "-a", f"-iTCP:{port}", "-sTCP:LISTEN", "-t"], True)
    rows = output.splitlines()
    if any(not re.fullmatch(r"[0-9]+", row) for row in rows):
        raise Refused("unrecognized listener discovery output")
    return {int(row) for row in rows}


def port_open(port):
    try:
        with socket.create_connection(("127.0.0.1", port), timeout=1):
            return True
    except ConnectionRefusedError:
        return False


def safe_file(path, flags):
    fd = os.open(path, (flags & ~os.O_TRUNC) | os.O_NOFOLLOW | os.O_NONBLOCK, 0o600)
    info = os.fstat(fd)
    if not stat.S_ISREG(info.st_mode) or info.st_uid != os.getuid() or info.st_nlink != 1 or info.st_mode & 0o077:
        os.close(fd)
        raise Refused(f"unsafe file permissions/type: {path.name}")
    if flags & os.O_TRUNC:
        os.ftruncate(fd, 0)
    return fd


@contextlib.contextmanager
def run_lock(run_id, create=False):
    # Only called after inputs() accepts the ID. Never follow a run-directory link.
    directory = Path("/tmp") / f"portfolio-verify-{run_id}"
    if create:
        directory.mkdir(mode=0o700, exist_ok=True)
    if not directory.exists() and not directory.is_symlink():
        yield None
        return
    info = directory.lstat()
    if not stat.S_ISDIR(info.st_mode) or info.st_uid != os.getuid() or info.st_mode & 0o077:
        raise Refused("unsafe run directory (must be private, owned, and not a symlink)")
    with os.fdopen(safe_file(directory / "lock", os.O_CREAT | os.O_RDWR), "w") as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            raise Refused("another helper is using this RUN_ID") from None
        yield directory


def save(directory, state):
    with os.fdopen(safe_file(directory / "instance.json", os.O_CREAT | os.O_WRONLY | os.O_TRUNC), "w") as handle:
        json.dump(state, handle, indent=2)
        handle.write("\n")


def load(directory, run_id):
    with os.fdopen(safe_file(directory / "instance.json", os.O_RDONLY)) as handle:
        state = json.load(handle)
    if not isinstance(state, dict) or set(state) != {"version", "run_id", "repo", "host", "port", "identity", "status"}:
        raise Refused("invalid state schema; evidence retained")
    if state["version"] != 1 or state["run_id"] != run_id or state["repo"] != str(REPO):
        raise Refused("state belongs to a different run/repository or schema")
    if state["status"] not in ("starting", "ready", "stopped") or type(state["port"]) is not int:
        raise Refused("invalid instance state")
    inputs(run_id, state["port"], state["host"])
    ident = state["identity"]
    if not isinstance(ident, dict) or set(ident) != {"pid", "start", "uid", "cwd", "command_sha256", "executable"}:
        raise Refused("missing process identity")
    if (type(ident["pid"]) is not int or ident["pid"] <= 1 or type(ident["uid"]) is not int
            or ident["uid"] != os.getuid() or ident["cwd"] != str(REPO)
            or not isinstance(ident["start"], str) or not ident["start"]
            or not isinstance(ident["executable"], str) or not os.path.isabs(ident["executable"])
            or not isinstance(ident["command_sha256"], str)
            or not re.fullmatch(r"[a-f0-9]{64}", ident["command_sha256"])):
        raise Refused("invalid process identity")
    return state


def owned(state):
    expected = state["identity"]
    current = identity(expected["pid"])
    if current != expected:
        raise Refused("process identity changed or absent; refusing to signal or drive it")
    if listeners(state["port"]) != {expected["pid"]}:
        raise Refused("listener ownership is missing or changed; refusing to signal or drive it")
    # Recheck identity after discovery, including kernel start time and executable.
    if identity(expected["pid"]) != expected:
        raise Refused("process identity changed during discovery")


def signal_owned(state, sig):
    pid = state["identity"]["pid"]
    # Linux pidfd pins the process across the final check/signal race. macOS has
    # no pidfd: require fresh identity + sole listener immediately before kill.
    if sys.platform == "linux" and hasattr(os, "pidfd_open") and hasattr(signal, "pidfd_send_signal"):
        fd = os.pidfd_open(pid)
        try:
            owned(state)
            signal.pidfd_send_signal(fd, sig)
        finally:
            os.close(fd)
    else:
        owned(state)
        os.kill(pid, sig)


def get(port, path):
    # Ignore proxy environment and reject redirects to another origin.
    class NoRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, req, fp, code, msg, headers, newurl):
            return None
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}), NoRedirect())
    with opener.open(f"http://127.0.0.1:{port}{path}", timeout=3) as response:
        if response.status != 200:
            raise Refused("route did not return HTTP 200")
        return response.read().decode()


def doctor(state):
    if state["status"] != "ready":
        raise Refused("instance has not completed launch")
    owned(state)
    for path, title in TITLES.items():
        html = get(state["port"], path)
        if f"<title>{title}</title>" not in html or (path == "/" and "I build software you can keep." not in html):
            raise Refused(f"route identity mismatch: {path}")
    owned(state)
    print("doctor: OK; routes=/, /about, /projects, /contact")


def wait_for_exit(state):
    for _ in range(20):
        try:
            current = identity(state["identity"]["pid"])
        except Refused:
            # Exit can remove cwd/exe before the kernel reports a zombie. Wait
            # for positive exit proof; never use this uncertainty to send a signal.
            pass
        else:
            if current is None:
                return True
            if current != state["identity"]:
                raise Refused("process identity changed while waiting for exit")
        time.sleep(0.25)
    return False


def cleanup(directory, state):
    current = identity(state["identity"]["pid"])
    if current is None:
        if listeners(state["port"]) or port_open(state["port"]):
            raise Refused("original process exited but port is occupied; state retained")
    else:
        signal_owned(state, signal.SIGTERM)
        if not wait_for_exit(state):
            # Must still be the same process AND listener before escalation.
            signal_owned(state, signal.SIGKILL)
            if not wait_for_exit(state):
                raise Refused("process did not exit; state retained")
        if listeners(state["port"]) or port_open(state["port"]):
            raise Refused("port still occupied; state retained")
    state["status"] = "stopped"
    save(directory, state)
    print(f"cleanup: stopped; state, logs and evidence retained at {directory}")


def launch(directory, run_id, port):
    if (directory / "instance.json").exists() or (directory / "instance.env").exists():
        raise Refused("RUN_ID already has state; use doctor/cleanup and a new RUN_ID (legacy state is never executed)")
    if listeners(port) or port_open(port):
        raise Refused("port already occupied; choose another port")
    evidence = directory / "evidence"
    evidence.mkdir(mode=0o700, exist_ok=True)
    info = evidence.lstat()
    if not stat.S_ISDIR(info.st_mode) or info.st_uid != os.getuid() or info.st_mode & 0o077:
        raise Refused("unsafe evidence directory (must be private, owned, and not a symlink)")
    with os.fdopen(safe_file(directory / "build.log", os.O_CREAT | os.O_EXCL | os.O_WRONLY), "w") as log:
        if not (REPO / "node_modules").is_dir():
            subprocess.run(["npm", "ci"], cwd=REPO, stdout=log, stderr=subprocess.STDOUT, check=True)
        print(f"building current source; log={directory / 'build.log'}", flush=True)
        subprocess.run(["npm", "run", "build"], cwd=REPO, stdout=log, stderr=subprocess.STDOUT, check=True)
    build_id = REPO / ".next" / "BUILD_ID"
    if not build_id.is_file() or not build_id.read_text().strip():
        raise Refused("build did not produce a production BUILD_ID")
    if listeners(port) or port_open(port):
        raise Refused("port became occupied during build")
    with os.fdopen(safe_file(directory / "server.log", os.O_CREAT | os.O_EXCL | os.O_WRONLY), "w") as log:
        child = subprocess.Popen(["node", str(REPO / "node_modules/next/dist/bin/next"), "start",
                                  "--hostname", "127.0.0.1", "--port", str(port)], cwd=REPO,
                                 stdin=subprocess.DEVNULL,
                                 stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
    print(f"START_PID={child.pid}; startup failures retain state/logs and never kill an unverified listener", flush=True)
    state = {"version": 1, "run_id": run_id, "repo": str(REPO), "host": "127.0.0.1",
             "port": port, "identity": None, "status": "starting"}
    for _ in range(60):
        if child.poll() is not None:
            raise Refused("server exited during startup; inspect server.log")
        # Popen retains the direct child: poll() guarantees its PID has not been
        # reaped/reused. Refresh after Next changes its process title at startup.
        try:
            ident = identity(child.pid)
        except Refused:
            # cmdline is empty while a node wrapper (nvm/volta shim) is still
            # exec-ing the real binary; nothing is signaled, so poll again.
            time.sleep(1)
            continue
        if ident is None or ident["cwd"] != str(REPO):
            raise Refused("unable to establish launched process identity")
        state["identity"] = ident
        save(directory, state)
        if listeners(port) == {child.pid}:
            try:
                get(port, "/")
            except (OSError, ValueError):
                pass
            else:
                # Capture the stable title after the first request, still a direct child.
                if child.poll() is not None:
                    raise Refused("server exited after readiness request")
                state["identity"] = identity(child.pid)
                owned(state)
                state["status"] = "ready"
                save(directory, state)
                print(f"BASE_URL=http://127.0.0.1:{port}\nEVIDENCE_DIR={directory / 'evidence'}\nINSTANCE_JSON={directory / 'instance.json'}")
                return
        time.sleep(1)
    raise Refused("server not ready after 60 attempts; evidence and identity retained for inspection/cleanup")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=("launch", "doctor", "cleanup"))
    parser.add_argument("run_id")
    parser.add_argument("port", nargs="?", default=os.environ.get("PORTFOLIO_VERIFY_PORT", "3100"))
    args = parser.parse_args()
    try:
        port = inputs(args.run_id, args.port, os.environ.get("PORTFOLIO_VERIFY_HOST", "127.0.0.1"))
        with run_lock(args.run_id, create=args.action == "launch") as directory:
            if directory is None:
                if args.action == "cleanup":
                    print("cleanup: no instance directory")
                    return
                raise Refused("no instance directory")
            if args.action == "launch":
                launch(directory, args.run_id, port)
            else:
                state = load(directory, args.run_id)
                doctor(state) if args.action == "doctor" else cleanup(directory, state)
    except (Refused, OSError, ValueError, TypeError, subprocess.SubprocessError) as error:
        print(f"{args.action}: FAIL: {error}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
