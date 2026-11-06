// src/screens/CustomizeScreen.tsx
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { BottomNav } from "../components/BottomNav";
import { DrinkArtwork } from "../components/DrinkArtwork";
import { getDietaryConflicts, useCart } from "../context/CartContext";

const money = (val: number) =>
  val.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function CustomizeScreen() {
  const { members, activeMemberId, updateMemberCustomization } = useCart();
  const currentMember =
    members.find((m) => m.id === activeMemberId) ?? members[0];

  const [selectedSize, setSelectedSize] = useState(
    currentMember?.size ?? "Grande",
  );
  const [selectedTemperature, setSelectedTemperature] = useState(
    currentMember?.temperature ?? "Hot",
  );
  const [selectedMilk, setSelectedMilk] = useState(
    currentMember?.milk ?? "Oat milk",
  );
  const [selectedSyrup, setSelectedSyrup] = useState(
    currentMember?.syrup ?? "No syrup",
  );
  const [selectedWhip, setSelectedWhip] = useState(
    currentMember?.whip ?? "Dairy whip",
  );
  const [quantity] = useState(currentMember?.quantity ?? 1);

  if (!currentMember) return null;

  const tempMember = {
    ...currentMember,
    size: selectedSize,
    temperature: selectedTemperature,
    milk: selectedMilk,
    syrup: selectedSyrup,
    whip: selectedWhip,
    quantity,
  };

  const conflicts = getDietaryConflicts(tempMember);

  const handleSave = () => {
    updateMemberCustomization(currentMember.id, {
      size: selectedSize,
      temperature: selectedTemperature,
      milk: selectedMilk,
      syrup: selectedSyrup,
      whip: selectedWhip,
      quantity,
    });
    // Return to Menu retaining the target member ID in route parameters
    router.push({
      pathname: "/Menu",
      params: { memberId: currentMember.id },
    });
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Customize Drink</Text>
        <Text style={styles.headerSubtitle}>
          Customizing for {currentMember.name}
        </Text>

        <View style={styles.drinkCard}>
          <DrinkArtwork drink={currentMember.drink} size={70} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.drinkName}>{currentMember.drink}</Text>
            <Text style={styles.priceText}>{money(currentMember.price)}</Text>
            <Text style={styles.cardDetail}>{currentMember.restaurant}</Text>
          </View>
        </View>

        {/* DIETARY CONFLICT NOTICES */}
        {conflicts.map((c) => (
          <View key={c} style={styles.conflictCard}>
            <Text style={styles.conflictText}>⚠ {c}</Text>
          </View>
        ))}

        {/* SIZE */}
        <Text style={styles.sectionTitle}>Size</Text>
        <View style={styles.chipRow}>
          {["Tall", "Grande", "Venti"].map((size) => (
            <Pressable
              key={size}
              onPress={() => setSelectedSize(size)}
              style={[styles.chip, selectedSize === size && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedSize === size && styles.chipTextActive,
                ]}
              >
                {size}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* TEMPERATURE */}
        <Text style={styles.sectionTitle}>Temperature</Text>
        <View style={styles.chipRow}>
          {["Hot", "Iced"].map((temp) => (
            <Pressable
              key={temp}
              onPress={() => setSelectedTemperature(temp)}
              style={[
                styles.chip,
                selectedTemperature === temp && styles.chipActive,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedTemperature === temp && styles.chipTextActive,
                ]}
              >
                {temp}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* MILK */}
        <Text style={styles.sectionTitle}>Milk</Text>
        <View style={styles.chipRow}>
          {["Oat milk", "2% milk", "Almond milk", "No milk"].map((milk) => (
            <Pressable
              key={milk}
              onPress={() => setSelectedMilk(milk)}
              style={[styles.chip, selectedMilk === milk && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedMilk === milk && styles.chipTextActive,
                ]}
              >
                {milk}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* SYRUP */}
        <Text style={styles.sectionTitle}>Syrup</Text>
        <View style={styles.chipRow}>
          {["No syrup", "Vanilla syrup", "Caramel syrup", "Hazelnut syrup"].map(
            (syrup) => (
              <Pressable
                key={syrup}
                onPress={() => setSelectedSyrup(syrup)}
                style={[
                  styles.chip,
                  selectedSyrup === syrup && styles.chipActive,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedSyrup === syrup && styles.chipTextActive,
                  ]}
                >
                  {syrup}
                </Text>
              </Pressable>
            ),
          )}
        </View>

        {/* TOPPING */}
        <Text style={styles.sectionTitle}>Topping</Text>
        <View style={styles.chipRow}>
          {["Dairy whip", "Vegan whip", "No topping"].map((whip) => (
            <Pressable
              key={whip}
              onPress={() => setSelectedWhip(whip)}
              style={[styles.chip, selectedWhip === whip && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedWhip === whip && styles.chipTextActive,
                ]}
              >
                {whip}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* SAVE BUTTON */}
        <Pressable
          disabled={conflicts.length > 0}
          onPress={handleSave}
          style={[styles.saveBtn, conflicts.length > 0 && { opacity: 0.5 }]}
        >
          <Text style={styles.saveBtnText}>
            {conflicts.length > 0
              ? "Resolve Conflict to Add"
              : `Add for ${currentMember.name} · ${money(currentMember.price * quantity)}`}
          </Text>
        </Pressable>
      </ScrollView>

      <BottomNav activeTab="Menu" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8F7F1" },
  container: { padding: 20, paddingBottom: 80, gap: 10 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#252A26" },
  headerSubtitle: { fontSize: 11, color: "#68716A", marginBottom: 4 },
  drinkCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFF",
    padding: 14,
    borderRadius: 16,
  },
  drinkName: { fontSize: 15, fontWeight: "700", color: "#252A26" },
  priceText: { color: "#215C47", fontWeight: "700", fontSize: 13 },
  cardDetail: { fontSize: 11, color: "#68716A" },
  conflictCard: { backgroundColor: "#FCF1E4", padding: 10, borderRadius: 12 },
  conflictText: { color: "#93602F", fontSize: 11, fontWeight: "700" },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#252A26",
    marginTop: 4,
  },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E3DC",
    backgroundColor: "#FFF",
  },
  chipActive: { backgroundColor: "#215C47", borderColor: "#215C47" },
  chipText: { fontSize: 11, color: "#68716A" },
  chipTextActive: { color: "#FFF", fontWeight: "600" },
  saveBtn: {
    backgroundColor: "#215C47",
    padding: 14,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 12,
  },
  saveBtnText: { color: "#FFF", fontWeight: "700", fontSize: 13 },
});
