#!/usr/bin/env bash
# Read-only check: is this RUN_ID's instance worth driving?
# Usage: doctor.sh RUN_ID

set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "${script_dir}/lib.sh"

run_id="${1:-}"
portfolio_verify_require_run_id "${run_id}"
portfolio_verify_load_instance "${run_id}"

fail() {
  echo "doctor: FAIL: ${1}" >&2
  exit 1
}

[[ -n "${BASE_URL:-}" && -n "${PORT:-}" ]] || fail "instance.env is missing BASE_URL or PORT"
portfolio_verify_pid_alive "${START_PID:-}" || fail "START_PID ${START_PID:-unset} is not running"
portfolio_verify_port_open "${HOST}" "${PORT}" || fail "${BASE_URL} is not accepting connections"

port_pids="$(portfolio_verify_port_pids "${PORT}")"
if [[ -n "${LISTEN_PID:-}" ]]; then
  portfolio_verify_pid_alive "${LISTEN_PID}" || fail "LISTEN_PID ${LISTEN_PID} is not running"
  if [[ -n "${port_pids}" ]] && ! printf '%s\n' "${port_pids}" | grep -qx "${LISTEN_PID}"; then
    fail "port ${PORT} is not owned by LISTEN_PID ${LISTEN_PID} (found: ${port_pids})"
  fi
  if ! portfolio_verify_pid_in_tree "${START_PID}" "${LISTEN_PID}"; then
    fail "LISTEN_PID ${LISTEN_PID} is not in the START_PID ${START_PID} process tree"
  fi
elif [[ -n "${port_pids}" ]]; then
  owned="0"
  while read -r pid; do
    [[ -z "${pid}" ]] && continue
    if portfolio_verify_pid_in_tree "${START_PID}" "${pid}"; then
      owned="1"
      break
    fi
  done <<< "${port_pids}"
  [[ "${owned}" == "1" ]] || fail "port ${PORT} is listening (pids: ${port_pids}) but none belong to START_PID ${START_PID}"
fi

scratch="$(mktemp)"
trap 'rm -f "${scratch}"' EXIT

check_route() {
  local path="${1}"
  local title="${2}"
  local url="${BASE_URL}${path}"
  if ! portfolio_verify_http_get "${url}" "${scratch}"; then
    fail "${url} did not return HTTP 200"
  fi
  portfolio_verify_html_has "${scratch}" "<title>${title}</title>" \
    || fail "${url} is missing title: ${title}"
}

check_route "/" "Steve Defendre | Full-stack developer"
check_route "/about" "About Steve Defendre | Veteran software builder"
check_route "/projects" "Projects | Steve Defendre"
check_route "/contact" "Contact Steve Defendre | Project inquiries"

portfolio_verify_http_get "${BASE_URL}/" "${scratch}"
portfolio_verify_html_has "${scratch}" "I build software you can keep." \
  || fail "home HTML is missing the H1 text I build software you can keep."

echo "doctor: OK"
echo "RUN_ID=${RUN_ID}"
echo "BASE_URL=${BASE_URL}"
echo "START_PID=${START_PID}"
echo "LISTEN_PID=${LISTEN_PID:-}"
echo "EVIDENCE_DIR=${EVIDENCE_DIR}"
echo "identity=Steve Defendre portfolio"
echo "routes=/, /about, /projects, /contact"
