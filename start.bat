@echo off
setlocal
cd /d "%~dp0"

set "LOG_DIR=%~dp0logs"
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

set "LOG_FILE=%LOG_DIR%\dev.log"
echo [%%DATE%% %%TIME%%] Starting Vite... > "%LOG_FILE%"
npm run dev >> "%LOG_FILE%" 2>&1
