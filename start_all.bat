@echo off
title Start All Services (OD AI HUB Ecosystem)
echo ============================================================
echo   Starting All OD AI HUB Services
echo ============================================================
echo.

cd /d "%~dp0"

echo [1/7] Starting Public Landing Website Backend (Port 8001)...
start "Public Website Backend (:8001)" cmd /k "cd public-landing-website\backend && python run_backend.py"

timeout /t 2 /nobreak >nul

echo [2/7] Starting Public Landing Website Frontend (Port 5000)...
start "Public Website Frontend (:5000)" cmd /k "cd public-landing-website\frontend && python server.py"

timeout /t 2 /nobreak >nul

echo [3/7] Starting JS Public Site Backend (Port 8003)...
start "JS Public Website Backend (:8003)" cmd /k "cd js-public-site\backend && python run_backend.py"

timeout /t 2 /nobreak >nul

echo [4/7] Starting JS Public Site Frontend (Port 5050)...
start "JS Public Website Frontend (:5050)" cmd /k "cd js-public-site\frontend && python server.py"

timeout /t 2 /nobreak >nul

echo [5/7] Starting Management Dashboard Backend (Port 8002) and Frontend (Port 3001)...
start "Management Backend (:8002)" cmd /k "cd separate-management-dashboard\backend && python run_backend.py"
start "Management Frontend (:3001)" cmd /k "cd separate-management-dashboard\frontend && npm run dev"

timeout /t 2 /nobreak >nul

echo [6/7] Starting OD AI Portal (Port 3005)...
start "OD AI Portal (:3005)" cmd /k "cd odai_Portal && npm run dev"

timeout /t 2 /nobreak >nul

echo [7/7] Starting PARADIGM Event Page Backend (Port 8005) and Frontend (Port 5175)...
start "PARADIGM Event Backend (:8005)" cmd /k "cd \"event page\"\backend && python run_backend.py"
start "PARADIGM Event Frontend (:5175)" cmd /k "cd \"event page\"\frontend && npm run dev"

echo.
echo ============================================================
echo All services launched!
echo.
echo Public Website (Original): http://localhost:5000  (API: :8001)
echo JS Public Site:            http://localhost:5050  (API: :8003)
echo OD AI Portal:              http://localhost:3005
echo Management Dashboard:      http://localhost:3001  (API: :8002)
echo PARADIGM Event Page:       http://localhost:5175  (API: :8005)
echo.
echo Management Login:  admin/admin  |  editor/editor  |  viewer/viewer
echo ============================================================
pause
