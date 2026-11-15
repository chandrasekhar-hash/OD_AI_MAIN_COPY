import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../auth/AuthModal';

const ManagementNavbar = () => {
  const { user, logout, isAdmin, isEditor } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const navigate = useNavigate();
  const location = useLocation();

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <>
      <nav className="bg-surface-container-lowest/90 backdrop-blur-xl docked full-width top-0 sticky z-50 shadow-sm border-b border-outline-variant/30">
        <div className="flex justify-between items-center w-full px-6 py-3.5 max-w-screen-2xl mx-auto">
          {/* Brand & Management Tag */}
          <div className="flex items-center gap-4">
            <Link to="/" className="font-headline text-2xl font-bold text-primary tracking-tight flex items-center gap-3">
              <img src="/logo.jpg" alt="OD AI HUB Logo" className="w-9 h-9 rounded-full object-cover shadow-sm border border-outline-variant/30" />
              <span>OD AI HUB</span>
            </Link>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold text-primary">
              <span className="material-symbols-outlined text-sm">database</span>
              <span>Data Entry & Management Dashboard</span>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={() => {
                const isDark = document.documentElement.classList.toggle('dark');
                localStorage.setItem('edutrack_theme', isDark ? 'dark' : 'light');
              }}
              className="w-8 h-8 rounded-full border border-outline-variant/40 flex items-center justify-center text-sm text-on-surface hover:bg-surface-container transition-colors shadow-2xs"
              title="Toggle Light / Dark Mode"
              type="button"
            >
              ☀️
            </button>

            {/* Links to Public Portals */}
            <a
              href="http://localhost:5050"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
              title="Open JS Public Website on port 5050"
            >
              <span className="material-symbols-outlined text-base">desktop_windows</span>
              <span>Public Site (:5050)</span>
            </a>

            {/* Auth section */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="font-label text-xs font-bold text-on-surface tracking-wide">{user.username}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant border border-outline-variant/30">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="font-label text-xs font-bold px-3 py-1.5 rounded-xl border border-outline-variant hover:bg-surface-container-high text-on-surface transition-all shadow-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="font-label text-xs font-semibold px-3.5 py-1.5 rounded-xl border border-outline-variant hover:bg-surface-container-high text-on-surface transition-all shadow-xs"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="font-label text-xs font-bold px-3.5 py-1.5 rounded-xl bg-primary text-on-primary hover:bg-primary/90 transition-all shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default ManagementNavbar;
