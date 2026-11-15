@echo off
title Portal Management Frontend (:3002)
cd /d "%~dp0"
echo ============================================================
echo   Starting Portal Management Frontend Server (Port 3002)
echo   Dashboard UI: http://localhost:3002
echo ============================================================
npm run dev
pause

