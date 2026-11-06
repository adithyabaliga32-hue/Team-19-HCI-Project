import { router } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BottomNav } from "../components/BottomNav";
import { getDietaryConflicts, useCart } from "../context/CartContext";

const money = (val: number) =>
  val.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function OrdersRoute() {
  const { members, setActiveMemberId } = useCart();

  const [submitted, setSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [conflictMemberId, setConflictMemberId] = useState<number | null>(null);

  const orderedMembers = members.filter((m) => m.added);
  const subtotal = orderedMembers.reduce(
    (acc, m) => acc + m.price * m.quantity,
    0,
  );
  const tax = subtotal * 0.0825;
  const total = subtotal + tax;

  const handlePlaceOrder = () => {
    setCheckoutError("");

    if (orderedMembers.length === 0) {
      setCheckoutError("Please add at least one drink before checkout.");
      return;
    }

    const conflicts = orderedMembers.flatMap((member) =>
      getDietaryConflicts(member).map((conflict) => ({
        member,
        conflict,
      })),
    );

    if (conflicts.length > 0) {
      setConflictMemberId(conflicts[0].member.id);

      const message = conflicts
        .map(({ member, conflict }) => `${member.name}: ${conflict}`)
        .join("\n");

      setCheckoutError(
        `Please resolve these dietary conflicts before checkout:\n${message}`,
      );
      return;
    }

    setConflictMemberId(null);
    setShowConfirmation(true);
  };

  const confirmOrder = () => {
    // Revalidate in case dietary preferences changed before confirmation.
    const conflicts = orderedMembers.flatMap((member) =>
      getDietaryConflicts(member).map((conflict) => ({
        member,
        conflict,
      })),
    );

    if (conflicts.length > 0 || orderedMembers.length === 0) {
      setShowConfirmation(false);

      if (conflicts.length > 0) {
        setConflictMemberId(conflicts[0].member.id);

        setCheckoutError(
          `Order details changed. ${conflicts[0].member.name}: ${conflicts[0].conflict}`,
        );
      } else {
        setCheckoutError("Please add at least one drink before checkout.");
      }

      return;
    }

    setShowConfirmation(false);
    setCheckoutError("");
    setSubmitted(true);
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

                  <View style={styles.badgeContainer}>
                    <View style={styles.tagBadge}>
                      <Text style={styles.tagText}>
                        {member.dietaryTags.includes("None")
                          ? "No restrictions"
                          : member.dietaryTags.join(" · ")}
                      </Text>
                    </View>

                    {getDietaryConflicts(member).length === 0 && (
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>✓ Verified</Text>
                      </View>
                    )}
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
                  {member.restaurant} · {member.size} · {member.temperature}
                </Text>
                <Text style={styles.cardDetail}>
                  Milk: {member.milk} · Syrup: {member.syrup} · Topping:{" "}
                  {member.whip}
                </Text>
                <Pressable
                  onPress={() => {
                    setActiveMemberId(member.id);
                    router.push("/Menu");
                  }}
                  style={styles.editBtn}
                >
                  <Text style={styles.editBtnText}>
                    Edit {member.name}&apos;s drink
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

        {checkoutError !== "" && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>⚠ {checkoutError}</Text>
            <Pressable
              onPress={() => {
                setCheckoutError("");
                if (conflictMemberId !== null) {
                  setActiveMemberId(conflictMemberId);
                }
                router.push("/Menu");
              }}
            >
              <Text style={styles.errorLink}>Review and edit drinks</Text>
            </Pressable>
          </View>
        )}

        {/* PLACE ORDER BUTTON */}
        {orderedMembers.length > 0 && !submitted && (
          <Pressable onPress={handlePlaceOrder} style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>
              Place Group Order · {money(total)}
            </Text>
          </Pressable>
        )}

        {submitted && (
          <View style={styles.successBanner}>
            <Text style={styles.successTitle}>✓ Order Submitted!</Text>
            <Text style={styles.successDetail}>
              Your simulated group order has been confirmed. Pickup at Starbucks
              UTD in approximately 10 minutes.
            </Text>
          </View>
        )}
      </ScrollView>
      <Modal
        visible={showConfirmation}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.confirmationCard}>
            <Text style={styles.confirmationTitle}>Confirm Group Order</Text>

            <Text style={styles.confirmationDetail}>
              {orderedMembers.length} drink(s) verified
            </Text>

            <Text style={styles.confirmationDetail}>Pickup: Starbucks UTD</Text>

            <Text style={styles.confirmationDetail}>
              Student Union · Pickup counter
            </Text>

            <Text style={styles.confirmationDetail}>
              Estimated preparation: 10 minutes
            </Text>

            <Text style={styles.confirmationTotal}>Total: {money(total)}</Text>

            <Pressable style={styles.submitBtn} onPress={confirmOrder}>
              <Text style={styles.submitBtnText}>Confirm Order</Text>
            </Pressable>

            <Pressable
              style={styles.cancelBtn}
              onPress={() => setShowConfirmation(false)}
            >
              <Text style={styles.cancelText}>Go Back</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

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
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  verifiedBadge: {
    backgroundColor: "#E6F3EA",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  verifiedText: {
    color: "#215C47",
    fontSize: 10,
    fontWeight: "700",
  },
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
  errorCard: {
    backgroundColor: "#FFF1EF",
    borderColor: "#E5A5A0",
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  errorText: {
    color: "#9A3028",
    fontSize: 12,
    lineHeight: 19,
  },
  errorLink: {
    color: "#215C47",
    fontSize: 12,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 24,
  },
  confirmationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    gap: 12,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#252A26",
  },
  confirmationDetail: {
    fontSize: 13,
    color: "#68716A",
  },
  confirmationTotal: {
    fontSize: 18,
    fontWeight: "700",
    color: "#215C47",
    marginTop: 8,
  },
  cancelBtn: {
    padding: 12,
    alignItems: "center",
  },
  cancelText: {
    color: "#68716A",
    fontWeight: "600",
  },
  successBanner: {
    backgroundColor: "#E6F3EA",
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 14,
  },
  successTitle: {
    color: "#215C47",
    fontWeight: "700",
    fontSize: 15,
  },
  successDetail: {
    color: "#215C47",
    fontSize: 12,
    marginTop: 4,
  },
});
