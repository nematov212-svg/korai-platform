import React from 'react';
import {
  WashingMachine,
  Car,
  Laptop,
  Wrench,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';
import { Link } from 'react-router-dom';

export const CategoriesSection: React.FC = () => {
  const { t } = useLanguage();

  const categories = [
    {
      id: 'appliances',
      title: t.cat_appliances,
      desc: t.cat_appliances_desc,
      icon: WashingMachine,
      color: 'from-blue-600 to-indigo-600',
      badge: 'Eng ommabop',
    },
    {
      id: 'automotive',
      title: t.cat_automotive,
      desc: t.cat_automotive_desc,
      icon: Car,
      color: 'from-amber-600 to-rose-600',
      badge: 'Avto diagnostika',
    },
    {
      id: 'computers',
      title: t.cat_computers,
      desc: t.cat_computers_desc,
      icon: Laptop,
      color: 'from-emerald-600 to-teal-600',
      badge: 'IT & Gadjetlar',
    },
    {
      id: 'plumbing',
      title: t.cat_plumbing,
      desc: t.cat_plumbing_desc,
      icon: Wrench,
      color: 'from-cyan-600 to-blue-600',
      badge: 'Uy & Santexnika',
    },
    {
      id: 'electronics',
      title: t.cat_electronics,
      desc: t.cat_electronics_desc,
      icon: Cpu,
      color: 'from-purple-600 to-indigo-600',
      badge: 'Mikrosxemalar',
    },
    {
      id: 'general',
      title: t.cat_general,
      desc: t.cat_general_desc,
      icon: Layers,
      color: 'from-slate-600 to-slate-800',
      badge: 'Universal',
    },
  ];

  return (
    <section id="features" className="py-20 border-t border-slate-800/80 bg-navy-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.categoriesTitle}
          </h2>
          <p className="text-base text-slate-400">
            {t.categoriesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="group p-6 rounded-2xl glass-panel glass-card-hover border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-lg shadow-black/30 group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-800/80 text-slate-300 border border-slate-700">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-400 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-brand-400 group-hover:text-brand-300">
                  <span>Tashxis boshlash</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
