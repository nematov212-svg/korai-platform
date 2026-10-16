import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Eye,
  Camera,
  UploadCloud,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleStart = () => {
    if (isAuthenticated) {
      navigate('/app/diagnose');
    } else {
      navigate('/register');
    }
  };

  const handleQuickUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleStart();
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold backdrop-blur-sm animate-in fade-in">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>Multimodal AI Vision & Professional Texnik Tashxis</span>
          </div>

          {/* Main Headline (Uzbek as specified) */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] font-sans">
            Muammoni ko‘rsating.{' '}
            <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-indigo-500 bg-clip-text text-transparent">
              Ko‘rAI
            </span>{' '}
            yechim topishga yordam beradi.
          </h1>

          {/* Supporting description */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Suratga oling yoki yuklang. Sun’iy intellekt ko‘rinib turgan dalillarni tahlil qiladi,
            xavfsiz tekshirish qadamlarini ko‘rsatadi va kerakli asboblarni tavsiya qiladi.
          </p>

          {/* Primary & Secondary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={handleStart}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-brand-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
            >
              <Camera className="w-5 h-5" />
              <span>{t.getStarted}</span>
              <ArrowRight className="w-5 h-5 text-brand-200" />
            </button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl glass-panel text-slate-200 hover:text-white hover:bg-slate-800/80 font-semibold text-base transition-all flex items-center justify-center gap-2"
            >
              <span>{t.howItWorks}</span>
            </a>
          </div>

          {/* Interactive functional upload dropzone launcher */}
          <div className="pt-10 max-w-2xl mx-auto">
            <div
              onClick={handleStart}
              className="group cursor-pointer rounded-2xl border-2 border-dashed border-slate-700/80 hover:border-brand-500 bg-slate-900/50 hover:bg-slate-900/80 p-8 transition-all duration-300 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-7 h-7" />
              </div>
              <p className="text-base font-semibold text-white group-hover:text-brand-300 transition-colors">
                {t.dropzoneTitle}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {t.dropzoneSubtitle}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 group-hover:bg-brand-600 group-hover:text-white transition-all">
                <Camera className="w-4 h-4" />
                <span>Tekshirishni boshlash</span>
              </div>
            </div>
          </div>

          {/* Trust points */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Xavfsizlik protokollari</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-brand-400" />
              <span>Obyektiv vizual dalillar</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-indigo-400" />
              <span>Hech qanday soxta ma’lumot yo‘q</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
