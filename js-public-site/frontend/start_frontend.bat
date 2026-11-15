@echo off
title JS Public Website Frontend (:5050)
cd /d "%~dp0"
echo ============================================================
echo   Starting JS Public Website Frontend Server (Port 5050)
echo   Public site: http://localhost:5050
echo ============================================================
python server.py
pause

