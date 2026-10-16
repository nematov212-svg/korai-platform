import React, { useState } from 'react';
import { FollowUpQuestion } from '../../types/index.js';
import { HelpCircle, Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface FollowUpFormProps {
  questions: FollowUpQuestion[];
  onSubmit: (answers: Array<{ questionId: string; answerText: string }>) => Promise<void>;
  isLoading: boolean;
}

export const FollowUpForm: React.FC<FollowUpFormProps> = ({
  questions,
  onSubmit,
  isLoading,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    questions.forEach((q) => {
      initial[q.id] = q.answerText || '';
    });
    return initial;
  });

  const [error, setError] = useState<string | null>(null);

  const handleTextChange = (id: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [id]: text }));
  };

  const handleOptionSelect = (id: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [id]: option }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate that all questions have non-empty answers
    const payload = questions.map((q) => ({
      questionId: q.id,
      answerText: (answers[q.id] || '').trim(),
    }));

    const missing = payload.some((p) => !p.answerText);
    if (missing) {
      setError('Iltimos, tashxisni aniqlashtirish uchun barcha savollarga javob bering.');
      return;
    }

    try {
      await onSubmit(payload);
    } catch (err: any) {
      setError(err?.message || 'Javoblarni yuborishda xatolik yuz berdi');
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-2xl glass-panel border-2 border-indigo-500/30 shadow-2xl space-y-6">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
          <HelpCircle className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">
            Aniqlashtiruvchi savollar (AI tahlili)
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5 leading-relaxed">
            Faqat suratning o‘zi to‘liq xulosa uchun yetarli emas. Quyidagi savollarga javob berish orqali aniq tashxis va tavsiyalarga ega bo‘ling:
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, idx) => {
          const currentAnswer = answers[q.id] || '';
          const options = (q.options as string[]) || [];

          return (
            <div
              key={q.id}
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3"
            >
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-brand-600/30 text-brand-300 border border-brand-500/40 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-sm font-semibold text-white leading-relaxed">
                  {q.questionText}
                </p>
              </div>

              {/* Multiple Choice Options if available */}
              {options.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 pl-7">
                  {options.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleOptionSelect(q.id, opt)}
                      className={`p-3 rounded-xl text-xs font-medium text-left border transition-all flex items-center justify-between ${
                        currentAnswer === opt
                          ? 'bg-brand-600 text-white border-brand-500 shadow-md'
                          : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600 hover:text-white'
                      }`}
                    >
                      <span>{opt}</span>
                      {currentAnswer === opt && (
                        <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="pl-7 pt-1">
                  <textarea
                    rows={2}
                    value={currentAnswer}
                    onChange={(e) => handleTextChange(q.id, e.target.value)}
                    placeholder="Javobingizni bu yerga yozing..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>
              )}
            </div>
          );
        })}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          {isLoading ? (
            <span>Tahlil yangilanmoqda...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Javoblarni yuborish va yakuniy tashxisni olish</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
