#!/usr/bin/env bash
# Compatibility entrypoint; lifecycle/state handling lives in instance.py.
set -euo pipefail
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec python3 "${script_dir}/instance.py" doctor "$@"
