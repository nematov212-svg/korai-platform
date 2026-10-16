import React from 'react';
import { Eye, ShieldAlert, Cpu } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-800/80 bg-navy-950/90 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <Eye className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Ko'r<span className="text-brand-400">AI</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Ko'rAI — ko‘rinib turgan texnik va maishiy nosozliklarni sun’iy intellekt orqali tahlil qiluvchi, xavfsiz dastlabki tashxis va ko‘rik choralarini tavsiya etuvchi professional vizual platforma.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-lg max-w-md">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>
                DIQQAT: Tizim maslahat xarakteriga ega. Elektr toki, gaz yoki tormoz tizimidagi xavflarda faqat sertifikatlangan mutaxassisga murojaat qiling.
              </span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Yo‘nalishlar
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/#categories" className="hover:text-white transition-colors">Maishiy texnika</a></li>
              <li><a href="/#categories" className="hover:text-white transition-colors">Avtomobil agregatlari</a></li>
              <li><a href="/#categories" className="hover:text-white transition-colors">Kompyuter & Gadjetlar</a></li>
              <li><a href="/#categories" className="hover:text-white transition-colors">Santexnika & Isitish</a></li>
              <li><a href="/#categories" className="hover:text-white transition-colors">Elektronika platalari</a></li>
            </ul>
          </div>

          {/* Legal & Platform */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Platforma & Huquqiy
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="/#safety" className="hover:text-white transition-colors">Xavfsizlik reglamenti</a></li>
              <li><a href="/#pricing" className="hover:text-white transition-colors">Tarif rejalari</a></li>
              <li><span className="text-slate-500">Maxfiylik siyosati</span></li>
              <li><span className="text-slate-500">Foydalanish shartlari</span></li>
              <li className="pt-2 flex items-center gap-2 text-xs text-slate-500">
                <Cpu className="w-3.5 h-3.5 text-brand-400" />
                <span>Multimodal Vision Engine v1.0</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/60 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Ko'rAI Platformasi. Barcha huquqlar himoyalangan.</p>
          <p className="text-slate-400">Toshkent, O‘zbekiston</p>
        </div>
      </div>
    </footer>
  );
};
