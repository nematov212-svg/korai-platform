import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Qanday fotosurat yuklash tashxis sifatini oshiradi?',
      a: 'Yaxshi yoritilgan, xiralashmagan, muammoli nuqtani ham umumiy kontekstda, ham yaqindan ko‘rsatadigan suratlar eng yaxshi natija beradi. Agar imkon bo‘lsa, qurilmaning model yorlig‘i (stikeri) aks etgan suratni ham qo‘shing.',
    },
    {
      q: 'Suratning o‘zidan sababni aniqlab bo‘lmasa nima bo‘ladi?',
      a: 'Ko‘rAI hech qachon taxminiy yolg‘on xulosa chiqarmaydi. Agar ko‘rinib turgan dalillar yetarli bo‘lmasa, AI sizga aniqlashtiruvchi savollarni (masalan, "qurilma yoqilganda qanday ovoz chiqadi?", "muammo qachon boshlangan?") taqdim etadi va javoblaringiz asosida tahlilni to‘ldiradi.',
    },
    {
      q: 'Ko‘rAI professional usta o‘rnini bosa oladimi?',
      a: 'Yo‘q. Ko‘rAI — vizual ko‘makchi va dastlabki tashxis vositasi. Ayniqsa yuqori kuchlanishli elektr, gaz, yuqori bosimli qozonlar va avtomobil tormoz tizimidagi nosozliklarda faqat sertifikatlangan ustalarga murojaat qilish shart.',
    },
    {
      q: 'Mening yuklagan suratlarim maxfiyligi qanday ta’minlanadi?',
      a: 'Suratlaringiz faqat sizning hisobingizga biriktirilgan holda shifrlangan muhitda saqlanadi. Istalgan vaqtda tashxisni o‘chirib yuborsangiz, serverdagi asl fotosuratlar ham butunlay yo‘q qilinadi.',
    },
    {
      q: 'Qaysi texnika turlari qo‘llab-quvvatlanadi?',
      a: 'Maishiy texnika (kir yuvish, muzlatgich, plita), avtomobil qismlari, kompyuter va telefonlar, santexnika, elektronika platalari va boshqa barcha ko‘rinadigan mexanik shikastlanishlar.',
    },
  ];

  return (
    <section className="py-20 border-t border-slate-800/80 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
            <HelpCircle className="w-4 h-4 text-brand-400" />
            <span>Savollaringiz bormi?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tez-tez beriladigan savollar
          </h2>
          <p className="text-base text-slate-400">
            Platforma, AI imkoniyatlari va xavfsizlik haqida eng ko‘p uchraydigan savollarga javoblar
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl glass-panel border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                >
                  <span className="font-bold text-white text-base sm:text-lg">
                    {item.q}
                  </span>
                  <div className="p-1 rounded-lg bg-slate-800 text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
