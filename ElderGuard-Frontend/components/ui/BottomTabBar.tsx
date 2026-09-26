import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Home,
  Activity,
  Bell,
  MapPin,
  MoreHorizontal,
  CheckSquare,
  History,
  ShieldAlert,
  User,
  Pill,
} from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useAlerts } from '@/context/AlertContext';

export type TabKey =
  | 'home'
  | 'health'
  | 'care'
  | 'alerts'
  | 'location'
  | 'profile'
  | 'history'
  | 'more';

interface BottomTabBarProps {
  activeTab: TabKey;
  role: 'parent' | 'caregiver';
}

export function BottomTabBar({ activeTab, role }: BottomTabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const { activeAlerts } = useAlerts();

  const isNarrow = windowWidth < 360;
  const accentColor = role === 'parent' ? Colors.primary : Colors.safe;
  const activeIconBg = role === 'parent' ? 'rgba(60, 111, 219, 0.10)' : 'rgba(34, 197, 94, 0.12)';

  const parentTabs: { key: TabKey; label: string; icon: any; route: string }[] = [
    { key: 'home', label: 'Home', icon: Home, route: '/(parent)' },
    { key: 'health', label: 'Health', icon: Activity, route: '/(parent)/health' },
    { key: 'alerts', label: 'Alerts', icon: Bell, route: '/(parent)/alerts' },
    { key: 'location', label: 'Location', icon: MapPin, route: '/(parent)/location' },
    { key: 'more', label: 'More', icon: MoreHorizontal, route: '/(parent)/more' },
  ];

  const caregiverTabs: { key: TabKey; label: string; icon: any; route: string }[] = [
    { key: 'home', label: 'Home', icon: Home, route: '/(caregiver)' },
    { key: 'care', label: 'Activities', icon: CheckSquare, route: '/(caregiver)/care' },
    { key: 'alerts', label: 'Alerts', icon: Bell, route: '/(caregiver)/alerts' },
    { key: 'history', label: 'History', icon: History, route: '/(caregiver)/history' },
    { key: 'more', label: 'More', icon: MoreHorizontal, route: '/(caregiver)/settings' },
  ];

  const tabs = role === 'caregiver' ? caregiverTabs : parentTabs;

  const handleTabPress = (route: string, key: TabKey) => {
    if (key === activeTab) return;
    router.replace(route as any);
  };

  return (
    <View
      style={[
        styles.barContainer,
        {
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}
    >
      <View style={styles.tabsRow}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          const Icon = tab.icon;
          const isAlertTab = tab.key === 'alerts';
          const alertCount = activeAlerts.length;

          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => handleTabPress(tab.route, tab.key)}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              {/* Active top pill indicator from Figma */}
              {isActive && (
                <View style={[styles.activeIndicator, { backgroundColor: accentColor }]} />
              )}

              <View
                style={[
                  styles.iconWrap,
                  isActive && [styles.iconWrapActive, { backgroundColor: activeIconBg }],
                ]}
              >
                <Icon
                  size={isNarrow ? 18 : 20}
                  color={isActive ? accentColor : '#94A3B8'}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />

                {isAlertTab && alertCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{alertCount > 9 ? '9+' : alertCount}</Text>
                  </View>
                )}
              </View>

              <Text
                numberOfLines={1}
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? accentColor : '#94A3B8',
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(226, 232, 240, 0.8)',
    paddingTop: 8,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 2,
  },
  activeIndicator: {
    position: 'absolute',
    top: -8,
    width: 24,
    height: 3,
    borderRadius: 2,
  },
  iconWrap: {
    width: 36,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconWrapActive: {
    borderRadius: 10,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    letterSpacing: -0.2,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -3,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
