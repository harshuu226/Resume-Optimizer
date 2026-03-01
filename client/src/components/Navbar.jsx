import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const SunIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
);
const MoonIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);
const ChevronDown = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
  </svg>
);

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { dark, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => { if (!dropRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-md shadow-brand-500/30">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight">ResumeAI</span>
        </Link>

        <div className="flex items-center gap-2">
          <button onClick={toggle} className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors" aria-label="Toggle theme">
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>

          {user ? (
            <div className="relative" ref={dropRef}>
              <button onClick={() => setOpen(o => !o)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden sm:block">{user.name}</span>
                <ChevronDown />
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-52 card shadow-lg shadow-black/10 py-1 animate-slide-up">
                  <div className="px-4 py-2 border-b border-surface-100 dark:border-surface-700">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Account</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate mt-0.5">{user.email}</p>
                  </div>
                  {[
                    { to: '/dashboard', label: 'Dashboard' },
                    { to: '/history', label: 'History' },
                    ...(isAdmin ? [{ to: '/admin', label: 'Admin Panel' }] : [])
                  ].map(item => (
                    <Link key={item.to} to={item.to} onClick={() => setOpen(false)}
                      className="block px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-surface-100 dark:border-surface-700 mt-1 pt-1">
                    <button onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-secondary text-sm px-4 py-2">Sign in</Link>
              <Link to="/register" className="btn-primary text-sm px-4 py-2">Get started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
