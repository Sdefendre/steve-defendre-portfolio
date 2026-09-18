#!/usr/bin/env python3
"""Behavioral lifecycle coverage; all live signals target this suite's fixtures."""
import copy
import importlib.util
import json
import os
from pathlib import Path
import shutil
import signal
import socket
import subprocess
import sys
import tempfile
import unittest
import uuid
from unittest.mock import patch

sys.dont_write_bytecode = True
HELPERS = Path(__file__).resolve().parents[1] / ".cursor/skills/verify-portfolio/helpers"
spec = importlib.util.spec_from_file_location("instance", HELPERS / "instance.py")
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)

BUILD = '''#!/usr/bin/env python3
from pathlib import Path
import sys
assert sys.argv[1:] == ["run", "build"]
build = Path(".next")
build.mkdir(exist_ok=True)
(build / "BUILD_ID").write_text(Path("source.txt").read_text())
with Path("build-count").open("a") as f: f.write("build\\n")
'''
SERVER = '''from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
import sys
class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        titles = {"/": "Steve Defendre | Full-stack developer", "/about": "About Steve Defendre | Veteran software builder", "/projects": "Projects | Steve Defendre", "/contact": "Contact Steve Defendre | Project inquiries"}
        self.send_response(200)
        self.end_headers()
        self.wfile.write(("<title>" + titles[self.path] + "</title>I build software you can keep. " + Path(".next/BUILD_ID").read_text()).encode())
server = HTTPServer(("127.0.0.1", int(sys.argv[-1])), Handler)
import threading
watchdog = threading.Timer(480, server.shutdown)
watchdog.daemon = True
watchdog.start()
server.serve_forever()
'''


