import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { DiagnosisSession } from '../types/index.js';
import {
  History,
  Search,
  Filter,
  Trash2,
  Bookmark,
  Camera,
  ChevronRight,
  Clock,
  AlertCircle,
} from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [sessions, setSessions] = useState<DiagnosisSession[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const res = await api.getDiagnoses({
        page,
        limit: 8,
        search: search.trim() || undefined,
        category: category || undefined,
      });
      setSessions(res.items);
      setTotal(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [page, category]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchSessions();
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Haqiqatan ham ushbu tashxis va uning barcha rasmlarini o‘chirmoqchimisiz?')) {
      return;
    }

    try {
      await api.deleteDiagnosis(id);
      fetchSessions();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleToggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.toggleFavorite(id);
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isFavorite: !s.isFavorite } : s))
      );
    } catch (err) {
      console.error('Favorite error:', err);
    }
  };

  const categories = [
    { id: '', label: 'Barchasi' },
    { id: 'appliances', label: 'Maishiy texnika' },
    { id: 'automotive', label: 'Avtomobil' },
    { id: 'computers', label: 'Kompyuter' },
    { id: 'plumbing', label: 'Santexnika' },
    { id: 'electronics', label: 'Elektronika' },
    { id: 'general', label: 'Umumiy' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Tashxislar tarixi
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Barcha o‘tkazilgan vizual tahlillar, sabablar va xulosalar arxivi ({total} ta)
        </p>
      </div>

      {/* Filters & Search Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Sarlavha, model yoki tavsif bo‘yicha qidirish..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-brand-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs sm:text-sm transition-all"
          >
            Qidirish
          </button>
        </form>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setCategory(c.id);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                category === c.id
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400">Yuklanmoqda...</div>
      ) : sessions.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-panel border border-slate-800 space-y-3">
          <History className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">Mos keluvchi tashxis topilmadi</h3>
          <p className="text-xs text-slate-400">
            Qidiruv so‘zini o‘zgartiring yoki yangi tashxis yarating.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((diag) => (
            <Link
              key={diag.id}
              to={`/app/history/${diag.id}`}
              className="group p-4 sm:p-5 rounded-2xl glass-panel glass-card-hover border border-slate-800 flex items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* Image */}
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

                <div className="min-w-0">
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
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {diag.status === 'COMPLETED' ? 'Tugallangan' : diag.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white truncate group-hover:text-brand-400 transition-colors">
                    {diag.title}
                  </h3>

                  {diag.analysis?.detectedObject && (
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      Aniqlangan: {diag.analysis.detectedObject}
                    </p>
                  )}

                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {new Date(diag.createdAt).toLocaleString('uz-UZ')}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => handleToggleFavorite(diag.id, e)}
                  className={`p-2 rounded-xl border transition-all ${
                    diag.isFavorite
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                      : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                  }`}
                  title="Saralash"
                >
                  <Bookmark className={`w-4 h-4 ${diag.isFavorite ? 'fill-current' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={(e) => handleDelete(diag.id, e)}
                  className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="O‘chirish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 disabled:opacity-40"
          >
            Oldingi
          </button>
          <span className="text-xs text-slate-400 font-mono px-2">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 disabled:opacity-40"
          >
            Keyingi
          </button>
        </div>
      )}
    </div>
  );
};
