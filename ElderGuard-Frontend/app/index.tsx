import React from 'react';
import { Redirect } from 'expo-router';
import { ScreenContainer, LoadingSpinner } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

/**
 * Root Gateway — Authentication & Role-Based Router
 *
 * Directs users to the appropriate flow depending on their authentication
 * status and role (Parent, Caregiver).
 */
export default function IndexGateway() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <ScreenContainer scrollable={false} padded={false}>
        <LoadingSpinner size="large" label="Initializing ElderGuard..." />
      </ScreenContainer>
    );
  }

  if (!isAuthenticated || !user) {
    return <Redirect href="/(auth)/splash" />;
  }

  switch (user.role) {
    case 'parent':
      return <Redirect href="/(parent)" />;
    case 'caregiver':
      return <Redirect href="/(caregiver)" />;
    case 'doctor':
      return <Redirect href={"/(doctor)" as any} />;
    case 'admin':
      return <Redirect href={"/(admin)" as any} />;
    default:
      return <Redirect href="/(auth)/welcome" />;
  }
}
