import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useCart } from "../context/CartContext";
import { BottomNav } from "../components/BottomNav";
import { router } from "expo-router";

const money = (val: number) =>
  val.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function OrdersRoute() {
  const { members } = useCart();
  const [submitted, setSubmitted] = useState(false);

  const orderedMembers = members.filter((m) => m.added);
  const subtotal = orderedMembers.reduce(
    (acc, m) => acc + m.price * m.quantity,
    0,
  );
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  const handlePlaceOrder = () => {
    setSubmitted(true);
    Alert.alert(
      "Order Submitted!",
      "Your group order has been placed successfully.",
    );
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Group Summary</Text>
        <Text style={styles.headerSubtitle}>
          {orderedMembers.length}{" "}
          {orderedMembers.length === 1 ? "person" : "people"} · Review each
          drink
        </Text>

        {/* ORDER ITEMS CARD */}
        <View style={styles.card}>
          {orderedMembers.length === 0 ? (
            <Text style={styles.cardDetail}>
              No drinks added to group order yet.
            </Text>
          ) : (
            orderedMembers.map((member, index) => (
              <View key={member.id} style={styles.itemRow}>
                {index > 0 && <View style={styles.divider} />}
                <View style={styles.itemHeader}>
                  <Text style={styles.memberName}>♙ {member.name}</Text>
                  <View style={styles.tagBadge}>
                    <Text style={styles.tagText}>
                      {member.dietaryTag === "None"
                        ? "No restrictions"
                        : member.dietaryTag}
                    </Text>
                  </View>
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.bodyText}>
                    {member.quantity} × {member.drink}
                  </Text>
                  <Text style={styles.bodyText}>
                    {money(member.price * member.quantity)}
                  </Text>
                </View>
                <Text style={styles.cardDetail}>
                  {member.restaurant} · {member.size} · {member.temperature} ·{" "}
                  {member.milk}
                </Text>
                <Pressable
                  onPress={() => router.push("/Menu")}
                  style={styles.editBtn}
                >
                  <Text style={styles.editBtnText}>
                    Edit {member.name}'s drink
                  </Text>
                </Pressable>
              </View>
            ))
          )}
        </View>

        {/* PICKUP & PAYMENT CARD */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>⌖ Starbucks UTD</Text>
          <Text style={styles.cardDetail}>Student Union · Pickup counter</Text>
          <Text style={styles.readyText}>Ready in ~10 min</Text>
          <View style={styles.divider} />
          <Text style={styles.cardHeading}>▱ Visa ending 1234</Text>
          <Text style={styles.cardDetail}>Payment method</Text>
        </View>

        {/* PRICE SUMMARY CARD */}
        <View style={styles.card}>
          <View style={styles.priceRow}>
            <Text style={styles.cardDetail}>Subtotal</Text>
            <Text style={styles.bodyText}>{money(subtotal)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.cardDetail}>Estimated tax</Text>
            <Text style={styles.bodyText}>{money(tax)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.cardHeading}>Total</Text>
            <Text style={styles.totalText}>{money(total)}</Text>
          </View>
        </View>

        {/* PLACE ORDER BUTTON */}
        {orderedMembers.length > 0 && !submitted && (
          <Pressable onPress={handlePlaceOrder} style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>
              Place Group Order · {money(total)}
            </Text>
          </Pressable>
        )}
      </ScrollView>
      <BottomNav activeTab="Orders" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8F7F1" },
  container: { padding: 20, paddingBottom: 80, gap: 12 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#252A26" },
  headerSubtitle: { fontSize: 11, color: "#68716A", marginBottom: 4 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E3DC",
  },
  itemRow: { gap: 6 },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E3DC",
    marginVertical: 6,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  memberName: { fontSize: 13, fontWeight: "700", color: "#252A26" },
  tagBadge: {
    backgroundColor: "#EBF2E8",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: { color: "#215C47", fontSize: 10, fontWeight: "600" },
  itemDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bodyText: { fontSize: 12, color: "#252A26" },
  cardDetail: { fontSize: 11, color: "#68716A" },
  cardHeading: { fontSize: 13, fontWeight: "700", color: "#252A26" },
  readyText: { color: "#215C47", fontSize: 11, fontWeight: "700" },
  editBtn: { alignSelf: "flex-start", marginTop: 4 },
  editBtnText: { color: "#215C47", fontSize: 11, fontWeight: "700" },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalText: { fontSize: 14, fontWeight: "700", color: "#215C47" },
  submitBtn: {
    backgroundColor: "#215C47",
    padding: 14,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 8,
  },
  submitBtnText: { color: "#FFF", fontWeight: "700", fontSize: 13 },
});
