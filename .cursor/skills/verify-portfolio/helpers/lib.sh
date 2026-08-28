#!/usr/bin/env bash
# Shared paths and checks for verify-portfolio helpers.
# Source this file. Do not execute it.

set -euo pipefail

helpers_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
skill_dir="$(cd "${helpers_dir}/.." && pwd)"
repo_root="$(cd "${skill_dir}/../../.." && pwd)"

portfolio_verify_run_dir() {
  printf '%s' "/tmp/portfolio-verify-${1}"
}

portfolio_verify_instance_env() {
  printf '%s' "$(portfolio_verify_run_dir "${1}")/instance.env"
}

portfolio_verify_evidence_dir() {
  printf '%s' "$(portfolio_verify_run_dir "${1}")/evidence"
}

portfolio_verify_require_run_id() {
  local run_id="${1:-}"
  if [[ -z "${run_id}" ]]; then
    echo "error: pass RUN_ID as the first argument" >&2
    echo "example: ${0##*/} skill-proof-1" >&2
    exit 2
  fi
}

portfolio_verify_load_instance() {
  local env_file
  env_file="$(portfolio_verify_instance_env "${1}")"
  if [[ ! -f "${env_file}" ]]; then
    echo "error: no instance for RUN_ID=${1} at ${env_file}" >&2
    echo "start one with helpers/launch.sh ${1}" >&2
    exit 1
  fi
  # shellcheck disable=SC1090
  source "${env_file}"
}

portfolio_verify_pid_alive() {
  local pid="${1:-}"
  [[ -n "${pid}" ]] && kill -0 "${pid}" 2>/dev/null
}

portfolio_verify_port_open() {
  local host="${1}"
  local port="${2}"
  python3 - "${host}" "${port}" <<'PY'
import socket
import sys

host = sys.argv[1]
port = int(sys.argv[2])
sock = socket.socket()
sock.settimeout(1)
try:
    sock.connect((host, port))
except OSError:
    sys.exit(1)
finally:
    sock.close()
PY
}

portfolio_verify_port_pids() {
  local port="${1}"
  python3 - "${port}" <<'PY'
import os
import sys

port = int(sys.argv[1])
hexport = f"{port:04X}"
inodes = set()
for path in ("/proc/net/tcp", "/proc/net/tcp6"):
    try:
        with open(path, encoding="utf-8") as handle:
            next(handle)
            for line in handle:
                parts = line.split()
                if len(parts) < 10:
                    continue
                local, state, inode = parts[1], parts[3], parts[9]
                bound_port = local.rsplit(":", 1)[-1]
                if bound_port.upper() == hexport and state == "0A":
                    inodes.add(inode)
    except FileNotFoundError:
        continue

pids = []
if inodes:
    for pid in os.listdir("/proc"):
        if not pid.isdigit():
            continue
        fd_dir = f"/proc/{pid}/fd"
        try:
            for fd in os.listdir(fd_dir):
                try:
                    target = os.readlink(f"{fd_dir}/{fd}")
                except OSError:
                    continue
                if target.startswith("socket:[") and target[8:-1] in inodes:
                    pids.append(pid)
                    break
        except OSError:
            continue

for pid in sorted(set(pids), key=int):
    print(pid)
PY
}

portfolio_verify_descendant_pids() {
  local root_pid="${1}"
  python3 - "${root_pid}" <<'PY'
import os
import sys

root = sys.argv[1]
children = {}
for pid in os.listdir("/proc"):
    if not pid.isdigit():
        continue
    try:
        with open(f"/proc/{pid}/stat", encoding="utf-8") as handle:
            stat = handle.read()
        comm_end = stat.rfind(")")
        ppid = stat[comm_end + 2 :].split()[1]
        children.setdefault(ppid, []).append(pid)
    except OSError:
        continue

stack = [root]
seen = []
while stack:
    current = stack.pop()
    for child in children.get(current, []):
        if child not in seen:
            seen.append(child)
            stack.append(child)

for pid in seen:
    print(pid)
PY
}

portfolio_verify_pid_in_tree() {
  local root_pid="${1}"
  local candidate="${2}"
  python3 - "${root_pid}" "${candidate}" <<'PY'
import os
import sys

root = sys.argv[1]
candidate = sys.argv[2]
seen = set()
current = candidate
while current and current != "0" and current not in seen:
    if current == root:
        sys.exit(0)
    seen.add(current)
    stat_path = f"/proc/{current}/stat"
    try:
        with open(stat_path, encoding="utf-8") as handle:
            stat = handle.read()
        comm_end = stat.rfind(")")
        current = stat[comm_end + 2 :].split()[1]
    except OSError:
        break
sys.exit(1)
PY
}

portfolio_verify_http_get() {
  local url="${1}"
  local dest="${2}"
  curl -fsS --max-time 10 "${url}" -o "${dest}"
}

portfolio_verify_html_has() {
  local file="${1}"
  local needle="${2}"
  grep -F -q "${needle}" "${file}"
}
