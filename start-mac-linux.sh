#!/usr/bin/env bash
# ============================================================
#  DevOps Learning Academy - Mac/Linux launcher
#  Double-click this file (or run ./start-mac-linux.sh)
#  to start the app in your browser.
# ============================================================
set -e
cd "$(dirname "$0")"
echo "Starting DevOps Learning Academy..."

# Try python3 first (most systems have it)
if command -v python3 >/dev/null 2>&1; then
  echo "Opening http://localhost:8765/ in your browser..."
  (sleep 1 && (open http://localhost:8765/ 2>/dev/null || xdg-open http://localhost:8765/ 2>/dev/null || true) ) &
  echo
  echo "Academy is running at http://localhost:8765/"
  echo "Press Ctrl+C in this window to stop it."
  echo
  exec python3 -m http.server 8765
fi

# Try python (older systems)
if command -v python >/dev/null 2>&1; then
  echo "Opening http://localhost:8765/ in your browser..."
  (sleep 1 && (open http://localhost:8765/ 2>/dev/null || xdg-open http://localhost:8765/ 2>/dev/null || true) ) &
  echo
  echo "Academy is running at http://localhost:8765/"
  echo "Press Ctrl+C in this window to stop it."
  echo
  exec python -m http.server 8765
fi

echo
echo "Sorry, Python was not found on this computer."
echo
echo "Option 1: Install Python from https://www.python.org/downloads/"
echo "          (Mac/Linux usually have it pre-installed)"
echo
echo "Option 2: Just open dist/index.html directly in your browser."
echo "          Some browsers may show a blank page; if so, use Option 1."
echo
exit 1
