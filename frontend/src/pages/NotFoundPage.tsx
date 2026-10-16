import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-400 mb-6 shadow-xl">
        <Eye className="w-8 h-8" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-black text-white mb-2">404</h1>
      <h2 className="text-xl font-bold text-slate-300 mb-2">Sahifa topilmadi</h2>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-6">
        Siz qidirayotgan manzil mavjud emas yoki boshqa joyga ko‘chirilgan bo‘lishi mumkin.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-semibold transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Bosh sahifaga qaytish</span>
      </Link>
    </div>
  );
};
