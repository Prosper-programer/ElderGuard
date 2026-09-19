import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User as UserIcon, Shield, Activity } from 'lucide-react-native';
import { ScreenContainer, Card, LoadingSpinner, EmptyState, StatusBadge } from '@/components/ui';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { getAllUsers, toggleUserStatus, AdminUser } from '@/services/adminService';
import { useFocusEffect } from 'expo-router';

export default function AdminUsers() {
  const router = useRouter();
  
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    const res = await getAllUsers();
    if (res.success && res.data) {
      setUsers(res.data);
    } else {
      setError(res.error || 'Failed to load users');
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const handleToggleStatus = async (user: AdminUser) => {
    // Optimistic UI update
    const previousStatus = user.status;
    const newStatus = previousStatus === 'active' ? 'inactive' : 'active';
    
    setUsers(prev => prev.map(u => 
      u.user_id === user.user_id ? { ...u, status: newStatus } : u
    ));

    const res = await toggleUserStatus(user.user_id, previousStatus);
    
    if (!res.success) {
      // Revert if failed
      setUsers(prev => prev.map(u => 
        u.user_id === user.user_id ? { ...u, status: previousStatus } : u
      ));
      alert(res.error || 'Failed to update user status');
    }
  };

  const renderUserCard = ({ item }: { item: AdminUser }) => (
    <Card style={styles.userCard}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.full_name.charAt(0).toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{item.full_name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
        </View>
        <StatusBadge 
          status={item.status === 'active' ? 'safe' : 'offline'} 
          label={item.status === 'active' ? 'Active' : 'Inactive'} 
          size="sm" 
        />
      </View>
      
      <View style={styles.cardDivider} />
      
      <View style={styles.cardFooter}>
        <View style={styles.roleContainer}>
          {item.role === 'admin' && <Shield size={16} color={Colors.primary} />}
          {item.role === 'parent' && <UserIcon size={16} color={Colors.textSecondary} />}
          {item.role === 'caregiver' && <Activity size={16} color={Colors.accent} />}
          <Text style={styles.roleText}>
            {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
          </Text>
        </View>
        
        {item.role !== 'admin' && (
          <View style={styles.actionToggle}>
            <Text style={styles.toggleLabel}>Access</Text>
            <Switch
              value={item.status === 'active'}
              onValueChange={() => handleToggleStatus(item)}
              trackColor={{ false: Colors.offline, true: Colors.safe }}
              thumbColor={Colors.white}
            />
          </View>
        )}
      </View>
    </Card>
  );

  return (
    <ScreenContainer padded={false} backgroundColor={Colors.white}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Management</Text>
        <View style={{ width: 24 }} /> {/* Balance */}
      </View>

      {loading && users.length === 0 ? (
        <View style={styles.centered}>
          <LoadingSpinner label="Loading users..." />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => String(item.user_id)}
          renderItem={renderUserCard}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchUsers} colors={[Colors.primary]} />}
          ListEmptyComponent={
            <EmptyState 
              icon={<Users size={48} color={Colors.textTertiary} />}
              title="No Users Found"
              description="There are no users registered in the system yet."
              actionLabel="Refresh"
              onAction={fetchUsers}
            />
          }
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },
  backButton: {
    padding: Spacing.xs,
    marginLeft: -Spacing.xs,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing['3xl'],
    gap: Spacing.md,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userCard: {
    padding: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryFaded,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...Typography.h3,
    color: Colors.primary,
  },
  userName: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  userEmail: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  cardDivider: {
    height: 1,
    backgroundColor: Colors.background,
    marginVertical: Spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  roleText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontFamily: 'Inter_500Medium',
  },
  actionToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  toggleLabel: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
});
