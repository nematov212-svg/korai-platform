import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage } from '../context/LanguageContext.js';
import {
  User,
  Globe,
  Shield,
  Trash2,
  Check,
  AlertTriangle,
  Lock,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleLanguageChange = (lang: 'uz' | 'en' | 'ru') => {
    setLanguage(lang);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Sozlamalar
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Profilingiz, til afzalliklari va xavfsizlik parametrlari
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Sozlamalar muvaffaqiyatli saqlandi!</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <User className="w-5 h-5 text-brand-400" />
          <h2 className="text-lg font-bold text-white">Foydalanuvchi ma’lumotlari</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-xs">Foydalanuvchi ismi:</span>
            <span className="font-semibold text-white mt-1 block">{user?.name}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-xs">Elektron pochta:</span>
            <span className="font-semibold text-white mt-1 block truncate">{user?.email}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-xs">Joriy tarif:</span>
            <span className="font-bold text-brand-400 mt-1 block uppercase">{user?.plan}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-xs">A’zolik sanasi:</span>
            <span className="font-mono text-slate-300 mt-1 block">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('uz-UZ') : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Language Preference */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <Globe className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">Interfeys tili</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'uz', title: "O'zbek tili (Lotin)", label: 'Asosiy til' },
            { id: 'en', title: 'English', label: 'International' },
            { id: 'ru', title: 'Русский', label: 'Региональный' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleLanguageChange(item.id as any)}
              className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                language === item.id
                  ? 'bg-brand-600/20 border-brand-500 text-white shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div>
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.label}</p>
              </div>
              {language === item.id && <Check className="w-4 h-4 text-brand-400" />}
            </button>
          ))}
        </div>
      </div>

      {/* AI Privacy & Third-party Processing Notice */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <Shield className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Maxfiylik va Sun’iy Intellekt ma’lumotlari</h2>
        </div>

        <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
          <p>
            • <strong>Uchinchi tomon AI provayderlari:</strong> Tashxis jarayonida yuklangan fotosuratlar faqat texnik tahlil maqsadida rasmiy himoyalangan API shlyuzlari (Google Gemini yoki OpenAI) orqali yuboriladi.
          </p>
          <p>
            • <strong>Shaxsiy ma’lumotlar:</strong> AI provayderiga foydalanuvchining shaxsiy ism-sharifi, paroli yoki hisob ma’lumotlari hech qachon yuborilmaydi.
          </p>
          <p>
            • <strong>Rozilik asosida saqlash va o‘chirish:</strong> Siz istalgan paytda «Tashxislar tarixi» bo‘limidan o‘z hisobotlaringizni o‘chirib yuborishingiz mumkin. O‘chirilgan tashxisga tegishli barcha original fotosuratlar server diskidan to‘liq o‘chiriladi.
          </p>
        </div>
      </div>
    </div>
  );
};
