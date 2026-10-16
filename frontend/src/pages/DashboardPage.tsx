import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { DiagnosisSession, BillingUsage } from '../types/index.js';
import {
  Sparkles,
  Camera,
  History,
  Bookmark,
  ArrowRight,
  Clock,
  Layers,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [recentDiagnoses, setRecentDiagnoses] = useState<DiagnosisSession[]>([]);
  const [billing, setBilling] = useState<BillingUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getDiagnoses({ page: 1, limit: 5 }),
      api.getBillingUsage(),
    ])
      .then(([diagRes, billRes]) => {
        setRecentDiagnoses(diagRes.items);
        setBilling(billRes);
      })
      .catch((err) => console.error('Dashboard load error:', err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-brand-900/60 via-indigo-900/40 to-slate-900/60 border border-brand-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Vizual Diagnostika Ishchi Maydoni</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Xush kelibsiz, {user?.name}!
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Muammoni suratga oling yoki yuklang. Ko'rAI ko‘rinib turgan dalillarni tahlil qilib, xavfsiz qadamlar va asboblar ro‘yxatini tayyorlaydi.
          </p>
        </div>

        <Link
          to="/app/diagnose"
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-brand-500/30 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <Camera className="w-5 h-5" />
          <span>Yangi tashxis boshlash</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Jami tashxislar</span>
            <History className="w-4 h-4 text-brand-400" />
          </div>
          <p className="text-2xl font-black text-white">
            {billing?.totalDiagnosesAllTime ?? 0}
          </p>
          <p className="text-[11px] text-slate-500">Barcha vaqtlar hisobi</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Joriy oyda foydalanilgan</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-white">
            {billing?.usedThisMonth ?? 0} / {billing?.monthlyLimit ?? 5}
          </p>
          <p className="text-[11px] text-brand-400">
            Qolgan tashxislar: {billing?.remainingThisMonth ?? 5} ta
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Tarif rejasi</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white uppercase">
            {user?.plan}
          </p>
          <p className="text-[11px] text-slate-500">
            {billing?.planTitle || 'Bepul foydalanuvchi'}
          </p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Tezkor harakat</span>
            <Bookmark className="w-4 h-4 text-amber-400" />
          </div>
          <Link
            to="/app/favorites"
            className="inline-block text-sm font-semibold text-brand-400 hover:text-brand-300 pt-1"
          >
            Saralangan hisobotlar →
          </Link>
          <p className="text-[11px] text-slate-500">Saqlangan yechimlarni ko‘rish</p>
        </div>
      </div>

      {/* Recent Diagnoses List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              So‘nggi tashxislar
            </h2>
            <p className="text-xs text-slate-400">
              Siz yaratgan eng so‘nggi diagnostika seanslari
            </p>
          </div>
          <Link
            to="/app/history"
            className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
          >
            <span>Barchasini ko‘rish</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400">Yuklanmoqda...</div>
        ) : recentDiagnoses.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass-panel border border-slate-800 space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
              <Camera className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Hozircha hech qanday tashxis yo‘q</h3>
              <p className="text-xs text-slate-400">
                Muammo yuzaga kelgan agregat yoki jihozni suratga olib birinchi tahlilni boshlang.
              </p>
            </div>
            <Link
              to="/app/diagnose"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>Birinchi tashxisni boshlash</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentDiagnoses.map((diag) => (
              <Link
                key={diag.id}
                to={`/app/history/${diag.id}`}
                className="group p-5 rounded-2xl glass-panel glass-card-hover border border-slate-800 flex items-start gap-4 transition-all"
              >
                {/* Image thumbnail or placeholder */}
                <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                  {diag.images && diag.images[0] ? (
                    <img
                      src={diag.images[0].url}
                      alt={diag.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <Camera className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 uppercase border border-slate-700">
                      {diag.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        diag.status === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : diag.status === 'FOLLOW_UP_REQUIRED'
                          ? 'bg-amber-500/20 text-amber-300'
                          : diag.status === 'ANALYZING'
                          ? 'bg-brand-500/20 text-brand-300 animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {diag.status === 'COMPLETED'
                        ? 'Tugallangan'
                        : diag.status === 'FOLLOW_UP_REQUIRED'
                        ? 'Savollar kutilmoqda'
                        : diag.status === 'ANALYZING'
                        ? 'Tahlil jarayonida'
                        : diag.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white truncate group-hover:text-brand-400 transition-colors">
                    {diag.title}
                  </h4>

                  {diag.analysis?.detectedObject && (
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      Aniqlangan: {diag.analysis.detectedObject}
                    </p>
                  )}

                  <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(diag.createdAt).toLocaleDateString('uz-UZ')}
                  </p>
                </div>

                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors self-center shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
