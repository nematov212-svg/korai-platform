import React from 'react';
import { Check, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';

export const PricingSection: React.FC = () => {
  const { t } = useLanguage();
  const { isAuthenticated, user } = useAuth();

  return (
    <section id="pricing" className="py-20 border-t border-slate-800/80 bg-navy-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            Shaffof va qulay
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.pricingTitle}
          </h2>
          <p className="text-base text-slate-400">
            {t.pricingSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="p-8 rounded-3xl glass-panel border border-slate-800 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {t.freePlanTitle}
                </h3>
                <p className="text-xs text-slate-400">
                  Kundalik uy xo‘jaligi va dastlabki ko‘rik uchun
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">{t.freePlanPrice}</span>
                <span className="text-sm text-slate-400">{t.freePlanPeriod}</span>
              </div>

              <ul className="space-y-3 text-sm text-slate-300">
                {t.freePlanFeatures.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <Link
                to={isAuthenticated ? '/app/diagnose' : '/register'}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>{user?.plan === 'FREE' ? 'Joriy tarifingiz' : 'Bepul boshlash'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Pro Tier (Featured) */}
          <div className="relative p-8 rounded-3xl glass-panel border-2 border-brand-500/50 shadow-2xl shadow-brand-500/10 flex flex-col justify-between">
            {/* Top pill */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-md">
              Tavsiya etiladi
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                  <span>{t.proPlanTitle}</span>
                  <Sparkles className="w-4 h-4 text-brand-400" />
                </h3>
                <p className="text-xs text-slate-400">
                  Professional ustalar, servis markazlari va texniklar uchun
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">{t.proPlanPrice}</span>
                <span className="text-sm text-slate-400">{t.proPlanPeriod}</span>
              </div>

              <ul className="space-y-3 text-sm text-slate-300">
                {t.proPlanFeatures.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8">
              <Link
                to="/app/billing"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <span>Pro tarifga o‘tish</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
