import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { DiagnosisSession } from '../types/index.js';
import { Bookmark, Camera, ChevronRight, Clock } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const [sessions, setSessions] = useState<DiagnosisSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      const res = await api.getDiagnoses({ favoriteOnly: true, limit: 50 });
      setSessions(res.items);
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.toggleFavorite(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Favorite error:', err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Saralangan hisobotlar
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Tezkor kirish uchun saqlab qo‘yilgan muhim tashxis natijalari ({sessions.length} ta)
        </p>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-400">Yuklanmoqda...</div>
      ) : sessions.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-panel border border-slate-800 space-y-3 max-w-md mx-auto">
          <Bookmark className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">Hozircha saralangan hisobotlar yo‘q</h3>
          <p className="text-xs text-slate-400">
            Tashxis hisoboti burchagidagi xatcho‘p belgisini bosish orqali uni bu yerga saqlashingiz mumkin.
          </p>
          <Link
            to="/app/history"
            className="inline-block mt-2 px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200"
          >
            Tashxislar tarixiga o‘tish
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map((diag) => (
            <Link
              key={diag.id}
              to={`/app/history/${diag.id}`}
              className="group p-5 rounded-2xl glass-panel glass-card-hover border border-slate-800 flex items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-center gap-4 min-w-0">
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
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 uppercase border border-slate-700 mb-1">
                    {diag.category}
                  </span>
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
                    {new Date(diag.createdAt).toLocaleDateString('uz-UZ')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => handleToggleFavorite(diag.id, e)}
                  className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 transition-all"
                  title="Saralanganlardan chiqarish"
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
