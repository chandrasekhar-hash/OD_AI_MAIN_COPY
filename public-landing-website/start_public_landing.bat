@echo off
title Start Public Landing Website (Backend :8001, Frontend :5000)
echo ============================================================
echo   Starting Public Landing Website Services
echo   Backend:  http://localhost:8001 (FastAPI)
echo   Frontend: http://localhost:5000 (HTML/CSS/JS)
echo ============================================================
echo.

cd /d "%~dp0"

echo [1/2] Starting Public Website Backend (Port 8001)...
start "Public Website Backend (:8001)" cmd /k "cd backend && python run_backend.py"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Public Website Frontend (Port 5000)...
start "Public Website Frontend (:5000)" cmd /k "cd frontend && python server.py"

echo.
echo Both services launched!
echo Open http://localhost:5000 in your browser.
pause

