#!/usr/bin/env bash
# Start an isolated production instance of the Steve Defendre portfolio.
# Usage: launch.sh RUN_ID [PORT]
# Env: PORTFOLIO_VERIFY_HOST (default 127.0.0.1)
#      PORTFOLIO_VERIFY_REBUILD=1 to run npm run build even when .next exists

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "${script_dir}/lib.sh"

run_id="${1:-}"
portfolio_verify_require_run_id "${run_id}"
port="${2:-${PORTFOLIO_VERIFY_PORT:-3100}}"
host="${PORTFOLIO_VERIFY_HOST:-127.0.0.1}"
base_url="http://${host}:${port}"

run_dir="$(portfolio_verify_run_dir "${run_id}")"
env_file="$(portfolio_verify_instance_env "${run_id}")"
evidence_dir="$(portfolio_verify_evidence_dir "${run_id}")"
log_file="${run_dir}/server.log"

mkdir -p "${evidence_dir}"

if [[ -f "${env_file}" ]]; then
  # shellcheck disable=SC1090
  source "${env_file}"
  if portfolio_verify_pid_alive "${START_PID:-}"; then
    echo "error: RUN_ID=${run_id} is already running as pid ${START_PID} on ${BASE_URL:-unknown}" >&2
    echo "doctor it, or run helpers/cleanup.sh ${run_id} first" >&2
    exit 1
  fi
  rm -f "${env_file}"
fi

if portfolio_verify_port_open "${host}" "${port}"; then
  existing_pids="$(portfolio_verify_port_pids "${port}")"
  echo "error: ${base_url} is already accepting connections" >&2
  if [[ -n "${existing_pids}" ]]; then
    echo "listening pids: ${existing_pids}" >&2
  fi
  echo "pick another port: helpers/launch.sh ${run_id} 3101" >&2
  echo "do not drive that listener. it was not started by this RUN_ID" >&2
  exit 1
fi

cd "${repo_root}"

if [[ ! -d "${repo_root}/node_modules" ]]; then
  echo "installing npm dependencies"
  npm install
fi

if [[ ! -d "${repo_root}/.next" || "${PORTFOLIO_VERIFY_REBUILD:-}" == "1" ]]; then
  echo "building production bundle"
  npm run build
fi

echo "starting next start on ${base_url}"
: > "${log_file}"
npm run start -- --hostname "${host}" --port "${port}" > "${log_file}" 2>&1 &
start_pid=$!

cleanup_failed_start() {
  if portfolio_verify_pid_alive "${start_pid}"; then
    kill "${start_pid}" 2>/dev/null || true
    wait "${start_pid}" 2>/dev/null || true
  fi
}
trap cleanup_failed_start EXIT

ready="0"
for _ in $(seq 1 60); do
  if ! portfolio_verify_pid_alive "${start_pid}"; then
    echo "error: next start exited before it was ready. last log lines:" >&2
    tail -n 40 "${log_file}" >&2 || true
    exit 1
  fi
  if curl -fs --max-time 2 "${base_url}/" -o /dev/null; then
    ready="1"
    break
  fi
  sleep 1
done

if [[ "${ready}" != "1" ]]; then
  echo "error: ${base_url} did not answer with HTTP 200 within 60s" >&2
  tail -n 40 "${log_file}" >&2 || true
  exit 1
fi

listen_pid="$(portfolio_verify_port_pids "${port}" | head -n 1 || true)"

cat > "${env_file}" <<EOF
RUN_ID=${run_id}
HOST=${host}
PORT=${port}
BASE_URL=${base_url}
START_PID=${start_pid}
LISTEN_PID=${listen_pid}
REPO_ROOT=${repo_root}
LOG_FILE=${log_file}
EVIDENCE_DIR=${evidence_dir}
EOF

trap - EXIT

echo "RUN_ID=${run_id}"
echo "BASE_URL=${base_url}"
echo "START_PID=${start_pid}"
echo "LISTEN_PID=${listen_pid}"
echo "EVIDENCE_DIR=${evidence_dir}"
echo "INSTANCE_ENV=${env_file}"
echo "LOG_FILE=${log_file}"
