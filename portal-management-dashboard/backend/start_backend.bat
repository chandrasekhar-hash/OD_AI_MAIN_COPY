@echo off
title Portal Management Backend (:8004)
cd /d "%~dp0"
echo ============================================================
echo   Starting Portal Management Backend (Port 8004)
echo   FastAPI API Server
echo ============================================================
python run_backend.py
pause

