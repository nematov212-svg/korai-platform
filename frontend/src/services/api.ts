import {
  User,
  DiagnosisSession,
  BillingUsage,
  Feedback,
} from '../types/index.js';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '') + '/api/v1';

export class ApiError extends Error {
  statusCode: number;
  details?: any;

  constructor(statusCode: number, message: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

class ApiClient {
  private getAccessToken(): string | null {
    return localStorage.getItem('korai_access_token');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('korai_refresh_token');
  }

  private setTokens(accessToken: string, refreshToken?: string) {
    localStorage.setItem('korai_access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('korai_refresh_token', refreshToken);
    }
  }

  public clearTokens() {
    localStorage.removeItem('korai_access_token');
    localStorage.removeItem('korai_refresh_token');
  }

  private async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) {
        this.clearTokens();
        return null;
      }

      const json = await res.json();
      if (json.data?.accessToken) {
        this.setTokens(json.data.accessToken, json.data.refreshToken);
        return json.data.accessToken;
      }
      return null;
    } catch {
      this.clearTokens();
      return null;
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    let token = this.getAccessToken();

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Do not set Content-Type for FormData (browser automatically sets multipart boundary)
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    let res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    // If 401 Unauthorized, try refreshing token once
    if (res.status === 401 && token) {
      const newToken = await this.refreshAccessToken();
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
        res = await fetch(`${API_BASE}${endpoint}`, {
          ...options,
          headers,
        });
      }
    }

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const message = json?.error?.message || `So‘rov xatosi (${res.status})`;
      throw new ApiError(res.status, message, json?.error?.details);
    }

    return json;
  }

  // --- Auth Endpoints ---
  async register(data: { name: string; email: string; password: string }) {
    const res = await this.request<{
      data: { user: User; accessToken: string; refreshToken: string };
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setTokens(res.data.accessToken, res.data.refreshToken);
    return res.data;
  }

  async login(data: { email: string; password: string }) {
    const res = await this.request<{
      data: { user: User; accessToken: string; refreshToken: string };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setTokens(res.data.accessToken, res.data.refreshToken);
    return res.data;
  }

  async logout() {
    const refreshToken = this.getRefreshToken();
    try {
      await this.request('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    } finally {
      this.clearTokens();
    }
  }

  async getMe() {
    const res = await this.request<{ data: { user: User } }>('/auth/me');
    return res.data.user;
  }

  // --- Diagnosis Endpoints ---
  async createDiagnosis(data: {
    title: string;
    category: string;
    description?: string;
    deviceModel?: string;
    symptoms?: string[];
  }) {
    const res = await this.request<{ data: { session: DiagnosisSession } }>('/diagnoses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data.session;
  }

  async uploadDiagnosisImages(sessionId: string, files: File[]) {
    const formData = new FormData();
    for (const file of files) {
      formData.append('images', file);
    }

    const res = await this.request<{ data: { images: any[] } }>(`/diagnoses/${sessionId}/images`, {
      method: 'POST',
      body: formData,
    });
    return res.data.images;
  }

  async analyzeDiagnosis(sessionId: string) {
    const res = await this.request<{ data: { session: DiagnosisSession } }>(
      `/diagnoses/${sessionId}/analyze`,
      { method: 'POST' }
    );
    return res.data.session;
  }

  async answerQuestions(sessionId: string, answers: Array<{ questionId: string; answerText: string }>) {
    const res = await this.request<{ data: { session: DiagnosisSession } }>(
      `/diagnoses/${sessionId}/answers`,
      {
        method: 'POST',
        body: JSON.stringify({ answers }),
      }
    );
    return res.data.session;
  }

  async getDiagnoses(params: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    search?: string;
    favoriteOnly?: boolean;
  } = {}) {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.category) query.set('category', params.category);
    if (params.status) query.set('status', params.status);
    if (params.search) query.set('search', params.search);
    if (params.favoriteOnly) query.set('favoriteOnly', 'true');

    const res = await this.request<{
      data: {
        items: DiagnosisSession[];
        pagination: { page: number; limit: number; total: number; totalPages: number };
      };
    }>(`/diagnoses?${query.toString()}`);
    return res.data;
  }

  async getDiagnosis(id: string) {
    const res = await this.request<{ data: { session: DiagnosisSession } }>(`/diagnoses/${id}`);
    return res.data.session;
  }

  async deleteDiagnosis(id: string) {
    return this.request<{ success: boolean }>(`/diagnoses/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleFavorite(id: string) {
    const res = await this.request<{ data: { id: string; isFavorite: boolean } }>(
      `/diagnoses/${id}/favorite`,
      { method: 'POST' }
    );
    return res.data;
  }

  async submitFeedback(
    sessionId: string,
    data: {
      isUseful: boolean;
      problemResolved?: boolean;
      actualOutcome?: string;
      userComment?: string;
    }
  ) {
    const res = await this.request<{ data: { feedback: Feedback } }>(
      `/diagnoses/${sessionId}/feedback`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return res.data.feedback;
  }

  // --- Billing Endpoints ---
  async getBillingUsage() {
    const res = await this.request<{ data: BillingUsage }>('/billing/usage');
    return res.data;
  }

  // --- Health Endpoint ---
  async getHealth() {
    return this.request<any>('/health');
  }
}

export const api = new ApiClient();
