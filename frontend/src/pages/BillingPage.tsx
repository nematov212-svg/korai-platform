import React, { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { BillingUsage } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import {
  CreditCard,
  Check,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  FileCode,
} from 'lucide-react';

export const BillingPage: React.FC = () => {
  const { user } = useAuth();
  const [billing, setBilling] = useState<BillingUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getBillingUsage()
      .then(setBilling)
      .catch((err) => console.error('Failed to load billing:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const usagePercent = billing
    ? Math.min(100, Math.round((billing.usedThisMonth / billing.monthlyLimit) * 100))
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Tarif va Limitlar
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Hisobingizning oylik AI tashxis kvotasi va tarif ma’lumotlari
        </p>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-400">Yuklanmoqda...</div>
      ) : (
        <>
          {/* Current Quota Meter Card */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Faol tarifingiz
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <h2 className="text-2xl font-black text-white">
                    {billing?.planTitle || 'Bepul Tarif'}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase">
                    {billing?.plan}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs font-semibold text-slate-400">
                  Hisoblash davri
                </span>
                <p className="text-sm font-mono text-white font-bold">
                  {billing?.currentMonth}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300">
                  Ishlatilgan: {billing?.usedThisMonth} / {billing?.monthlyLimit} ta tashxis
                </span>
                <span className="text-brand-400 font-mono">{usagePercent}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    usagePercent >= 90
                      ? 'bg-rose-500'
                      : usagePercent >= 70
                      ? 'bg-amber-500'
                      : 'bg-gradient-to-r from-brand-600 to-indigo-500'
                  }`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
              <p className="text-xs text-slate-400">
                Ushbu oyda qolgan bepul/ajratilgan tashxislar: <strong className="text-white">{billing?.remainingThisMonth} ta</strong>
              </p>
            </div>
          </div>

          {/* Plan Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Bepul Tarif</h3>
                  {billing?.plan === 'FREE' && (
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      Joriy reja
                    </span>
                  )}
                </div>
                <div className="text-3xl font-black text-white">0 so‘m</div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Oyiga 5 tagacha tashxis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Bitta seans uchun 3 tagacha rasm</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Tashxislar arxivi</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pro */}
            <div className="p-6 sm:p-8 rounded-3xl glass-panel border-2 border-brand-500/40 flex flex-col justify-between relative shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Pro Mutaxassis</span>
                    <Sparkles className="w-4 h-4 text-brand-400" />
                  </h3>
                  {billing?.plan === 'PRO' && (
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      Joriy reja
                    </span>
                  )}
                </div>
                <div className="text-3xl font-black text-white">
                  49,000 so‘m <span className="text-xs text-slate-400 font-normal">/ oy</span>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-400" />
                    <span>Oyiga 100 tagacha chuqurlashtirilgan tashxis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-400" />
                    <span>Bitta seansda 5 tagacha yuqori aniqlikdagi rasm</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-400" />
                    <span>Interaktiv aniqlashtiruvchi savol-javoblar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-400" />
                    <span>Prioritet AI tahlil tezligi</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Transparent Payment Integration Note */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5 text-amber-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h4 className="text-sm font-bold text-white">
                To‘lov tizimi integratsiyasi haqida ma’lumot
              </h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ko'rAI loyihasi shaffoflik tamoyiliga qat’iy amal qiladi. Hozirda haqiqiy to‘lov shlyuzi (Payme, Click yoki Stripe) billing modullari ishlab chiqilgan, ammo production bank hisob ma’lumotlari ulanmagunicha foydalanuvchilardan to‘lov undirilmaydi.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1">
              <p>• To‘lov provayderi: Click / Payme / Stripe webhook handlerlari</p>
              <p>• Valyuta: UZS (O‘zbekiston so‘mi) / USD</p>
              <p>• Sozlash qo‘llanmasi: docs/BILLING_SETUP.md faylida batafsil keltirilgan</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
