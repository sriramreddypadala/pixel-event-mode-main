import { API_CONFIG, API_ENDPOINTS } from '@/config/api.config';
import type { ApiResponse } from '@/types/api';

class ApiService {
  private baseUrl: string;
  private token: string | null = null;
  private offlineQueue: Array<{ endpoint: string; data: unknown; timestamp: number }> = [];

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.loadToken();
    this.loadOfflineQueue();
  }

  private loadToken() {
    this.token = localStorage.getItem('auth_token');
  }

  private saveToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  private clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private loadOfflineQueue() {
    const queue = localStorage.getItem('offline_queue');
    if (queue) {
      try {
        this.offlineQueue = JSON.parse(queue);
      } catch (e) {
        this.offlineQueue = [];
      }
    }
  }

  private saveOfflineQueue() {
    localStorage.setItem('offline_queue', JSON.stringify(this.offlineQueue));
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    if (API_CONFIG.ENABLE_MOCK) {
      return this.mockRequest<T>(endpoint, options);
    }

    const url = `${this.baseUrl}${endpoint}`;
    const isFormData = options.body instanceof FormData;
    const headers: Record<string, string> = {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUT),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (this.shouldQueueOffline(endpoint)) {
        this.queueOfflineRequest(endpoint, options.body);
      }

      throw error;
    }
  }

  private shouldQueueOffline(endpoint: string): boolean {
    const offlineEndpoints = [
      API_ENDPOINTS.MACHINE.SYNC_PRINT_COUNT,
      API_ENDPOINTS.MACHINE.UPDATE_STATUS,
    ];
    return offlineEndpoints.some(e => endpoint.includes(e));
  }

  private queueOfflineRequest(endpoint: string, data: unknown) {
    this.offlineQueue.push({
      endpoint,
      data,
      timestamp: Date.now(),
    });
    this.saveOfflineQueue();
  }

  async processOfflineQueue() {
    if (this.offlineQueue.length === 0) return;

    const queue = [...this.offlineQueue];
    this.offlineQueue = [];
    this.saveOfflineQueue();

    for (const item of queue) {
      try {
        await this.request(item.endpoint, {
          method: 'POST',
          body: JSON.stringify(item.data),
        });
      } catch (error) {
        this.offlineQueue.push(item);
      }
    }

    this.saveOfflineQueue();
  }

  private async mockRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock login response
    if (endpoint.includes('/auth/login')) {
      const body = options.body ? JSON.parse(options.body as string) : {};

      console.log('Mock login attempt:', { email: body.email, password: body.password });

      // Demo credentials - trim whitespace and compare
      const email = (body.email || '').trim().toLowerCase();
      const password = (body.password || '').trim();

      if (email === 'admin@pixxel8.com' && password === 'admin123') {
        console.log('✅ Login successful');
        return {
          success: true,
          data: {
            token: 'mock-jwt-token-' + Date.now(),
            user: {
              id: 'admin-1',
              email: 'admin@pixxel8.com',
              name: 'Admin User',
              role: 'admin',
            },
          } as T,
          message: 'Login successful',
        };
      }

      console.log('❌ Invalid credentials');
      return {
        success: false,
        data: null as T,
        message: 'Invalid credentials. Use admin@pixxel8.com / admin123',
      };
    }

    return {
      success: true,
      data: {} as T,
      message: 'Mock API response',
    };
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: unknown, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const isFormData = data instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'POST',
      body: isFormData ? (data as BodyInit) : JSON.stringify(data),
      ...options,
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  setAuthToken(token: string) {
    this.saveToken(token);
  }

  clearAuthToken() {
    this.clearToken();
  }

  getAuthToken(): string | null {
    return this.token;
  }
}

export const apiService = new ApiService();
