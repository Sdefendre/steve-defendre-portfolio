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

portfolio_verify_port_pids() {
  local port="${1}"
  if command -v lsof >/dev/null 2>&1; then
    lsof -t -iTCP:"${port}" -sTCP:LISTEN 2>/dev/null || true
    return
  fi
  if command -v ss >/dev/null 2>&1; then
    ss -ltnp "sport = :${port}" 2>/dev/null \
      | sed -n 's/.*pid=\([0-9][0-9]*\).*/\1/p' \
      | sort -u || true
  fi
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
