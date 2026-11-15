@echo off
title Management Dashboard Backend (:8002)
cd /d "%~dp0"
echo ============================================================
echo   Starting Management Dashboard Backend (Port 8002)
echo   FastAPI + SQLite + Customization API
echo ============================================================
python run_backend.py
pause

