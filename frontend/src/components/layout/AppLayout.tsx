import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { api } from '../../services/api.js';
import { BillingUsage } from '../../types/index.js';
import {
  Eye,
  LayoutDashboard,
  PlusCircle,
  History,
  Bookmark,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Globe,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [billingSummary, setBillingSummary] = useState<BillingUsage | null>(null);

  useEffect(() => {
    api.getBillingUsage()
      .then(setBillingSummary)
      .catch(() => {});
  }, [location.pathname]);

  const navItems = [
    { to: '/app', label: t.dashboard, icon: LayoutDashboard },
    { to: '/app/diagnose', label: t.newDiagnosis, icon: PlusCircle, isHighlight: true },
    { to: '/app/history', label: t.history, icon: History },
    { to: '/app/favorites', label: t.favorites, icon: Bookmark },
    { to: '/app/billing', label: t.billing, icon: CreditCard },
    { to: '/app/settings', label: t.settings, icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const usagePercent = billingSummary
    ? Math.min(100, Math.round((billingSummary.usedThisMonth / billingSummary.monthlyLimit) * 100))
    : 0;

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col md:flex-row text-slate-100">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-800 glass-panel sticky top-0 z-40">
        <Link to="/app" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <Eye className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg text-white">Ko'rAI</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar for Desktop & Mobile Overlay */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-navy-900 border-r border-slate-800/80 p-5 flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black text-white">
                  Ko'r<span className="text-brand-400">AI</span>
                </span>
                <p className="text-[10px] text-slate-400 font-medium">Vizual Diagnostika</p>
              </div>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Quick Info */}
          <div className="mt-5 p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-600/30 border border-brand-500/40 text-brand-300 flex items-center justify-center font-bold text-sm">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase">
                {user?.plan}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.to === '/app'
                  ? location.pathname === '/app'
                  : location.pathname.startsWith(item.to);

              if (item.isHighlight) {
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 my-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-white animate-pulse" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/70" />
                  </Link>
                );
              }

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-brand-400 font-semibold border border-slate-700/80 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Quota Meter & Logout */}
        <div className="pt-6 border-t border-slate-800/80 space-y-4">
          {billingSummary && (
            <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">Oylik kvota</span>
                <span className="text-brand-400">
                  {billingSummary.usedThisMonth} / {billingSummary.monthlyLimit}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    usagePercent >= 90
                      ? 'bg-rose-500'
                      : usagePercent >= 70
                      ? 'bg-amber-500'
                      : 'bg-brand-500'
                  }`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Qolgan tashxislar: {billingSummary.remainingThisMonth} ta
              </p>
            </div>
          )}

          {/* Language Switcher */}
          <div className="flex items-center justify-between px-1 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Til:</span>
            </div>
            <div className="flex items-center gap-1">
              {(['uz', 'en', 'ru'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-1.5 py-0.5 rounded uppercase font-semibold ${
                    language === lang ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.logout}</span>
          </button>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen bg-navy-950">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
