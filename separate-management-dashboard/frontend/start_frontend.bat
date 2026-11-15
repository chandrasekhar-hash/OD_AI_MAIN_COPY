@echo off
title Management Dashboard Frontend (:3001)
cd /d "%~dp0"
echo ============================================================
echo   Starting Management Dashboard Frontend Server (Port 3001)
echo   Dashboard UI: http://localhost:3001
echo ============================================================
npm run dev
pause

