@echo off
title Start Portal Management Dashboard (Backend :8004, Frontend :3002)
echo ============================================================
echo   Starting Portal Management Dashboard Services
echo   Backend:  http://localhost:8004 (FastAPI)
echo   Frontend: http://localhost:3002 (React / Vite)
echo ============================================================
echo.

cd /d "%~dp0"

echo [1/2] Starting Portal Management Backend (Port 8004)...
start "Portal Management Backend (:8004)" cmd /k "cd backend && python run_backend.py"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Portal Management Frontend (Port 3002)...
start "Portal Management Frontend (:3002)" cmd /k "cd frontend && npm run dev"

echo.
echo Both services launched!
echo Open http://localhost:3002 in your browser.
pause

