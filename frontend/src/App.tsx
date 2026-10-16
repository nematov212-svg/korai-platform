import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext.js';
import { LanguageProvider } from './context/LanguageContext.js';
import { ProtectedRoute } from './components/layout/ProtectedRoute.js';
import { AppLayout } from './components/layout/AppLayout.js';

import { LandingPage } from './pages/LandingPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { NewDiagnosisPage } from './pages/NewDiagnosisPage.js';
import { HistoryPage } from './pages/HistoryPage.js';
import { ReportDetailPage } from './pages/ReportDetailPage.js';
import { FavoritesPage } from './pages/FavoritesPage.js';
import { BillingPage } from './pages/BillingPage.js';
import { SettingsPage } from './pages/SettingsPage.js';
import { NotFoundPage } from './pages/NotFoundPage.js';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Authenticated Workspace */}
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="diagnose" element={<NewDiagnosisPage />} />
                <Route path="history" element={<HistoryPage />} />
                <Route path="history/:id" element={<ReportDetailPage />} />
                <Route path="favorites" element={<FavoritesPage />} />
                <Route path="billing" element={<BillingPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Fallback 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
