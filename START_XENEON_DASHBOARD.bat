@echo off
cd /d "%~dp0"
echo Starting XENEON CS2 Dashboard...
echo.
node bridge\server.js
pause
