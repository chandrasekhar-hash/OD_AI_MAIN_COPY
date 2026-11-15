@echo off
title Start Separate Management Dashboard (Backend :8002, Frontend :3001)
echo ============================================================
echo   Starting Separate Management Dashboard Services
echo   Backend:  http://localhost:8002 (FastAPI)
echo   Frontend: http://localhost:3001 (React / Vite)
echo ============================================================
echo.

cd /d "%~dp0"

echo [1/2] Starting Management Backend (Port 8002)...
start "Management Backend (:8002)" cmd /k "cd backend && python run_backend.py"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Management Frontend (Port 3001)...
start "Management Frontend (:3001)" cmd /k "cd frontend && npm run dev"

echo.
echo Both services launched!
echo Open http://localhost:3001 in your browser.
pause

