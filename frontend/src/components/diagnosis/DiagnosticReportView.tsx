import React, { useState } from 'react';
import {
  DiagnosisSession,
  AnalysisResult,
  PossibleCause,
} from '../../types/index.js';
import { api } from '../../services/api.js';
import {
  AlertTriangle,
  ShieldCheck,
  Wrench,
  Package,
  UserCheck,
  CheckCircle2,
  Printer,
  Bookmark,
  Share2,
  HelpCircle,
  Clock,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
} from 'lucide-react';

interface DiagnosticReportViewProps {
  session: DiagnosisSession;
  onRefresh?: () => void;
}

export const DiagnosticReportView: React.FC<DiagnosticReportViewProps> = ({
  session,
  onRefresh,
}) => {
  const analysis = session.analysis;
  const [isFavorite, setIsFavorite] = useState(session.isFavorite);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(Boolean(session.feedback));
  const [feedbackUseful, setFeedbackUseful] = useState<boolean | null>(
    session.feedback ? session.feedback.isUseful : null
  );
  const [problemResolved, setProblemResolved] = useState<boolean>(
    session.feedback ? session.feedback.problemResolved : false
  );
  const [feedbackComment, setFeedbackComment] = useState(
    session.feedback?.userComment || ''
  );
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [expandedCauseIdx, setExpandedCauseIdx] = useState<number | null>(0);

  if (!analysis) {
    return (
      <div className="p-8 text-center rounded-2xl border border-slate-800 glass-panel">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-white">Tashxis hisoboti mavjud emas</h3>
        <p className="text-sm text-slate-400">Bu seans hali to‘liq tahlil qilinmagan.</p>
      </div>
    );
  }

  const handleToggleFavorite = async () => {
    try {
      const res = await api.toggleFavorite(session.id);
      setIsFavorite(res.isFavorite);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Favorite toggle error:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackUseful === null) return;

    setIsSubmittingFeedback(true);
    try {
      await api.submitFeedback(session.id, {
        isUseful: feedbackUseful,
        problemResolved,
        userComment: feedbackComment,
      });
      setFeedbackSubmitted(true);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Feedback submit error:', err);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const urgencyColors = {
    LOW: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    MEDIUM: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    HIGH: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    CRITICAL: 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse',
  };

  const likelihoodBadges = {
    HIGH: { label: 'Yuqori ehtimollik', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
    MEDIUM: { label: 'O‘rta ehtimollik', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    LOW: { label: 'Past ehtimollik', color: 'bg-slate-700/60 text-slate-300 border-slate-600' },
  };

  const causes = (analysis.possibleCauses as PossibleCause[]) || [];
  const warnings = (analysis.safetyWarnings as string[]) || [];
  const steps = (analysis.safeNextSteps as string[]) || [];
  const evidence = (analysis.visibleEvidence as string[]) || [];
  const tools = (analysis.toolsNeeded as string[]) || [];
  const parts = (analysis.partsNeeded as string[]) || [];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-700/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-brand-500/20 text-brand-300 border border-brand-500/30">
              {analysis.detectedCategory}
            </span>
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                urgencyColors[analysis.urgencyLevel] || urgencyColors.MEDIUM
              }`}
            >
              Xavf darajasi: {analysis.urgencyLevel}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {new Date(analysis.createdAt).toLocaleString('uz-UZ')}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {analysis.detectedObject || session.title}
          </h1>
          {session.deviceModel && (
            <p className="text-sm text-slate-400 mt-1 font-mono">
              Model: {session.deviceModel}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5 self-start md:self-center">
          <button
            onClick={handleToggleFavorite}
            className={`p-2.5 rounded-xl border transition-all ${
              isFavorite
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title={isFavorite ? 'Saralanganlardan o‘chirish' : 'Saralash'}
          >
            <Bookmark className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-semibold text-slate-200 transition-all"
            title="Chop etish yoki PDF sifatida saqlash"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Chop etish</span>
          </button>
        </div>
      </div>

      {/* Critical Safety Warnings Banner */}
      {warnings.length > 0 && (
        <div className="p-5 rounded-2xl bg-rose-500/10 border-2 border-rose-500/40 shadow-lg shadow-rose-950/30">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-300 mb-1">
                Muhim xavfsizlik ogohlantirishlari!
              </h3>
              <ul className="space-y-1.5 text-sm text-rose-200/90 list-disc list-inside">
                {warnings.map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Confidence & Limitation Assessment Note */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
        <HelpCircle className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-white">Vizual tahlil ishonchliligi va chegaralari:</p>
          <p className="leading-relaxed text-slate-400">{analysis.confidenceAssessment}</p>
        </div>
      </div>

      {/* Main 2-column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Evidence & Causes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Visible Evidence Section */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3>Suratda aniqlangan vizual dalillar</h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {evidence.map((ev, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-sm text-slate-200"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-2 shrink-0" />
                  <span>{ev}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ranked Possible Causes Accordion */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <Layers className="w-5 h-5 text-brand-400" />
                <h3>Ehtimoliy sabablar tahlili</h3>
              </div>
              <span className="text-xs text-slate-400">
                {causes.length} ta ehtimoliy omil
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {causes.map((cause, idx) => {
                const isExpanded = expandedCauseIdx === idx;
                const badge = likelihoodBadges[cause.likelihood] || likelihoodBadges.MEDIUM;

                return (
                  <div
                    key={idx}
                    className={`rounded-xl border transition-all overflow-hidden ${
                      isExpanded
                        ? 'bg-slate-800/70 border-brand-500/40 shadow-lg'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedCauseIdx(isExpanded ? null : idx)}
                      className="w-full p-4 flex items-center justify-between text-left gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-xs text-brand-400 font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-white text-sm sm:text-base truncate">
                          {cause.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.color}`}>
                          {badge.label}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 border-t border-slate-700/60 space-y-3 text-sm text-slate-300">
                        <div>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            Texnik izoh:
                          </p>
                          <p className="leading-relaxed">{cause.explanation}</p>
                        </div>
                        {cause.supportingEvidence && (
                          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                            <span className="font-semibold text-brand-300">Tayangan vizual belgisi: </span>
                            <span className="text-slate-300">{cause.supportingEvidence}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Safe Step-by-Step Diagnostic Instructions */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3>Xavfsiz tekshirish va dastlabki choralar</h3>
            </div>
            <ol className="space-y-3 pt-2">
              {steps.map((step, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800"
                >
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-200 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Right Col: Images, Tools, Professional Help & Feedback */}
        <div className="space-y-6">
          {/* Photos Grid */}
          <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Tekshirilgan fotosuratlar</span>
              <span className="text-xs text-slate-400 font-normal">
                {session.images.length} ta rasm
              </span>
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {session.images.map((img) => (
                <a
                  key={img.id}
                  href={img.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative rounded-xl overflow-hidden aspect-square border border-slate-700 bg-black block"
                >
                  <img
                    src={img.url}
                    alt={img.originalName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ExternalLink className="w-4 h-4 text-white" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Tools & Parts Needed */}
          <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <div>
              <div className="flex items-center gap-2 text-white font-semibold text-sm mb-2.5">
                <Wrench className="w-4 h-4 text-amber-400" />
                <h4>Tavsiya etilgan asboblar:</h4>
              </div>
              {tools.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {tools.map((tool, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-xs"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">Maxsus asboblar talab etilmaydi.</p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2 text-white font-semibold text-sm mb-2.5">
                <Package className="w-4 h-4 text-indigo-400" />
                <h4>Ehtimoliy ehtiyot qismlar:</h4>
              </div>
              {parts.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {parts.map((part, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs"
                    >
                      {part}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">Dastlabki bosqichda ehtiyot qism zarurati aniqlanmadi.</p>
              )}
            </div>
          </div>

          {/* Professional Help Recommendation Card */}
          <div
            className={`p-5 rounded-2xl border ${
              analysis.professionalRecommended
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <UserCheck className="w-5 h-5 shrink-0" />
              <h4 className="font-bold text-sm">
                {analysis.professionalRecommended
                  ? 'Professional usta xizmati tavsiya etiladi'
                  : 'Foydalanuvchi tomonidan mustaqil ko‘rikdan o‘tkazilishi mumkin'}
              </h4>
            </div>
            <p className="text-xs opacity-90 leading-relaxed">
              {analysis.professionalRecommended
                ? 'Muammo ichki agregatlar, yuqori bosim yoki maxsus kalibrlash bilan bog‘liq bo‘lishi mumkin. Xavfsizlik yuzasidan malakali mutaxassisni jalb qiling.'
                : 'Belgilar oddiy profilaktika, tozalash yoki mahkamlagichlar bilan bartaraf etilishi mumkin. Yuqoridagi xavfsiz qadamlarga qat’iy amal qiling.'}
            </p>
          </div>

          {/* User Feedback Card */}
          <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-400" />
              <span>Natija bo‘yicha fikringiz</span>
            </h4>

            {feedbackSubmitted ? (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                Fikr-mulohazangiz qabul qilindi. Tashxis sifatini oshirishga qo‘shgan hissangiz uchun rahmat!
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-3.5">
                <div>
                  <p className="text-xs text-slate-300 mb-2">Tashxis xulosasi foydali bo‘ldimi?</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFeedbackUseful(true)}
                      className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        feedbackUseful === true
                          ? 'bg-brand-600 text-white border-brand-500'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Ha, foydali</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeedbackUseful(false)}
                      className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        feedbackUseful === false
                          ? 'bg-rose-600 text-white border-rose-500'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>Yo‘q</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="resolvedCheck"
                    checked={problemResolved}
                    onChange={(e) => setProblemResolved(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-brand-600 focus:ring-brand-500"
                  />
                  <label htmlFor="resolvedCheck" className="text-xs text-slate-300 cursor-pointer">
                    Muammo to‘liq hal bo‘ldi
                  </label>
                </div>

                <div>
                  <textarea
                    rows={2}
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="Qo‘shimcha izoh yoki haqiqiy natija haqida..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={feedbackUseful === null || isSubmittingFeedback}
                  className="w-full py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-semibold transition-all"
                >
                  {isSubmittingFeedback ? 'Yuborilmoqda...' : 'Fikrni saqlash'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
