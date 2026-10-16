import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { Eye } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-slate-400 gap-4">
        <div className="w-12 h-12 rounded-xl bg-brand-600/30 border border-brand-500 flex items-center justify-center animate-pulse">
          <Eye className="w-6 h-6 text-brand-400" />
        </div>
        <p className="text-sm font-medium">Ko'rAI yuklanmoqda...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
