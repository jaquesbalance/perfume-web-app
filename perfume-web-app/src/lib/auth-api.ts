/**
 * Authentication API client
 * Handles all auth-related backend communication
 */

import type { User, AuthTokens, LoginCredentials, RegisterCredentials } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Store auth tokens in localStorage
 */
export function storeTokens(tokens: AuthTokens): void {
  localStorage.setItem(TOKEN_KEY, tokens.accessToken);
  if (tokens.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }
}

/**
 * Retrieve stored access token
 */
export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Retrieve stored refresh token
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Clear all stored tokens
 */
export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/**
 * Create authorization header with current token
 */
export function getAuthHeaders(): HeadersInit {
  const token = getAccessToken();
  return token
    ? {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    : {
        'Content-Type': 'application/json',
      };
}

export const authApi = {
  /**
   * Register a new user
   */
  async register(credentials: RegisterCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Registration failed' }));
      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      user: data.user,
      tokens: {
        accessToken: data.accessToken || data.token,
        refreshToken: data.refreshToken,
      },
    };
  },

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      user: data.user,
      tokens: {
        accessToken: data.accessToken || data.token,
        refreshToken: data.refreshToken,
      },
    };
  },

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    const token = getAccessToken();
    if (!token) return;

    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch (error) {
      console.warn('Logout request failed:', error);
      // Continue with local logout even if API call fails
    }

    clearTokens();
  },

  /**
   * Get current user from token
   */
  async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.user;
  },

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<AuthTokens> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    return {
      accessToken: data.accessToken || data.token,
      refreshToken: data.refreshToken,
    };
  },
};
