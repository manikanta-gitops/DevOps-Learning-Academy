@echo off
REM ============================================================
REM  DevOps Learning Academy - Windows launcher
REM  Double-click this file to start the app in your browser.
REM ============================================================

cd /d "%~dp0"
echo Starting DevOps Learning Academy...

REM Try Python first (most systems have it)
python -m http.server 8765 >nul 2>&1
if %errorlevel%==0 (
  start "" http://localhost:8765/
  echo.
  echo Academy is running at http://localhost:8765/
  echo Press Ctrl+C in this window to stop it.
  pause >nul
  exit /b
)

REM Try py launcher (Windows Python launcher)
py -m http.server 8765 >nul 2>&1
if %errorlevel%==0 (
  start "" http://localhost:8765/
  echo.
  echo Academy is running at http://localhost:8765/
  echo Press Ctrl+C in this window to stop it.
  pause >nul
  exit /b
)

echo.
echo Sorry, Python was not found on this computer.
echo.
echo Option 1: Install Python from https://www.python.org/downloads/
echo          (just download and run the installer, no admin needed)
echo.
echo Option 2: Just open dist/index.html directly in your browser.
echo          Some browsers may show a blank page; if so, use Option 1.
echo.
pause
