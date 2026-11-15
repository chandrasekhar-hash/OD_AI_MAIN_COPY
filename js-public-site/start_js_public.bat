@echo off
title Start JS Public Website (Backend :8003, Frontend :5050)
echo ============================================================
echo   Starting JS Public Website Services
echo   Backend:  http://localhost:8003 (FastAPI)
echo   Frontend: http://localhost:5050 (HTML/CSS/JS)
echo ============================================================
echo.

cd /d "%~dp0"

echo [1/2] Starting JS Public Website Backend (Port 8003)...
start "JS Public Website Backend (:8003)" cmd /k "cd backend && python run_backend.py"

timeout /t 2 /nobreak >nul

echo [2/2] Starting JS Public Website Frontend (Port 5050)...
start "JS Public Website Frontend (:5050)" cmd /k "cd frontend && python server.py"

echo.
echo Both services launched!
echo Open http://localhost:5050 in your browser.
pause

