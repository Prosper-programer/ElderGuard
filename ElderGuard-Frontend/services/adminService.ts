import { API_BASE_URL } from '../constants/api';
import { getAuthToken } from './authService';

export interface AdminSystemStats {
  totalFamilies: number;
  activeElderly: number;
  activeCaregivers: number;
  devicesOnline: number;
  criticalAlerts: number;
}

export interface AdminUser {
  user_id: number;
  full_name: string;
  email: string;
  phone_number: string;
  role: 'Tutor' | 'caregiver' | 'admin';
  status: 'active' | 'inactive';
  created_at: string;
}

const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export async function getSystemStats(): Promise<{ success: boolean; data?: AdminSystemStats; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/system-stats`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.message || 'Failed to fetch stats.' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('getSystemStats Error:', error);
    return { success: false, error: 'Network error fetching system stats.' };
  }
}

export async function getAllUsers(): Promise<{ success: boolean; data?: AdminUser[]; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.message || 'Failed to fetch users.' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('getAllUsers Error:', error);
    return { success: false, error: 'Network error fetching users.' };
  }
}

export async function toggleUserStatus(userId: number, currentStatus: 'active' | 'inactive'): Promise<{ success: boolean; error?: string }> {
  try {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status: newStatus }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.message || 'Failed to update status.' };
    }

    return { success: true };
  } catch (error) {
    console.error('toggleUserStatus Error:', error);
    return { success: false, error: 'Network error updating user status.' };
  }
}
