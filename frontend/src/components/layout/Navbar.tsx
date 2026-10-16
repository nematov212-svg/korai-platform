import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import {
  Eye,
  Globe,
  Menu,
  X,
  ArrowRight,
  User,
  LogOut,
  Sparkles,
  LayoutDashboard,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:shadow-brand-500/40 transition-all duration-300">
            <Eye className="w-6 h-6 text-white transition-transform group-hover:scale-110" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-white font-sans">
                Ko'r<span className="text-brand-400">AI</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              AI Vizual Diagnostika
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="/#features" className="hover:text-white transition-colors">
            {t.features}
          </a>
          <a href="/#how-it-works" className="hover:text-white transition-colors">
            {t.howItWorks}
          </a>
          <a href="/#safety" className="hover:text-white transition-colors">
            {t.safety}
          </a>
          <a href="/#pricing" className="hover:text-white transition-colors">
            {t.pricing}
          </a>
        </nav>

        {/* Right side controls: Language switcher & Auth CTAs */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-900/90 rounded-lg p-1 border border-slate-800">
            <Globe className="w-4 h-4 text-slate-400 ml-1.5 mr-1" />
            {(['uz', 'en', 'ru'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 text-xs font-semibold rounded uppercase transition-colors ${
                  language === lang
                    ? 'bg-brand-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-all text-sm text-slate-200"
              >
                <div className="w-7 h-7 rounded-lg bg-brand-600/30 border border-brand-500/40 text-brand-300 flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium max-w-[120px] truncate">{user.name}</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl glass-panel shadow-2xl py-2 z-50 border border-slate-700/80 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs text-slate-400">Kirilgan hisob</p>
                    <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      {user.plan} TARIF
                    </span>
                  </div>
                  <Link
                    to="/app"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-brand-400" />
                    {t.dashboard}
                  </Link>
                  <Link
                    to="/app/diagnose"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    {t.newDiagnosis}
                  </Link>
                  <Link
                    to="/app/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    {t.settings}
                  </Link>
                  <div className="border-t border-slate-800 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t.logout}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                {t.signIn}
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{t.signUp}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drop menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-slate-800 px-4 pt-3 pb-6 space-y-4">
          <nav className="flex flex-col space-y-3 text-base font-medium text-slate-300">
            <a
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white py-1"
            >
              {t.features}
            </a>
            <a
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white py-1"
            >
              {t.howItWorks}
            </a>
            <a
              href="/#safety"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white py-1"
            >
              {t.safety}
            </a>
            <a
              href="/#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-white py-1"
            >
              {t.pricing}
            </a>
          </nav>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-sm text-slate-400">Til:</span>
            <div className="flex items-center gap-1">
              {(['uz', 'en', 'ru'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 text-xs font-semibold rounded uppercase ${
                    language === lang ? 'bg-brand-600 text-white' : 'text-slate-400'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/app"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {t.dashboard}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-center text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg"
                >
                  {t.logout}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-sm font-semibold rounded-xl bg-slate-800 text-white"
                >
                  {t.signIn}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center text-sm font-semibold rounded-xl bg-brand-600 text-white"
                >
                  {t.signUp}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
