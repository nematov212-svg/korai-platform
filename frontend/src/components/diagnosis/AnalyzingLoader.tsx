import React, { useEffect, useState } from 'react';
import { Eye, ShieldCheck, Cpu, Search, Sparkles } from 'lucide-react';

export const AnalyzingLoader: React.FC = () => {
  const steps = [
    { icon: Search, label: 'Tasvirdagi vizual dalillar va artefaktlar o‘rganilmoqda...' },
    { icon: Cpu, label: 'Multimodal AI modeli orqali agregat va uzel aniqlanmoqda...' },
    { icon: ShieldCheck, label: 'Elektr, gaz va mexanik xavfsizlik darajasi tekshirilmoqda...' },
    { icon: Sparkles, label: 'Xavfsiz tekshirish qadamlari va sabablar tartiblanmoqda...' },
  ];

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2400);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-brand-500/30 shadow-2xl flex flex-col items-center text-center max-w-xl mx-auto space-y-8 animate-in fade-in">
      {/* Visual radar / scanner circle */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        {/* Outer pulsating rings */}
        <div className="absolute inset-0 rounded-full border-2 border-brand-500/20 animate-ping opacity-75" />
        <div className="absolute inset-2 rounded-full border border-indigo-500/30 animate-pulse" />
        <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-brand-600/20 to-indigo-600/20 backdrop-blur-sm" />

        {/* Center eye icon */}
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/40">
          <Eye className="w-8 h-8 text-white animate-pulse" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Ko'rAI vizual tahlilni amalga oshirmoqda
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md">
          Suratdagi uzel holati, namlik, deformatsiya, lehim va shikastlanish belgilari o‘rganilmoqda
        </p>
      </div>

      {/* Progress steps animation */}
      <div className="w-full space-y-3 text-left">
        {steps.map((st, i) => {
          const Icon = st.icon;
          const isDone = i < activeStep;
          const isCurrent = i === activeStep;

          return (
            <div
              key={i}
              className={`flex items-center gap-3.5 p-3 rounded-xl border text-xs sm:text-sm transition-all duration-300 ${
                isCurrent
                  ? 'bg-brand-500/10 border-brand-500/40 text-brand-300 font-semibold'
                  : isDone
                  ? 'bg-slate-900/40 border-slate-800 text-slate-400'
                  : 'bg-transparent border-transparent text-slate-600'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isCurrent
                    ? 'bg-brand-600 text-white animate-spin'
                    : isDone
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-slate-800 text-slate-600'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="flex-1 truncate">{st.label}</span>
              {isDone && <span className="text-xs text-emerald-400 font-bold">✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
