import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { DiagnosisSession } from '../types/index.js';
import { DiagnosticReportView } from '../components/diagnosis/DiagnosticReportView.js';
import { FollowUpForm } from '../components/diagnosis/FollowUpForm.js';
import { AnalyzingLoader } from '../components/diagnosis/AnalyzingLoader.js';
import { ArrowLeft, Trash2, AlertCircle } from 'lucide-react';

export const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<DiagnosisSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await api.getDiagnosis(id);
      setSession(data);
    } catch (err: any) {
      setError(err?.message || 'Tashxis hisoboti yuklanmadi');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [id]);

  const handleAnswerQuestions = async (
    answers: Array<{ questionId: string; answerText: string }>
  ) => {
    if (!id) return;
    setIsUpdating(true);
    try {
      const updated = await api.answerQuestions(id, answers);
      setSession(updated);
    } catch (err: any) {
      setError(err?.message || 'Javoblarni yuborishda xatolik yuz berdi');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Ushbu tashxis hisobotini butunlay o‘chirib yubormoqchimisiz?')) {
      return;
    }

    try {
      await api.deleteDiagnosis(id);
      navigate('/app/history', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'O‘chirishda xatolik yuz berdi');
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-slate-400">Tashxis hisoboti yuklanmoqda...</div>;
  }

  if (error || !session) {
    return (
      <div className="p-8 rounded-3xl glass-panel border border-slate-800 text-center max-w-lg mx-auto space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-white">Xatolik</h3>
        <p className="text-sm text-slate-400">{error || 'Tashxis topilmadi'}</p>
        <Link
          to="/app/history"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tarixga qaytish</span>
        </Link>
      </div>
    );
  }

  if (isUpdating) {
    return <AnalyzingLoader />;
  }

  const unansweredQuestions = session.questions?.filter((q) => !q.answerText) || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in pb-12">
      {/* Top back navigation & actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/app/history"
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Barcha tashxislar ro‘yxati</span>
        </Link>

        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-500/10 border border-slate-700 text-slate-400 hover:text-rose-400 text-xs font-semibold transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Hisobotni o‘chirish</span>
        </button>
      </div>

      {/* If follow-up questions are pending, display the form */}
      {session.status === 'FOLLOW_UP_REQUIRED' && unansweredQuestions.length > 0 && (
        <FollowUpForm
          questions={unansweredQuestions}
          onSubmit={handleAnswerQuestions}
          isLoading={isUpdating}
        />
      )}

      {/* Render the full report */}
      {session.analysis ? (
        <DiagnosticReportView session={session} onRefresh={fetchSession} />
      ) : (
        <div className="p-8 rounded-2xl glass-panel border border-slate-800 text-center">
          <p className="text-sm text-slate-400">Ushbu seans hali to‘liq tahlil qilinmagan.</p>
        </div>
      )}
    </div>
  );
};
