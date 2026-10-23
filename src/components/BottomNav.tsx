import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/theme';

export type NavTab = 'Home' | 'Menu' | 'Orders' | 'Profile';

interface BottomNavProps {
  activeTab: NavTab;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab }) => {
  const router = useRouter();

  const tabs: { name: NavTab; icon: keyof typeof Ionicons.glyphMap; route: string }[] = [
    { name: 'Home', icon: 'home', route: '/' },
    { name: 'Menu', icon: 'cafe-outline', route: '/StarbucksMenu' },
    { name: 'Orders', icon: 'receipt-outline', route: '/OrderSummary' },
    { name: 'Profile', icon: 'person-outline', route: '/Profile' },
  ];

  const handlePress = (tabName: NavTab, route: string) => {
    if (tabName === activeTab) return;
    router.push(route as any);
  };

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => {
        const isActive = tab.name === activeTab;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => handlePress(tab.name, tab.route)}
          >
            <Ionicons
              name={tab.icon}
              size={22}
              color={isActive ? COLORS.primary : COLORS.textMuted}
            />
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
  },
  navItem: {
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 3,
  },
  navLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});