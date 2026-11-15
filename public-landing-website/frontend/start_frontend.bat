@echo off
title Public Landing Website Frontend (:5000)
cd /d "%~dp0"
echo ============================================================
echo   Starting Public Landing Website Frontend Server (Port 5000)
echo   Public site: http://localhost:5000
echo ============================================================
python server.py
pause

