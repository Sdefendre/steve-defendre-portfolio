#!/usr/bin/env bash
# Stop the instance this RUN_ID started. Leaves evidence in place.
# Usage: cleanup.sh RUN_ID

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "${script_dir}/lib.sh"

run_id="${1:-}"
portfolio_verify_require_run_id "${run_id}"

env_file="$(portfolio_verify_instance_env "${run_id}")"
if [[ ! -f "${env_file}" ]]; then
  echo "cleanup: nothing to stop for RUN_ID=${run_id} (no ${env_file})"
  exit 0
fi

# shellcheck disable=SC1090
source "${env_file}"

stop_pid() {
  local pid="${1:-}"
  local label="${2}"
  if [[ -z "${pid}" ]]; then
    return 0
  fi
  if ! portfolio_verify_pid_alive "${pid}"; then
    echo "cleanup: ${label} ${pid} already gone"
    return 0
  fi
  kill "${pid}" 2>/dev/null || true
  for _ in $(seq 1 20); do
    if ! portfolio_verify_pid_alive "${pid}"; then
      echo "cleanup: stopped ${label} ${pid}"
      return 0
    fi
    sleep 0.25
  done
  kill -9 "${pid}" 2>/dev/null || true
  echo "cleanup: force-stopped ${label} ${pid}"
}

stop_pid "${START_PID:-}" "START_PID"
stop_pid "${LISTEN_PID:-}" "LISTEN_PID"

rm -f "${env_file}"

evidence_dir="${EVIDENCE_DIR:-$(portfolio_verify_evidence_dir "${run_id}")}"
echo "cleanup: instance removed"
echo "EVIDENCE_DIR=${evidence_dir}"
if [[ -d "${evidence_dir}" ]]; then
  echo "cleanup: evidence kept"
else
  echo "cleanup: warning: evidence directory is missing at ${evidence_dir}" >&2
fi
