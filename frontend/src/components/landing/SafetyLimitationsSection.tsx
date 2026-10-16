import React from 'react';
import {
  ShieldAlert,
  Zap,
  Flame,
  AlertOctagon,
  HeartPulse,
  Building,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.js';

export const SafetyLimitationsSection: React.FC = () => {
  const { t } = useLanguage();

  const rules = [
    {
      icon: Zap,
      title: 'Elektr toki va 220V/380V tarmoqlari',
      desc: 'Elektr jihozlari korpusini ochish yoki yalang‘och simlarga teginish o‘ta xavfli. Bunday hollarda faqat malakali elektrik chaqirilishi shart.',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: Flame,
      title: 'Gaz va yonuvchan moddalar',
      desc: 'Agar gaz hidi, sizishi yoki ochiq alanga xavfi bo‘lsa, zudlik bilan gaz jo‘mragini yoping, xonani shamollating va 104 gaz xizmatiga qo‘ng‘iroq qiling.',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
    {
      icon: AlertOctagon,
      title: 'Avtomobil tormoz va rul tizimi',
      desc: 'Harakatlanish xavfsizligiga daxldor bo‘lgan tormoz, shina va rul nosozliklarida mashinani haydamang. Evakuatordan foydalaning.',
      color: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    },
    {
      icon: HeartPulse,
      title: 'Tibbiy yoki jismoniy jarohatlar emas',
      desc: "Ko‘rAI inson salomatligi yoki tan jarohatlarini tashxislash uchun mo‘ljallanmagan. Tibbiy muammolarda 103 tez yordamga murojaat qiling.",
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
  ];

  return (
    <section id="safety" className="py-20 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>Qat’iy xavfsizlik standarti</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t.safetyTitle}
          </h2>
          <p className="text-base text-slate-400">
            {t.safetySubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {rules.map((rule, idx) => {
            const Icon = rule.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${rule.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    {rule.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed pl-12">
                  {rule.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Disclaimer box */}
        <div className="mt-12 max-w-4xl mx-auto p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center text-xs text-slate-400 space-y-2">
          <p className="font-semibold text-slate-300">
            AI Tahlili bo‘yicha xolislik kafolati:
          </p>
          <p className="max-w-2xl mx-auto leading-relaxed">
            Agar yuklangan tasvirdagi vizual dalillar muammoning aniq sababini isbotlash uchun yetarli bo‘lmasa,
            Ko'rAI hech qachon qat’iy tashxis da’vo qilmaydi. Tizim aniqlashtiruvchi savollarni beradi yoki professional usta ko‘rigini ochiq tavsiya qiladi.
          </p>
        </div>
      </div>
    </section>
  );
};
