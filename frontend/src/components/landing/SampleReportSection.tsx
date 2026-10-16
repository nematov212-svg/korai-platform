import React from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  Wrench,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';

export const SampleReportSection: React.FC = () => {
  return (
    <section className="py-20 border-t border-slate-800/80 bg-navy-900/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            Namunaviy hisobot
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ko'rAI diagnostika hisoboti qanday ko‘rinadi?
          </h2>
          <p className="text-base text-slate-400">
            Haqiqiy tahlil natijasida tayyorlanadigan obyektiv va amaliy ma’lumotlar ko‘rinishi
          </p>
        </div>

        {/* Illustrative Label Alert */}
        <div className="max-w-4xl mx-auto mb-6 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300">
            ℹ️ Namunaviy tahlil ma’lumotlari (Demonstratsion namuna)
          </span>
          <span className="font-mono text-[11px] bg-slate-900 px-2 py-0.5 rounded text-brand-300">
            ID: DEMO-SAMPLE-2026
          </span>
        </div>

        {/* Mock Report Card */}
        <div className="max-w-4xl mx-auto rounded-3xl glass-panel border border-slate-700/80 p-6 sm:p-10 shadow-2xl space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase">
                  Maishiy texnika
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase">
                  Xavf: O‘rta (MEDIUM)
                </span>
              </div>
              <h3 className="text-2xl font-black text-white">
                Samsung EcoBubble — Drenaj filtri sohasida suv sizishi
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Model: WW70J52E0HW (Tekshiruv sanasi: 16-Oktyabr 2026)
              </p>
            </div>
          </div>

          {/* Safety warning */}
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-rose-200">
              <strong>Xavfsizlik ogohlantirishi:</strong> Mashinani ochish yoki ko‘rikdan o‘tkazishdan oldin elektr vilkasini rozetkadan uzing! Nam qo‘l bilan elektr qismlarga tegmang.
            </p>
          </div>

          {/* Evidence and Causes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visible evidence */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Aniqlangan vizual dalillar</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-brand-400 font-bold">•</span>
                  <span>Old pastki o‘ng burchakdagi texnik lyuk qopqog‘idan suv oqimi izlari</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-400 font-bold">•</span>
                  <span>Korpus ostida ko‘lmak hosil bo‘lgan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-400 font-bold">•</span>
                  <span>Drenaj shlangida mexanik yorilish alomati ko‘rinmaydi</span>
                </li>
              </ul>
            </div>

            {/* Ranked causes */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-400" />
                <span>Ehtimoliy sabablar</span>
              </h4>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
                  <div className="flex items-center justify-between font-semibold text-white mb-1">
                    <span>1. Filtr rezina zichlagichi bo‘shashi</span>
                    <span className="text-rose-400 font-mono">Yuqori ehtimol</span>
                  </div>
                  <p className="text-slate-400">Filtr oxirigacha burab mahkamlanmagan yoki rezina halqasiga cho‘kindi yopishgan.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Safe steps */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Xavfsiz dastlabki harakatlar</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-1">1. Elektrni uzing</span>
                Mashina vilkasini elektr tarmog‘idan sug‘uring.
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-1">2. Favqulodda to‘kish</span>
                Pastki lyukni ochib, kichik shlang orqali suvni idishga oling.
              </div>
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-1">3. Filtrni tozalang</span>
                Filtrni sekin burab oching va rezinasini artib qayta torting.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
