#!/usr/bin/env bash
set -u
endpoint="${1:-http://127.0.0.1:8080/health}"
case "$endpoint" in
  http://127.0.0.1:*) ;;
  *) printf '%s\n' 'Use a loopback training endpoint only.' >&2; exit 2 ;;
esac
if curl --fail --silent --show-error --max-time 3 "$endpoint"; then
  printf '\n%s\n' 'healthy'
else
  result=$?
  printf '\nhealth request failed: curl exit %s\n' "$result" >&2
  exit "$result"
fi