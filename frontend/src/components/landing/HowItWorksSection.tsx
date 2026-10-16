import React from 'react';
import { Camera, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';

export const HowItWorksSection: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    {
      num: '01',
      title: t.step1Title,
      desc: t.step1Desc,
      icon: Camera,
      color: 'border-brand-500/40 bg-brand-500/10 text-brand-400',
    },
    {
      num: '02',
      title: t.step2Title,
      desc: t.step2Desc,
      icon: Sparkles,
      color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400',
    },
    {
      num: '03',
      title: t.step3Title,
      desc: t.step3Desc,
      icon: ShieldCheck,
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            Oddiy va tushunarli jarayon
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.stepsTitle}
          </h2>
          <p className="text-base text-slate-400">
            Murakkab texnik bilimlarsiz muammoning ildizini aniqlang
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={i}
                className="relative p-8 rounded-3xl glass-panel border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${st.color}`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="font-mono text-3xl font-black text-slate-700">
                      {st.num}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">
                    {st.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {st.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/60 flex items-center text-xs font-semibold text-slate-500">
                  <span>Bosqich {i + 1} / 3</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
