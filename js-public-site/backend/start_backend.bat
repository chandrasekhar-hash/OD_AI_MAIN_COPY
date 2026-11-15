@echo off
title JS Public Website Backend (:8003)
cd /d "%~dp0"
echo ============================================================
echo   Starting JS Public Website Backend (Port 8003)
echo   FastAPI + SQLite API Server
echo ============================================================
python run_backend.py
pause

