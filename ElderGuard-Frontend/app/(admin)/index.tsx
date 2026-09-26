import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Shield, Users, Activity, LogOut, BellRing, Heart } from 'lucide-react-native';
import { ScreenContainer, Card, Button, StatusBadge } from '@/components/ui';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { getSystemStats, AdminSystemStats } from '@/services/adminService';
import { useFocusEffect } from 'expo-router';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const [stats, setStats] = useState<AdminSystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    const res = await getSystemStats();
    if (res.success && res.data) {
      setStats(res.data);
    } else {
      setError(res.error || 'Failed to load system stats');
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  const handleLogout = async () => {
    await logout();
  };

  const isSystemHealthy = stats?.criticalAlerts === 0;

  return (
    <ScreenContainer scrollable={false} padded={false} backgroundColor={Colors.white}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchStats} colors={[Colors.primary]} />}
      >
        {/* Header & Greeting */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Admin'}</Text>
            <Text style={styles.subGreeting}>Here's what's happening today.</Text>
          </View>
          <View style={styles.headerBadge}>
            <StatusBadge 
              status={isSystemHealthy ? 'safe' : 'critical'} 
              label={isSystemHealthy ? 'System Optimal' : `${stats?.criticalAlerts} Critical Alerts`} 
            />
          </View>
        </View>

        <View style={styles.innerContent}>
          {/* Status Banner */}
          <Card elevated style={[styles.statusBanner, !isSystemHealthy && styles.statusBannerCritical]}>
            <View style={styles.bannerContent}>
              {isSystemHealthy ? (
                <Shield size={32} color={Colors.safe} />
              ) : (
                <BellRing size={32} color={Colors.critical} />
              )}
              <View style={styles.bannerText}>
                <Text style={styles.bannerTitle}>
                  {isSystemHealthy ? 'All systems nominal' : 'Attention Required'}
                </Text>
                <Text style={styles.bannerDescription}>
                  {isSystemHealthy 
                    ? 'There are currently no active critical alerts in the system. Patient care monitoring is running smoothly.'
                    : `There ${stats?.criticalAlerts === 1 ? 'is' : 'are'} ${stats?.criticalAlerts} unresolved critical ${stats?.criticalAlerts === 1 ? 'alert' : 'alerts'} requiring immediate review.`}
                </Text>
              </View>
            </View>
          </Card>

          {/* KPIs Grid */}
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.kpiGrid}>
            <Card style={styles.kpiCard}>
              <View style={styles.kpiIconWrapperPrimary}>
                <Users size={20} color={Colors.primary} />
              </View>
              <Text style={styles.kpiValue}>{stats?.totalFamilies || 0}</Text>
              <Text style={styles.kpiLabel}>Total Families</Text>
            </Card>
            
            <Card style={styles.kpiCard}>
              <View style={styles.kpiIconWrapperPrimary}>
                <Heart size={20} color={Colors.primary} />
              </View>
              <Text style={styles.kpiValue}>{stats?.activeElderly || 0}</Text>
              <Text style={styles.kpiLabel}>Patient Profiles</Text>
            </Card>

            <Card style={styles.kpiCard}>
              <View style={styles.kpiIconWrapperWarning}>
                <Activity size={20} color={Colors.warning} />
              </View>
              <Text style={styles.kpiValue}>{stats?.devicesOnline || 0}</Text>
              <Text style={styles.kpiLabel}>Devices Online</Text>
            </Card>

            <Card style={styles.kpiCard}>
              <View style={styles.kpiIconWrapperCritical}>
                <BellRing size={20} color={Colors.critical} />
              </View>
              <Text style={styles.kpiValue}>{stats?.criticalAlerts || 0}</Text>
              <Text style={styles.kpiLabel}>Active Alerts</Text>
            </Card>
          </View>

          {/* Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionContainer}>
            <Button 
              title="Manage Users" 
              variant="primary" 
              fullWidth 
              leftIcon={<Users size={18} color={Colors.white} />}
              onPress={() => router.push('/(admin)/users')}
            />
            <View style={{ height: Spacing.md }} />
            <Button 
              title="Log Out" 
              variant="outline" 
              fullWidth 
              leftIcon={<LogOut size={18} color={Colors.textSecondary} />}
              onPress={handleLogout}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: Spacing['3xl'],
  },
  innerContent: {
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: Colors.primary,
    padding: Spacing.xl,
    paddingTop: Spacing['3xl'],
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: Spacing.xl,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    ...Typography.h1,
    color: Colors.white,
    marginBottom: 4,
  },
  subGreeting: {
    ...Typography.body,
    color: Colors.white,
    opacity: 0.9,
  },
  headerBadge: {
    marginTop: 6,
  },
  statusBanner: {
    backgroundColor: Colors.safeBg,
    borderColor: Colors.safeLight,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  statusBannerCritical: {
    backgroundColor: Colors.criticalBg,
    borderColor: Colors.criticalLight,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  bannerDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  kpiCard: {
    width: '47%',
    padding: Spacing.md,
    alignItems: 'flex-start',
  },
  kpiIconWrapperPrimary: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryFaded,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  kpiIconWrapperWarning: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.warningBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  kpiIconWrapperCritical: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.criticalBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  kpiValue: {
    ...Typography.metric,
    color: Colors.textPrimary,
    fontSize: 28,
    marginBottom: 4,
  },
  kpiLabel: {
    ...Typography.bodySmall,
    color: Colors.textTertiary,
  },
  actionContainer: {
    marginTop: Spacing.xs,
  },
});
