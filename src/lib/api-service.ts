/**
 * Enhanced API service for HTTP requests with retry, timeout, and logging
 */

import { apiConfig, getApiHeaders } from '@/config/api';

export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  status?: number;
}

export interface ApiError extends Error {
  status?: number;
  code?: string;
}

class ApiService {
  private baseUrl: string;
  private timeout: number;
  private retryAttempts: number;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || apiConfig.baseUrl;
    this.timeout = apiConfig.timeout;
    this.retryAttempts = apiConfig.retryAttempts;
  }

  /**
   * Enhanced GET request with retry and timeout
   */
  async get<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, options);
  }

  /**
   * Enhanced POST request with retry and timeout
   */
  async post<T>(endpoint: string, payload?: unknown, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const requestOptions: RequestInit = {
      ...options,
      method: 'POST',
      body: payload ? JSON.stringify(payload) : undefined,
    };
    return this.request<T>('POST', endpoint, requestOptions);
  }

  /**
   * Enhanced PUT request with retry and timeout
   */
  async put<T>(endpoint: string, payload: unknown, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const requestOptions: RequestInit = {
      ...options,
      method: 'PUT',
      body: JSON.stringify(payload),
    };
    return this.request<T>('PUT', endpoint, requestOptions);
  }

  /**
   * Enhanced DELETE request with retry and timeout
   */
  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Core request method with retry logic, timeout, and logging
   */
  private async request<T>(
    method: string, 
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Merge headers
    const headers = getApiHeaders(options.headers as Record<string, string>);
    
    const requestOptions: RequestInit = {
      ...options,
      method,
      headers,
      signal: AbortSignal.timeout(this.timeout),
    };

    let lastError: Error | null = null;

    // Retry logic
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        this.logRequest(method, url, attempt);
        
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        
        this.logResponse(method, url, response.status, attempt);

        if (response.ok) {
          return {
            data,
            success: true,
            status: response.status,
          };
        } else {
          return {
            data: null as T,
            success: false,
            message: `HTTP ${response.status}: ${response.statusText}`,
            status: response.status,
          };
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        this.logError(method, url, lastError, attempt);
        
        // Don't retry on the last attempt
        if (attempt === this.retryAttempts) {
          break;
        }
        
        // Wait before retry (exponential backoff)
        await this.delay(Math.pow(2, attempt - 1) * 1000);
      }
    }

    // All retries failed
    return {
      data: null as T,
      success: false,
      message: lastError?.message || 'Request failed after all retries',
    };
  }

  /**
   * Delay utility for retry backoff
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Log request (only in development)
   */
  private logRequest(method: string, url: string, attempt: number): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API ${attempt}] ${method} ${url}`);
    }
  }

  /**
   * Log successful response (only in development)
   */
  private logResponse(method: string, url: string, status: number, attempt: number): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API ${attempt}] ${method} ${url} → ${status}`);
    }
  }

  /**
   * Log error (always log errors)
   */
  private logError(method: string, url: string, error: Error, attempt: number): void {
    console.error(`[API ${attempt}] ${method} ${url} → Error:`, error.message);
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export class for custom instances
export { ApiService };