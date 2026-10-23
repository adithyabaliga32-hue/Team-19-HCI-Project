import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { COLORS, SPACING } from '../constants/theme';
import { CATEGORIES, FAVORITE_ITEM } from '../data/homeData';
import { MOCK_ORDER_SUMMARY } from '../data/orderData';
import { CategoryCard } from '../components/CategoryCard';
import { BottomNav } from '../components/BottomNav';
import { useCart } from '../context/CartContext';
import { SELECTED_RESTAURANT } from '../data/homeData';

export default function HomeScreen() {
  const router = useRouter();
  const { quickOrder } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = () => {
    if (searchQuery.trim().toLowerCase() === 'starbucks') {
      router.push('/StarbucksMenu' as any);
    }
  };

  const handleQuickOrder = () => {
    quickOrder(MOCK_ORDER_SUMMARY);
    router.push('/OrderSummary');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appTitle}>ServeFlow</Text>
            <Text style={styles.locationSubtitle}>UTD Student Union</Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="people-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants"
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.filterButton} onPress={handleSearchSubmit}>
            <Feather name="sliders" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Selected Restaurant */}
        <View style={styles.selectedRestaurant}>
          <View style={styles.selectedTextContainer}>
            <Text style={styles.selectedRestaurantTag}>Restaurant selected</Text>
            <Text style={styles.selectedRestaurantTitle}>{SELECTED_RESTAURANT.name}</Text>
            <Text style={styles.selectedRestaurantSubtitle}>{SELECTED_RESTAURANT.subtitle}</Text>
          </View>
          <Image
            source={{ uri: SELECTED_RESTAURANT.logoURL }}
            style={styles.selectedRestaurantImage}
          />
        </View>

        {/* Your Usual Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your usual</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Edit favorites</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.usualCard}>
          <View style={styles.usualCardTop}>
            <Image source={{ uri: FAVORITE_ITEM?.imageUrl }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <View style={styles.itemTitleRow}>
                <Text style={styles.itemTitle}>{FAVORITE_ITEM?.title}</Text>
                <TouchableOpacity>
                  <Ionicons name="heart-outline" size={22} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
              <Text style={styles.itemDescription}>Oat milk · Vegan whip · Grande · Hot</Text>
              <Text style={styles.itemPrice}>${FAVORITE_ITEM?.basePrice.toFixed(2)} · {FAVORITE_ITEM?.restaurant}</Text>
            </View>
          </View>

          <View style={styles.badgeRow}>
            {FAVORITE_ITEM?.allergenBadges.map((badge) => (
              <View key={badge} style={styles.badge}>
                <Ionicons name="checkmark" size={14} color={COLORS.primary} />
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.quickOrderButton} onPress={handleQuickOrder} activeOpacity={0.8}>
            <Ionicons name="flash-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.quickOrderText}>Quick order · ${FAVORITE_ITEM?.basePrice.toFixed(2)}</Text>
          </TouchableOpacity>
          <Text style={styles.recipeChecksText}>Recipe checks</Text>
        </View>

        {/* Explore The Menu Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore the menu</Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.exploreGrid}>
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </View>

        {/* Dietary Preference Note */}
        <View style={styles.preferenceNotice}>
          <Feather name="shield" size={16} color={COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={styles.preferenceText}>Your dietary preferences travel with your order.</Text>
        </View>

      </ScrollView>

      <BottomNav activeTab="Home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  locationSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  iconButton: {
    padding: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 30,
    paddingHorizontal: SPACING.lg,
    height: 48,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  filterButton: {
    padding: 4,
  },
  selectedRestaurant: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  selectedTextContainer: {
    flex: 1,
    paddingRight: SPACING.sm,
  },
  selectedRestaurantTag: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  selectedRestaurantTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    lineHeight: 24,
    marginBottom: SPACING.sm,
  },
  selectedRestaurantSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  selectedRestaurantImage: {
    width: 90,
    height: 90,
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  usualCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: SPACING.lg,
    marginBottom: 24,
  },
  usualCardTop: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 14,
    marginRight: 14,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  itemDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginVertical: 4,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: 14,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.badgeBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  quickOrderButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    height: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  quickOrderText: {
    color: COLORS.surface,
    fontSize: 15,
    fontWeight: '700',
  },
  recipeChecksText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  exploreGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  preferenceNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    marginBottom: 10,
  },
  preferenceText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});