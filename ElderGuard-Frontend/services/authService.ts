import { API_BASE_URL } from '../constants/api';
import { User, UserRole } from '../types/auth';

let currentToken: string | null = null;

export const getAuthToken = () => currentToken;
export const setAuthToken = (token: string | null) => {
  currentToken = token;
};

/**
 * Communicates with the ElderGuard Node.js + Express backend
 * to authenticate a user.
 */
export async function apiLogin(
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Login failed. Please check your credentials.',
      };
    }

    // Save token
    setAuthToken(data.token);

    // Map backend user to frontend User format
    const mappedUser: User = {
      id: String(data.user.user_id),
      name: data.user.full_name,
      email: data.user.email,
      role: data.user.role as UserRole,
      phone: data.user.phone_number,
      assignedElderlyCount: 0,
      createdAt: new Date().toISOString(),
      status: (data.user.status as 'active' | 'inactive') || 'active',
    };

    return {
      success: true,
      user: mappedUser,
      token: data.token,
    };
  } catch (error: any) {
    console.error('API Login Network Error:', error);
    return {
      success: false,
      error: `Cannot connect to backend server at ${API_BASE_URL}. Ensure the backend is running.`,
    };
  }
}

/**
 * Registers a new user on the Express + MySQL backend.
 */
export async function apiSignup(
  name: string,
  email: string,
  password: string,
  role: 'parent' | 'caregiver',
  phoneNumber: string = '690000000'
): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: name.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: phoneNumber.trim(),
        password,
        role,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Registration failed.',
      };
    }

    setAuthToken(data.token);

    const mappedUser: User = {
      id: String(data.user.user_id),
      name: data.user.full_name,
      email: data.user.email,
      role: data.user.role as UserRole,
      phone: data.user.phone_number,
      assignedElderlyCount: 0,
      createdAt: new Date().toISOString(),
      status: (data.user.status as 'active' | 'inactive') || 'active',
    };

    return {
      success: true,
      user: mappedUser,
      token: data.token,
    };
  } catch (error: any) {
    console.error('API Signup Network Error:', error);
    return {
      success: false,
      error: `Cannot connect to backend server at ${API_BASE_URL}. Ensure the backend is running.`,
    };
  }
}

/**
 * Logs out user on backend
 */
export async function apiLogout(): Promise<void> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeout);
  } catch (e) {
    // ignore network error or timeout on logout
  } finally {
    setAuthToken(null);
  }
}