class Lifecycle(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="portfolio space ; $(literal) ")
        self.repo = Path(self.temp.name).resolve()
        self.helpers = self.repo / ".cursor/skills/verify-portfolio/helpers"
        shutil.copytree(HELPERS, self.helpers)
        binary = self.repo / "bin"
        binary.mkdir()
        (binary / "npm").write_text(BUILD)
        (binary / "node").write_text('#!/bin/sh\nexec python3 "$@"\n')
        for file in binary.iterdir():
            file.chmod(0o700)
        next_file = self.repo / "node_modules/next/dist/bin/next"
        next_file.parent.mkdir(parents=True)
        next_file.write_text(SERVER)
        (self.repo / "source.txt").write_text("current-source")
        self.env = {**os.environ, "PATH": str(binary) + os.pathsep + os.environ["PATH"], "PYTHONDONTWRITEBYTECODE": "1"}
        self.env.pop("PORTFOLIO_VERIFY_HOST", None)
        self.env.pop("PORTFOLIO_VERIFY_PORT", None)
        self.run_id = "helper-test-" + uuid.uuid4().hex
        self.run_dir = Path("/tmp") / ("portfolio-verify-" + self.run_id)
        with socket.socket() as sock:
            sock.bind(("127.0.0.1", 0))
            self.port = sock.getsockname()[1]
        self.original = None

    def cli(self, action, *args, success=True, env=None):
        result = subprocess.run([str(self.helpers / (action + ".sh")), *(args or (self.run_id,))],
                                text=True, capture_output=True, env=env or self.env, timeout=90)
        if success:
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        else:
            self.assertNotEqual(result.returncode, 0, result.stdout + result.stderr)
        return result

    def launch(self):
        try:
            self.cli("launch", self.run_id, str(self.port))
        finally:
            state_file = self.run_dir / "instance.json"
            if state_file.exists():
                self.original = json.loads(state_file.read_text())
        self.original = json.loads((self.run_dir / "instance.json").read_text())
        return self.original

    def tearDown(self):
        # Restore only the fixture identity captured by successful launch. Never
        # signal any PID fabricated by a negative test or any external listener.
        if self.original:
            (self.run_dir / "instance.json").write_text(json.dumps(self.original))
            result = self.cli("cleanup")
            self.assertIn("evidence retained", result.stdout)
        shutil.rmtree(self.run_dir, ignore_errors=True)
        self.temp.cleanup()

    def test_launch_doctor_cleanup_with_spaces_and_metacharacters(self):
        state = self.launch()
        self.assertEqual(state["identity"]["cwd"], str(self.repo))
        self.assertIn("doctor: OK", self.cli("doctor").stdout)
        evidence = self.run_dir / "evidence/proof.txt"
        evidence.write_text("keep this proof")
        self.cli("launch", self.run_id, str(self.port), success=False)
        self.cli("cleanup")
        self.assertEqual(evidence.read_text(), "keep this proof")
        self.assertEqual(json.loads((self.run_dir / "instance.json").read_text())["status"], "stopped")
        self.assertFalse(helper.port_open(self.port))
        self.cli("doctor", success=False)

    def test_existing_stale_or_incomplete_build_is_always_rebuilt(self):
        for old_build in ("stale-source", None):
            with self.subTest(old_build=old_build):
                build = self.repo / ".next"
                build.mkdir(exist_ok=True)
                if old_build:
                    (build / "BUILD_ID").write_text(old_build)
                else:
                    (build / "BUILD_ID").unlink(missing_ok=True)
                self.launch()
                self.assertEqual((build / "BUILD_ID").read_text(), "current-source")
                self.assertIn("current-source", helper.get(self.port, "/"))
                self.cli("cleanup")
                self.original = None
                shutil.rmtree(self.run_dir)
        self.assertEqual((self.repo / "build-count").read_text(), "build\nbuild\n")

    def test_failed_build_cannot_serve_existing_bundle(self):
        (self.repo / ".next").mkdir()
        (self.repo / ".next/BUILD_ID").write_text("stale")
        (self.repo / "bin/npm").write_text("#!/bin/sh\nexit 1\n")
        self.cli("launch", self.run_id, str(self.port), success=False)
        self.assertFalse(helper.port_open(self.port))
        self.assertTrue((self.run_dir / "build.log").exists())

    def test_bad_identity_or_malformed_state_preserves_live_fixture_and_evidence(self):
        original = self.launch()
        evidence = self.run_dir / "evidence/proof.txt"
        evidence.write_text("preserved")
        states = []
        for key, value in (("start", "reused-pid"), ("pid", 1), ("pid", os.getpid()), ("executable", "/wrong/executable"),
                           ("cwd", "/wrong-workspace"), ("command_sha256", "0" * 64)):
            altered = copy.deepcopy(original)
            altered["identity"][key] = value
            states.append(json.dumps(altered))
        altered = copy.deepcopy(original)
        del altered["identity"]
        states += [json.dumps(altered), '{broken json', 'RUN_ID=$(touch should-never-execute)']
        for raw in states:
            with self.subTest(raw=raw[:35]):
                (self.run_dir / "instance.json").write_text(raw)
                self.cli("doctor", success=False)
                self.cli("cleanup", success=False)
                self.assertEqual((self.run_dir / "instance.json").read_text(), raw)
                self.assertEqual(evidence.read_text(), "preserved")
                self.assertIn("current-source", helper.get(self.port, "/"))
        self.assertFalse((self.repo / "should-never-execute").exists())

    def test_invalid_ids_ports_and_hosts_touch_no_run_paths(self):
        bad_ids = ("", "../outside", "x/../../outside", "a/b", "$(touch bad)", "a" * 65)
        for run_id in bad_ids:
            for action in ("launch", "doctor", "cleanup"):
                self.cli(action, run_id, success=False)
        self.assertFalse(self.run_dir.exists())
        for port in ("0", "80", "65536", "abc", "3100;touch bad", "-1"):
            self.cli("launch", self.run_id, port, success=False)
            self.assertFalse(self.run_dir.exists())
        for host in ("0.0.0.0", "example.com", "localhost", "127.0.0.1/evil"):
            self.cli("launch", self.run_id, str(self.port), env={**self.env, "PORTFOLIO_VERIFY_HOST": host}, success=False)
            self.assertFalse(self.run_dir.exists())

    def test_traversal_cannot_touch_an_existing_external_directory(self):
        with tempfile.TemporaryDirectory(prefix="portfolio-external-", dir="/tmp") as outside:
            target = Path(outside)
            sentinel = target / "proof.txt"
            sentinel.write_text("untouched")
            # /tmp/portfolio-verify-ID/../target would resolve to this directory.
            self.run_dir.mkdir(mode=0o700)
            traversal = self.run_id + "/../" + target.name
            for action in ("launch", "doctor", "cleanup"):
                self.cli(action, traversal, success=False)
                self.assertEqual(sorted(p.name for p in target.iterdir()), ["proof.txt"])
                self.assertEqual(sentinel.read_text(), "untouched")
                self.assertEqual(list(self.run_dir.iterdir()), [])

    def test_fifo_state_is_rejected_without_blocking(self):
        self.run_dir.mkdir(mode=0o700)
        os.mkfifo(self.run_dir / "instance.json", 0o600)
        result = subprocess.run([str(self.helpers / "doctor.sh"), self.run_id],
                                text=True, capture_output=True, env=self.env, timeout=5)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("unsafe file permissions/type", result.stderr)
        self.assertTrue((self.run_dir / "instance.json").exists())

    def test_symlink_evidence_directory_is_rejected_before_build(self):
        self.run_dir.mkdir(mode=0o700)
        (self.run_dir / "evidence").symlink_to(self.repo, target_is_directory=True)
        self.cli("launch", self.run_id, str(self.port), success=False)
        self.assertFalse((self.repo / "build-count").exists())
        self.assertFalse((self.run_dir / "build.log").exists())
        self.assertFalse(helper.port_open(self.port))

    def test_symlink_run_directory_and_legacy_state_are_never_followed(self):
        self.run_dir.symlink_to(self.repo, target_is_directory=True)
        try:
            self.cli("launch", self.run_id, str(self.port), success=False)
            self.cli("cleanup", success=False)
            self.assertFalse((self.repo / "lock").exists())
        finally:
            self.run_dir.unlink()
        self.run_dir.mkdir(mode=0o700)
        legacy = self.run_dir / "instance.env"
        legacy.write_text("touch " + str(self.repo / "executed"))
        self.cli("launch", self.run_id, str(self.port), success=False)
        self.cli("cleanup", success=False)
        self.assertFalse((self.repo / "executed").exists())
        self.assertTrue(legacy.exists())


