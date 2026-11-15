@echo off
title Public Landing Website Backend (:8001)
cd /d "%~dp0"
echo ============================================================
echo   Starting Public Landing Website Backend (Port 8001)
echo   FastAPI + SQLite API Server
echo ============================================================
python run_backend.py
pause

