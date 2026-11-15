# 🌟 ODAIHUB - Public Website & Management Dashboard

This repository contains the standalone full-stack codebases for the OD AI HUB ecosystem, including the **Public Landing Website**, **JS Public Site**, **OD AI Portal (Admissions)**, and the **Separate Management Dashboard**.

---

## 📌 Repositories & Services Overview

| Service | Type | Local Port | Directory | Backend API Docs |
|---|---|---|---|---|
| **Public Landing Website** | Frontend (HTML/JS Server) | `http://localhost:5000` | `public-landing-website/frontend` | - |
| **Public Landing Website** | Backend (FastAPI + SQLite) | `http://localhost:8001` | `public-landing-website/backend` | `http://localhost:8001/api/docs` |
| **JS Public Site (New)** | Frontend (HTML/CSS/JS) | `http://localhost:5050` | `js-public-site/frontend` | - |
| **JS Public Site Backend** | Backend (FastAPI + SQLite) | `http://localhost:8003` | `js-public-site/backend` | `http://localhost:8003/api/docs` |
| **OD AI Portal (Admissions)** | Frontend (React 18 + Vite) | `http://localhost:3005` | `odai_Portal` | - |
| **Separate Management Dashboard** | Frontend (Vite + React) | `http://localhost:3001` | `separate-management-dashboard/frontend` | - |
| **Separate Management Dashboard** | Backend (FastAPI + SQLite) | `http://localhost:8002` | `separate-management-dashboard/backend` | `http://localhost:8002/api/docs` |
| **PARADIGM Event Page** | Frontend (Three.js + Vite) | `http://localhost:5175` | `event page/frontend` | - |
| **PARADIGM Event Page** | Backend (FastAPI + SQLite) | `http://localhost:8005` | `event page/backend` | `http://localhost:8005/docs` |
| **Portal Management Dashboard** | Frontend (Vite + React) | `http://localhost:3002` | `portal-management-dashboard/frontend` | - |
| **Portal Management Dashboard** | Backend (FastAPI + SQLite) | `http://localhost:8004` | `portal-management-dashboard/backend` | `http://localhost:8004/api/docs` |

---

## 📂 Repository Structure

```
Public-Website-And-Management-Dashboard/
├── public-landing-website/           # Original Public Website (Port 5000 / API: 8001)
│   ├── frontend/
│   ├── backend/
│   └── database/
│
├── js-public-site/                   # Duplicate JS Public Website (Port 5050 / API: 8003)
│   ├── frontend/                     # Pure JS / HTML5 / CSS3
│   ├── backend/                      # FastAPI (Port 8003)
│   ├── start_js_public.bat
│   └── database/
│
├── odai_Portal/                      # OD AI Portal (Port 3005)
│   ├── src/                          # Admissions, ODAT Guide, Fees, Application Modal
│   ├── src/api/admissionsApi.js      # Direct Backend API Submission Client
├── event page/                       # PARADIGM 3D Event Platform
│   ├── frontend/                     # React 19 + Three.js + Vite (Port 5175)
│   ├── backend/                      # FastAPI Backend (Port 8005, edutrack.db connected)
│   ├── start.bat                     # Fullstack launcher for Event page
│   └── push_to_github.bat            # Dedicated GitHub push script
│   └── package.json
│
├── separate-management-dashboard/    # Management Dashboard (Port 3001 / API: 8002)
│   ├── frontend/                     # Management Console + "OD AI Portal Admissions" Tab
│   ├── backend/                      # FastAPI with Enquiries & Admissions CRUD
│   └── database/                     # Shared SQLite DB (edutrack.db)
│
├── portal-management-dashboard/      # Portal Management Replica (Port 3002 / API: 8004)
│   ├── frontend/
│   ├── backend/
│   └── start_portal_management.bat
│
├── start_all.bat                     # 1-click launch for all services
├── PUSH_NOW.bat
└── README.md
```

---

## 📥 Inquiries & Admissions Data Flow

1. **Visitor Submission**:
   - Visitors fill out admission forms or general enquiries on either **OD AI Portal** (`http://localhost:3000`) or **JS Public Site** (`http://localhost:5050`).
2. **Backend Ingestion**:
   - Submissions are sent via HTTP POST to `/api/v1/enquiries` on the backend (`http://localhost:8003` / `8001` / `8002`).
3. **Storage & Timestamping**:
   - Saved into SQLite table `enquiries` with full metadata: Candidate Name, Phone, Email, Academic Qualification, Selected Track, Notes, and exact UTC `created_at` timestamp.
4. **Management Dashboard Monitoring**:
   - Open Management Console (`http://localhost:3001` or `3002`) and switch to the **OD AI Portal Admissions** tab.
   - Instantly see candidate details, submission date & time ("10m ago", formatted date), track applied for, and update status (`New`, `Contacted`, `Enrolled / Closed`).
   - One-click export to CSV.

---

## 🚀 Quick Start (Localhost)

### 1-Click Launch All Services (Windows)
Double-click:
```bash
start_all.bat
```
This automatically launches all 4 services in their respective ports.

### Manual Launch

#### 1. Public Landing Website
```bash
# Backend (Port 8001)
cd public-landing-website/backend
pip install -r requirements.txt
python run_backend.py

# Frontend (Port 5000)
cd public-landing-website/frontend
python server.py
```

#### 2. Separate Management Dashboard
```bash
# Backend (Port 8002)
cd separate-management-dashboard/backend
pip install -r requirements.txt
python run_backend.py

# Frontend (Port 3001)
cd separate-management-dashboard/frontend
npm install
npm run dev
```

---

## 🔑 Default Credentials (Management Console)

- **Username**: `omm` (or `admin`)
- **Password**: `admin123`

---

## 📄 License
ODAIHUB Official Ecosystem © 2026. All Rights Reserved.