class SignalSafety(unittest.TestCase):
    def setUp(self):
        self.ident = {"pid": 123456, "start": "start", "uid": os.getuid(), "cwd": str(helper.REPO),
                      "command_sha256": "c" * 64, "executable": "/fixture/python"}
        self.state = {"identity": self.ident, "port": 32000, "status": "ready"}

    def test_wrong_reused_absent_or_unverifiable_process_never_signaled(self):
        for current in (None, {**self.ident, "start": "new"}, {**self.ident, "executable": "/wrong/python"}):
            with patch.object(helper, "identity", return_value=current), patch.object(helper, "listeners", return_value={123456}), \
                 patch.object(helper.sys, "platform", "darwin"), patch.object(helper.os, "kill") as kill:
                with self.assertRaises(helper.Refused):
                    helper.signal_owned(self.state, signal.SIGTERM)
                kill.assert_not_called()
        with patch.object(helper, "identity", side_effect=helper.Refused("unavailable")), \
             patch.object(helper.sys, "platform", "darwin"), patch.object(helper.os, "kill") as kill:
            with self.assertRaises(helper.Refused):
                helper.signal_owned(self.state, signal.SIGTERM)
            kill.assert_not_called()

    def test_listener_missing_foreign_or_ambiguous_never_signaled(self):
        for found in (set(), {987654}, {123456, 987654}):
            with patch.object(helper, "identity", return_value=self.ident), patch.object(helper, "listeners", return_value=found), \
                 patch.object(helper.sys, "platform", "darwin"), patch.object(helper.os, "kill") as kill:
                with self.assertRaises(helper.Refused):
                    helper.signal_owned(self.state, signal.SIGKILL)
                kill.assert_not_called()

    def test_identity_rechecked_after_listener_discovery(self):
        with patch.object(helper, "identity", side_effect=[self.ident, {**self.ident, "start": "new"}]), \
             patch.object(helper, "listeners", return_value={123456}), patch.object(helper.sys, "platform", "darwin"), \
             patch.object(helper.os, "kill") as kill:
            with self.assertRaises(helper.Refused):
                helper.signal_owned(self.state, signal.SIGTERM)
            kill.assert_not_called()

    def test_escalation_revalidates_identity_and_retains_state(self):
        with patch.object(helper.sys, "platform", "darwin"), patch.object(helper.os, "kill") as kill, \
             patch.object(helper, "identity", side_effect=[self.ident] * 23 + [{**self.ident, "start": "reused"}]), \
             patch.object(helper, "listeners", return_value={123456}), patch.object(helper.time, "sleep"), \
             patch.object(helper, "save") as save:
            with self.assertRaises(helper.Refused):
                helper.cleanup(Path("/unused"), self.state)
            kill.assert_called_once_with(123456, signal.SIGTERM)
            save.assert_not_called()

    def test_gone_original_with_orphan_or_foreign_listener_is_preserved(self):
        with patch.object(helper, "identity", return_value=None), patch.object(helper, "listeners", return_value={987654}), \
             patch.object(helper.os, "kill") as kill, patch.object(helper, "save") as save:
            with self.assertRaises(helper.Refused):
                helper.cleanup(Path("/unused"), self.state)
            kill.assert_not_called()
            save.assert_not_called()

    def test_process_exiting_during_discovery_requires_kernel_confirmation(self):
        for after, gone in ((None, True), ((os.getuid(), "new-start", "/fixture/python"), False)):
            with patch.object(helper.sys, "platform", "darwin"), \
                 patch.object(helper, "mac_process", side_effect=[(os.getuid(), "start", "/fixture/python"), after]), \
                 patch.object(helper, "command", side_effect=helper.Refused("process vanished during lsof")):
                if gone:
                    self.assertIsNone(helper.identity(123456))
                else:
                    with self.assertRaises(helper.Refused):
                        helper.identity(123456)

    def test_linux_zombie_during_discovery_requires_kernel_confirmation(self):
        alive = "123456 (fixture) S " + "0 " * 18 + "12345"
        zombie = alive.replace(") S ", ") Z ")
        for after, gone in ((zombie, True), (FileNotFoundError(), True), (alive, False)):
            with patch.object(helper.sys, "platform", "linux"), \
                 patch.object(Path, "read_text", side_effect=[alive, "boot-id", after]), \
                 patch.object(helper.os, "readlink", side_effect=FileNotFoundError()):
                if gone:
                    self.assertIsNone(helper.identity(123456))
                else:
                    with self.assertRaises(helper.Refused):
                        helper.identity(123456)

    def test_unsafe_state_file_is_rejected_before_truncating_evidence(self):
        with tempfile.TemporaryDirectory() as temp:
            outside = Path(temp) / "outside-proof"
            outside.write_text("retain original evidence")
            outside.chmod(0o600)
            state = Path(temp) / "instance.json"
            os.link(outside, state)
            with self.assertRaises(helper.Refused):
                helper.safe_file(state, os.O_WRONLY | os.O_TRUNC)
            self.assertEqual(outside.read_text(), "retain original evidence")

    def test_cleanup_waits_for_confirmed_exit_after_transient_discovery_failure(self):
        with patch.object(helper.sys, "platform", "darwin"), patch.object(helper.os, "kill") as kill, \
             patch.object(helper, "identity", side_effect=[self.ident] * 3 + [helper.Refused("exiting"), None]), \
             patch.object(helper, "listeners", side_effect=[{123456}, set()]), \
             patch.object(helper, "port_open", return_value=False), patch.object(helper.time, "sleep"), \
             patch.object(helper, "save") as save:
            helper.cleanup(Path("/unused"), self.state)
            kill.assert_called_once_with(123456, signal.SIGTERM)
            self.assertEqual(save.call_args.args[1]["status"], "stopped")

    def test_persistent_discovery_failure_after_term_never_escalates(self):
        sent = []
        def current_identity(pid):
            if sent:
                raise helper.Refused("identity unavailable")
            return self.ident
        with patch.object(helper.sys, "platform", "darwin"), \
             patch.object(helper.os, "kill", side_effect=lambda pid, sig: sent.append((pid, sig))), \
             patch.object(helper, "identity", side_effect=current_identity), \
             patch.object(helper, "listeners", return_value={123456}), patch.object(helper.time, "sleep"), \
             patch.object(helper, "save") as save:
            with self.assertRaises(helper.Refused):
                helper.cleanup(Path("/unused"), self.state)
            self.assertEqual(sent, [(123456, signal.SIGTERM)])
            save.assert_not_called()

    def test_missing_discovery_tool_fails_closed(self):
        with patch.object(helper.subprocess, "run", side_effect=FileNotFoundError("lsof")):
            with self.assertRaises(FileNotFoundError):
                helper.listeners(32000)


if __name__ == "__main__":
    unittest.main(verbosity=2)
