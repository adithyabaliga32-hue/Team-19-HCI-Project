import React from "react";
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
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { COLORS, SPACING } from "../constants/theme";
import { BottomNav } from "../components/BottomNav";
import { useCart } from "../context/CartContext";

const money = (val: number) =>
  val.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function OrderSummaryScreen() {
  const router = useRouter();
  const { members, clearCart } = useCart();

  // Evaluates directly against CartContext state on every render/navigation tab focus
  const orderedMembers = members.filter((m) => m.added);

  const subtotal = orderedMembers.reduce(
    (acc, m) => acc + m.price * (m.quantity || 1),
    0,
  );
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  const handleCancel = () => {
    clearCart();
    router.replace("/");
  };

  const handlePayAndSubmit = () => {
    if (orderedMembers.length === 0) return;
    Alert.alert(
      "Order Submitted",
      `Your payment of ${money(total)} was successful!`,
      [
        {
          text: "OK",
          onPress: () => {
            clearCart();
            router.replace("/");
          },
        },
      ],
    );
  };

  // Empty Cart State
  if (orderedMembers.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons
              name="receipt-outline"
              size={48}
              color={COLORS.primary || "#215C47"}
            />
          </View>
          <Text style={styles.emptyTitle}>Your tray is empty</Text>
          <Text style={styles.emptySubtitle}>
            You don&apos;t have an active order right now. Tap Quick Order on
            your usual favorite or explore campus menus to start.
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push("/Menu")}
            activeOpacity={0.8}
          >
            <Text style={styles.browseButtonText}>Explore Campus Menu</Text>
          </TouchableOpacity>
        </View>
        <BottomNav activeTab="Orders" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
            <Ionicons
              name="arrow-back"
              size={20}
              color={COLORS.primary || "#215C47"}
            />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.screenTitle}>Group Order Summary</Text>
            <Text style={styles.screenSubtitle}>
              {orderedMembers.length}{" "}
              {orderedMembers.length === 1 ? "person" : "people"} · Ready to
              review
            </Text>
          </View>
        </View>

        {/* Group Member Drink Cards */}
        {orderedMembers.map((member) => (
          <View key={member.id} style={styles.card}>
            <View style={styles.itemHeader}>
              <View style={styles.itemTitleRow}>
                <Ionicons
                  name="person-circle-outline"
                  size={24}
                  color={COLORS.primary || "#215C47"}
                  style={{ marginRight: 8 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{member.name}</Text>
                  <Text style={styles.itemSubtitle}>
                    {member.restaurant} · {member.drink}
                  </Text>
                </View>
                <Text style={styles.itemPrice}>
                  {money(member.price * (member.quantity || 1))}
                </Text>
              </View>
            </View>

            {/* Customization Details */}
            <View style={styles.customizationList}>
              <View style={styles.customizationRow}>
                <Text style={styles.customizationLabel}>Size</Text>
                <Text style={styles.customizationValue}>
                  {member.size || "Grande"}
                </Text>
              </View>
              <View style={styles.customizationRow}>
                <Text style={styles.customizationLabel}>Temp</Text>
                <Text style={styles.customizationValue}>
                  {member.temperature || "Hot"}
                </Text>
              </View>
              <View style={styles.customizationRow}>
                <Text style={styles.customizationLabel}>Milk</Text>
                <Text style={styles.customizationValue}>
                  {member.milk || "Standard"}
                </Text>
              </View>
              {member.syrup ? (
                <View style={styles.customizationRow}>
                  <Text style={styles.customizationLabel}>Syrup</Text>
                  <Text style={styles.customizationValue}>{member.syrup}</Text>
                </View>
              ) : null}
              {member.whip ? (
                <View style={styles.customizationRow}>
                  <Text style={styles.customizationLabel}>Topping</Text>
                  <Text style={styles.customizationValue}>{member.whip}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.divider} />

            <View style={styles.badgeRow}>
              {member.dietaryTags.map((tag, idx) => (
                <View key={idx} style={styles.recipeBadge}>
                  <Ionicons
                    name="checkmark"
                    size={14}
                    color={COLORS.primary || "#215C47"}
                  />
                  <Text style={styles.recipeBadgeText}>
                    {tag === "None" ? "No restrictions" : tag}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Pickup Location & Payment Card */}
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Ionicons
              name="location-outline"
              size={22}
              color={COLORS.primary || "#215C47"}
              style={styles.infoIcon}
            />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Starbucks · UT Dallas</Text>
              <Text style={styles.infoSubtitle}>
                Student Union Pickup Counter
              </Text>
              <Text style={styles.timeHighlight}>Ready in ~10 min</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Feather
              name="credit-card"
              size={20}
              color={COLORS.primary || "#215C47"}
              style={styles.infoIcon}
            />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Visa ending 1234</Text>
              <Text style={styles.infoSubtitle}>Payment method</Text>
            </View>
          </View>
        </View>

        {/* Payment Summary Totals */}
        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{money(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Estimated tax</Text>
            <Text style={styles.summaryValue}>{money(tax)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{money(total)}</Text>
          </View>
        </View>

        {/* Primary Action Buttons */}
        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePayAndSubmit}
          activeOpacity={0.85}
        >
          <Text style={styles.payButtonText}>
            Pay & submit · {money(total)}
          </Text>
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
    backgroundColor: COLORS.background || "#F8F7F1",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl || 20,
    paddingTop: SPACING.md || 12,
    paddingBottom: SPACING.xl || 80,
  },
  emptyContainer: {
    flex: 1,
    justify: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.surface || "#FFF",
    justify: "center",
    alignItems: "center",
    marginBottom: SPACING.lg || 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textPrimary || "#252A26",
    marginBottom: SPACING.sm || 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary || "#68716A",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: SPACING.xl || 20,
  },
  browseButton: {
    backgroundColor: COLORS.primary || "#215C47",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
  },
  browseButtonText: {
    color: COLORS.surface || "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg || 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface || "#FFF",
    justify: "center",
    alignItems: "center",
    marginRight: SPACING.md || 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textPrimary || "#252A26",
  },
  screenSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary || "#68716A",
    marginTop: 2,
  },
  card: {
    backgroundColor: COLORS.surface || "#FFF",
    borderRadius: 20,
    padding: SPACING.lg || 16,
    marginBottom: SPACING.lg || 12,
  },
  itemHeader: {
    marginBottom: SPACING.sm || 8,
  },
  itemTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary || "#252A26",
  },
  itemSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary || "#68716A",
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary || "#215C47",
  },
  customizationList: {
    marginTop: SPACING.sm || 6,
    gap: 6,
  },
  customizationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  customizationLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary || "#215C47",
    width: 70,
  },
  customizationValue: {
    fontSize: 12,
    color: COLORS.textPrimary || "#252A26",
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border || "#E5E3DC",
    marginVertical: SPACING.md || 12,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm || 8,
  },
  recipeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.badgeBg || "#EBF2E8",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  recipeBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.primary || "#215C47",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary || "#252A26",
  },
  infoSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary || "#68716A",
    marginTop: 2,
  },
  timeHighlight: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary || "#215C47",
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justify: "space-between",
    marginVertical: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.textSecondary || "#68716A",
  },
  summaryValue: {
    fontSize: 13,
    color: COLORS.textPrimary || "#252A26",
    fontWeight: "600",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary || "#252A26",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary || "#215C47",
  },
  payButton: {
    backgroundColor: COLORS.primary || "#215C47",
    borderRadius: 25,
    height: 50,
    justify: "center",
    alignItems: "center",
    marginBottom: SPACING.md || 12,
  },
  payButtonText: {
    color: COLORS.surface || "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
  cancelButton: {
    height: 40,
    justify: "center",
    alignItems: "center",
    marginBottom: SPACING.lg || 16,
  },
  cancelButtonText: {
    color: COLORS.primary || "#215C47",
    fontSize: 14,
    fontWeight: "700",
  },
});
