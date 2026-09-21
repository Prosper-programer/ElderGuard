/**
 * ============================================================================
 * ElderGuard — AuthContext.tsx
 * ============================================================================
 * 
 * PURPOSE:
 * Manages user authentication, session state, and role-based permissions:
 * 
 * THE 2 USER ROLES:
 * 1. `parent`    : Family member / Senior Care Manager (Theme: Blue #3C6FDB)
 *                   - Full permissions: Vitals, prescriptions, doctor reports, configuration.
 * 2. `caregiver` : Professional nurse, aide, or assisted living staff (Theme: Green #22C55E)
 *                   - Care administration: Vitals, daypart dose logging, incident responses.
 * 
 * PRODUCTION API POINT:
 * In production, replace the simulated credential check with your JWT endpoint:
 *   const res = await fetch('https://api.elderguard.com/v1/auth/login', { ... });
 *   await SecureStore.setItemAsync('user_token', res.data.token);
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { User, UserRole, AuthContextValue } from '@/types/auth';
import { MOCK_USERS } from '@/services/mockData';
import { apiLogin, apiSignup, apiLogout } from '@/services/authService';

import { connectSocket, disconnectSocket, onAccountStatusChange } from '@/services/socketService';

// React Context for authentication session state
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * AuthProvider Component
 * Exposes current user object, role, login/signup handlers, and session persistence.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Simulates reading cached JWT token on initial app boot
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Listen for real-time WebSocket account status changes (e.g. Admin deactivates/activates account)
  useEffect(() => {
    if (!user) {
      disconnectSocket();
      return;
    }

    // Connect to WebSocket and join user's notification channel
    const socket = connectSocket(user.id);

    if (socket) {
      socket.on('notification', (data: any) => {
        Alert.alert(data.title || 'Notification', data.message || '');
      });

      socket.on('new_prescription', (data: any) => {
        Alert.alert(
          'New Prescription Added',
          `Dr. ${data.doctorName} prescribed a new medication for ${data.seniorName}.`
        );
      });

      socket.on('medication_administered', (data: any) => {
        Alert.alert(
          'Medication Administered',
          `${data.administeredBy} has recorded a medication dose administration.`
        );
      });
    }

    const unsubscribe = onAccountStatusChange((event) => {
      const isTargetUser =
        String(event.userId) === String(user.id) ||
        (event.email && user.email && event.email.toLowerCase() === user.email.toLowerCase());

      if (isTargetUser) {
        console.log(`⚡ Real-time account status updated for ${user.email || user.id}: ${event.status}`);
        
        setUser((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            status: event.status,
          };
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  /**
   * Logs in a user using email and password via the Express + MySQL backend.
   */
  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; user?: User }> => {
    setIsLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    // Call real Node.js + Express backend API
    const result = await apiLogin(email, password);

    if (result.success && result.user) {
      setUser(result.user);
      setIsLoading(false);
      return { success: true, user: result.user };
    }

    // Offline / demo fallback if backend is unreachable or demo accounts are used
    if (normalizedEmail === 'parent@elderguard.com' || normalizedEmail === 'robert.thompson@email.com') {
      setUser(MOCK_USERS.parent);
      setIsLoading(false);
      return { success: true, user: MOCK_USERS.parent };
    }
    if (normalizedEmail === 'caregiver@elderguard.com' || normalizedEmail === 'sarah.mitchell@elderguard.com') {
      setUser(MOCK_USERS.caregiver);
      setIsLoading(false);
      return { success: true, user: MOCK_USERS.caregiver };
    }
    if (normalizedEmail === 'doctor@elderguard.com') {
      setUser(MOCK_USERS.doctor);
      setIsLoading(false);
      return { success: true, user: MOCK_USERS.doctor };
    }

    setIsLoading(false);
    return {
      success: false,
      error: result.error || 'Invalid credentials.',
    };
  };

  /**
   * Registers a new user account with role assignment on the Express + MySQL backend.
   */
  const signup = async (
    name: string,
    email: string,
    password: string,
    role: 'parent' | 'caregiver',
    phone?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    // Call real Node.js + Express backend API
    const result = await apiSignup(name, email, password, role, phone);

    if (result.success && result.user) {
      setUser(result.user);
      setIsLoading(false);
      return { success: true };
    }

    setIsLoading(false);
    return {
      success: false,
      error: result.error || 'Failed to register.',
    };
  };

  /**
   * Quick 1-tap role switcher for rapid developer testing.
   */
  const quickLogin = async (role: UserRole): Promise<void> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setUser(MOCK_USERS[role] || MOCK_USERS.parent);
    setIsLoading(false);
  };

  /**
   * Clears active session and signs out the user on the backend.
   */
  const logout = async (): Promise<void> => {
    disconnectSocket();
    try {
      await apiLogout();
    } catch (e) {
      // ignore
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAccountActive: user?.status !== 'inactive',
        accountStatus: user?.status || 'active',
        login,
        signup,
        quickLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth Custom Hook
 * Provides direct access to current user identity, active role, and auth methods.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
