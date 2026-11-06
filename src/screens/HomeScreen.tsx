import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  Modal,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { useCart, DietaryTag } from "../context/CartContext";
import { DrinkArtwork } from "../components/DrinkArtwork";
import { BottomNav } from "../components/BottomNav";
import { router } from "expo-router";

const restaurants = ["Starbucks", "TeaCo"];

const savedFavorite = {
  drink: "Caffè Latte",
  restaurant: "Starbucks",
  milk: "Oat milk",
  whip: "Vegan whip",
  size: "Grande",
  temperature: "Hot",
  price: 5.45,
};

const money = (val: number) =>
  val.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function HomeScreen() {
  const {
    members,
    addMember,
    removeMember,
    updateMemberName,
    toggleMemberDietaryTag,
    updateMemberCustomization,
    setActiveMemberId,
  } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("Starbucks");
  const [editingNameId, setEditingNameId] = useState<number | null>(null);
  const [nameDraft, setNameDraft] = useState("");
  const [showDietaryModal, setShowDietaryModal] = useState(false);

  const allTags = members.flatMap((m) => m.dietaryTags);
  const groupDietarySummary = [...new Set(allTags)]
    .map((tag) => (tag === "None" ? "No restrictions" : tag))
    .join(" · ");

  const handleSaveName = (index: number) => {
    if (nameDraft.trim()) {
      updateMemberName(index, nameDraft.trim());
    }
    setEditingNameId(null);
    setNameDraft("");
  };

  const handleQuickOrder = () => {
    const targetMember = members[0];
    if (targetMember) {
      setActiveMemberId(targetMember.id);
      updateMemberCustomization(targetMember.id, {
        drink: savedFavorite.drink,
        restaurant: savedFavorite.restaurant,
        price: savedFavorite.price,
        temperature: savedFavorite.temperature,
        milk: savedFavorite.milk,
        whip: savedFavorite.whip,
        size: savedFavorite.size,
      });
    }
    router.push("/Menu");
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* --- HEADER --- */}
        <View style={styles.header}>
          <View style={styles.avatarHeader}>
            <Text style={styles.avatarHeaderText}>SF</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>ServeFlow</Text>
            <Text style={styles.headerSubtitle}>UT Dallas · Student Union</Text>
          </View>
        </View>

        {/* --- SEARCH BAR --- */}
        <View style={styles.searchBar}>
          <Svg width={18} height={18} viewBox="0 0 24 24">
            <Circle
              cx={10.8}
              cy={10.8}
              r={6.3}
              fill="none"
              stroke="#68716A"
              strokeWidth={1.8}
            />
            <Path
              d="m15.5 15.5 4 4"
              fill="none"
              stroke="#68716A"
              strokeWidth={1.8}
              strokeLinecap="round"
            />
          </Svg>
          <TextInput
            placeholder="Search restaurants or drinks"
            placeholderTextColor="#68716A"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>

        {/* --- RESTAURANT SELECTION --- */}
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Nearby restaurants</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {restaurants.map((r) => {
            const active = r === selectedRestaurant;
            return (
              <Pressable
                key={r}
                onPress={() => setSelectedRestaurant(r)}
                style={[
                  styles.restaurantChip,
                  active && styles.restaurantChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.restaurantChipText,
                    active && styles.restaurantChipTextActive,
                  ]}
                >
                  {r}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* --- YOUR USUAL CARD WITH DRINK IMAGE --- */}
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Your usual</Text>
        </View>
        <View style={styles.usualCard}>
          <View style={styles.usualRow}>
            <DrinkArtwork drink={savedFavorite.drink} size={64} />
            <View style={{ flex: 1, gap: 2 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.memberName}>{savedFavorite.drink}</Text>
                <Text style={styles.priceText}>
                  {money(savedFavorite.price)}
                </Text>
              </View>
              <Text style={styles.cardDetail}>
                {savedFavorite.restaurant} · {savedFavorite.milk} ·{" "}
                {savedFavorite.size}
              </Text>
            </View>
          </View>
          <Pressable onPress={handleQuickOrder} style={styles.quickOrderBtn}>
            <Text style={styles.quickOrderText}>Quick order</Text>
          </Pressable>
        </View>

        {/* --- GROUP ORDER SECTION --- */}
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Group order</Text>
          <Text style={styles.sectionCount}>
            {members.length} {members.length === 1 ? "person" : "people"}
          </Text>
        </View>

        <View style={styles.crewBanner}>
          <Text style={styles.crewIcon}>♧</Text>
          <View>
            <Text style={styles.crewTitle}>Your crew</Text>
            <Text style={styles.cardDetail}>
              {members.length} {members.length === 1 ? "person" : "people"}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => setShowDietaryModal(true)}
          style={styles.tagSettings}
        >
          <Text style={styles.tagIcon}>◆</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.crewTitle}>Set dietary tags</Text>
            <Text style={styles.cardDetail}>{groupDietarySummary}</Text>
          </View>
          <Text style={styles.mutedText}>›</Text>
        </Pressable>

        {/* Group Members List */}
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Group members</Text>
          <Pressable onPress={addMember} style={styles.addMemberButton}>
            <Text style={styles.addMemberButtonText}>＋ Add person</Text>
          </Pressable>
        </View>

        {members.map((member, index) => (
          <View key={member.id} style={styles.memberCard}>
            <View style={styles.memberDetails}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>♙</Text>
              </View>
              <View style={{ flex: 1 }}>
                {editingNameId === member.id ? (
                  <TextInput
                    value={nameDraft}
                    onChangeText={setNameDraft}
                    onSubmitEditing={() => handleSaveName(index)}
                    autoFocus
                    style={styles.nameInput}
                  />
                ) : (
                  <Text style={styles.memberName}>{member.name}</Text>
                )}
                <Text style={styles.cardDetail}>
                  {member.dietaryTags
                    .map((t) => (t === "None" ? "No restrictions" : t))
                    .join(", ")}
                </Text>
              </View>
            </View>

            <View style={styles.memberActions}>
              {editingNameId === member.id ? (
                <Pressable
                  onPress={() => handleSaveName(index)}
                  style={styles.actionBtn}
                >
                  <Text style={styles.actionText}>Save</Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => {
                    setEditingNameId(member.id);
                    setNameDraft(member.name);
                  }}
                  style={styles.actionBtn}
                >
                  <Text style={styles.actionText}>Edit name</Text>
                </Pressable>
              )}
              <Pressable
                disabled={members.length <= 1}
                onPress={() => removeMember(index)}
                style={styles.actionBtn}
              >
                <Text
                  style={[
                    styles.removeText,
                    members.length <= 1 && { opacity: 0.4 },
                  ]}
                >
                  Remove
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() => router.push("/Menu")}
              style={styles.customizeButton}
            >
              <Text style={styles.customizeButtonText}>
                {member.added
                  ? `Edit ${member.name}'s drink`
                  : `Customize for ${member.name}`}
              </Text>
            </Pressable>
          </View>
        ))}

        {/* DIETARY TAGS MODAL */}
        <Modal visible={showDietaryModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <Text style={styles.modalTitle}>Set dietary tags</Text>
              {members.map((member, index) => (
                <View key={member.id} style={{ marginVertical: 6 }}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 6,
                      marginTop: 4,
                    }}
                  >
                    {(
                      [
                        "Vegan",
                        "Nut allergy",
                        "Lactose intolerance",
                        "None",
                      ] as DietaryTag[]
                    ).map((tag) => {
                      const active = member.dietaryTags.includes(tag);
                      return (
                        <Pressable
                          key={tag}
                          onPress={() => toggleMemberDietaryTag(index, tag)}
                          style={[
                            styles.tagChip,
                            active && styles.tagChipActive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.tagChipText,
                              active && styles.tagChipTextActive,
                            ]}
                          >
                            {tag}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ))}
              <Pressable
                onPress={() => setShowDietaryModal(false)}
                style={styles.closeModalBtn}
              >
                <Text style={styles.closeModalText}>Done</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>

      <BottomNav activeTab="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8F7F1" },
  container: { padding: 20, paddingBottom: 80, gap: 12 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  avatarHeader: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#215C47",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarHeaderText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#252A26" },
  headerSubtitle: { fontSize: 11, color: "#68716A" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    minHeight: 44,
    borderWidth: 1,
    borderColor: "#E5E3DC",
    borderRadius: 14,
    backgroundColor: "#FFF",
  },
  searchInput: { flex: 1, color: "#252A26", fontSize: 13 },
  sectionHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  sectionTitle: { fontSize: 14, fontWeight: "600", color: "#252A26" },
  sectionCount: { fontSize: 11, color: "#215C47", fontWeight: "700" },
  restaurantChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E3DC",
    backgroundColor: "#FFF",
  },
  restaurantChipActive: { backgroundColor: "#215C47", borderColor: "#215C47" },
  restaurantChipText: { fontSize: 11, color: "#68716A" },
  restaurantChipTextActive: { color: "#FFF", fontWeight: "600" },
  usualCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  usualRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  priceText: { color: "#215C47", fontWeight: "700", fontSize: 13 },
  quickOrderBtn: {
    backgroundColor: "#215C47",
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  quickOrderText: { color: "#FFF", fontWeight: "700", fontSize: 12 },
  crewBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#EBF2E8",
    borderRadius: 14,
    padding: 14,
  },
  crewIcon: { fontSize: 24, color: "#215C47" },
  crewTitle: { fontSize: 13, fontWeight: "700", color: "#252A26" },
  cardDetail: { fontSize: 11, color: "#68716A" },
  tagSettings: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E3DC",
    borderRadius: 14,
  },
  tagIcon: { color: "#215C47", fontSize: 16 },
  mutedText: { color: "#68716A" },
  addMemberButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#EBF2E8",
  },
  addMemberButtonText: { color: "#215C47", fontSize: 11, fontWeight: "700" },
  memberCard: {
    padding: 12,
    backgroundColor: "#FFF",
    borderRadius: 16,
    gap: 10,
  },
  memberDetails: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F0E6D5",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#215C47", fontSize: 16 },
  memberName: { fontSize: 13, fontWeight: "700", color: "#252A26" },
  nameInput: {
    borderWidth: 1,
    borderColor: "#E5E3DC",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 13,
  },
  memberActions: { flexDirection: "row", gap: 8 },
  actionBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "#F7F6F1",
  },
  actionText: { fontSize: 11, color: "#215C47", fontWeight: "600" },
  removeText: { fontSize: 11, color: "#93602F", fontWeight: "600" },
  customizeButton: {
    minHeight: 40,
    borderRadius: 20,
    backgroundColor: "#EBF2E8",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#A1B5A4",
  },
  customizeButtonText: { color: "#215C47", fontSize: 12, fontWeight: "700" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalSheet: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 18,
    gap: 12,
  },
  modalTitle: { fontSize: 16, fontWeight: "700", color: "#252A26" },
  tagChip: {
    borderWidth: 1,
    borderColor: "#E5E3DC",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagChipActive: { backgroundColor: "#215C47", borderColor: "#215C47" },
  tagChipText: { fontSize: 10, color: "#68716A" },
  tagChipTextActive: { color: "#FFF", fontWeight: "700" },
  closeModalBtn: {
    backgroundColor: "#215C47",
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },
  closeModalText: { color: "#FFF", fontWeight: "700" },
});
