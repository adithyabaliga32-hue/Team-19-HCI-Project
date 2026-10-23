import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { COLORS, SPACING } from '../constants/theme';
import { MOCK_USER_PROFILE } from '../data/orderData';
import { BottomNav } from '../components/BottomNav';
import { useCart } from '../context/CartContext';

export default function OrderSummaryScreen() {
  const router = useRouter();
  const { cartItem, clearCart } = useCart();

  const userProfile = MOCK_USER_PROFILE;

  // 3. Cancel button empties cart and navigates back to Home
  const handleCancel = () => {
    clearCart();
    router.replace('/');
  };

  const handlePayAndSubmit = () => {
    if (!cartItem) return;
    Alert.alert('Order Submitted', `Your payment of $${cartItem.total.toFixed(2)} was successful!`, [
      {
        text: 'OK',
        onPress: () => {
          clearCart();
          router.replace('/');
        },
      },
    ]);
  };

  // 1. Empty Cart State when user navigates to Orders without tapping Quick Order
  if (!cartItem) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="receipt-outline" size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.emptyTitle}>Your tray is empty</Text>
          <Text style={styles.emptySubtitle}>
            You don&apos;t have an active order right now. Tap Quick Order on your usual favorite or explore campus menus to start.
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.replace('/')}
            activeOpacity={0.8}
          >
            <Text style={styles.browseButtonText}>Explore Home Menu</Text>
          </TouchableOpacity>
        </View>
        <BottomNav activeTab="Orders" />
      </SafeAreaView>
    );
  }

  // Dynamic derivation of recipe badges from active profile
  const dynamicBadges = [];
  if (userProfile.preferences.includes('Vegan')) {
    dynamicBadges.push('Vegan recipe');
  }
  if (userProfile.allergies.includes('Nut allergy')) {
    dynamicBadges.push('Nut-free recipe');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
            <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.screenTitle}>Order summary</Text>
            <Text style={styles.screenSubtitle}>{cartItem.title} · Ready to review</Text>
          </View>
        </View>

        {/* Item & Customizations Card */}
        <View style={styles.card}>
          <View style={styles.itemHeader}>
            <View style={styles.itemTitleRow}>
              <Ionicons name="cafe-outline" size={24} color={COLORS.primary} style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{cartItem.title}</Text>
                <Text style={styles.itemSubtitle}>
                  {cartItem.category} · Quantity {cartItem.quantity}
                </Text>
              </View>
              <Text style={styles.itemPrice}>${cartItem.basePrice.toFixed(2)}</Text>
            </View>
          </View>

          {/* Customization Details */}
          <View style={styles.customizationList}>
            {cartItem.customizations.map((item, index) => (
              <View key={index} style={styles.customizationRow}>
                <Text style={styles.customizationLabel}>{item.label}</Text>
                <Text style={styles.customizationValue}>
                  {item.value}
                  {item.extraCharge ? (
                    <Text style={styles.extraChargeText}> · {item.extraCharge}</Text>
                  ) : null}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Recipe Match Confirmation */}
          <View style={styles.matchBadgeContainer}>
            <View style={styles.matchBadge}>
              <Ionicons name="checkmark" size={14} color={COLORS.primary} />
              <Text style={styles.matchBadgeText}>Recipe matched</Text>
            </View>
          </View>

          <Text style={styles.substitutionText}>
            Oat milk + vegan whip replace dairy defaults for your profile.
          </Text>

          <View style={styles.badgeRow}>
            {dynamicBadges.map((badge, idx) => (
              <View key={idx} style={styles.recipeBadge}>
                <Ionicons name="checkmark" size={14} color={COLORS.primary} />
                <Text style={styles.recipeBadgeText}>{badge}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pickup Location & Payment Card */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={22} color={COLORS.primary} style={styles.infoIcon} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>{cartItem.locationName}</Text>
              <Text style={styles.infoSubtitle}>{cartItem.locationDetails}</Text>
              <Text style={styles.timeHighlight}>{cartItem.estimatedTime}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Feather name="credit-card" size={20} color={COLORS.primary} style={styles.infoIcon} />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>{cartItem.paymentMethod}</Text>
              <Text style={styles.infoSubtitle}>Payment method</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Summary Totals */}
        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${cartItem.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Estimated tax</Text>
            <Text style={styles.summaryValue}>${cartItem.tax.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${cartItem.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Primary Action Buttons */}
        <TouchableOpacity style={styles.payButton} onPress={handlePayAndSubmit} activeOpacity={0.85}>
          <Text style={styles.payButtonText}>Pay & submit · ${cartItem.total.toFixed(2)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

      </ScrollView>

      <BottomNav activeTab="Orders" />
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.xl,
  },
  browseButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
  },
  browseButtonText: {
    color: COLORS.surface,
    fontSize: 15,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  headerTextContainer: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  screenSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  itemHeader: {
    marginBottom: SPACING.sm,
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  itemSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  customizationList: {
    marginTop: SPACING.sm,
    gap: 6,
  },
  customizationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customizationLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    width: 100,
  },
  customizationValue: {
    fontSize: 13,
    color: COLORS.textPrimary,
    flex: 1,
  },
  extraChargeText: {
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  matchBadgeContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.badgeBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  matchBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  substitutionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  recipeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.badgeBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  recipeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  infoSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  timeHighlight: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 4,
  },
  changeText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  payButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  payButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  cancelButton: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  cancelButtonText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '700',
  },
});