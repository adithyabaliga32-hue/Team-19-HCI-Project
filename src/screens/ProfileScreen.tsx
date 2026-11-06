// src/screens/ProfileScreen.tsx
import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart, DietaryTag } from "../context/CartContext";
import { BottomNav } from "../components/BottomNav";
import { router } from "expo-router";

const tagOptions: DietaryTag[] = [
  "Vegan",
  "Gluten-free",
  "Nut allergy",
  "Lactose intolerance",
  "None",
];

export default function ProfileScreen() {
  const { profileTags, setProfileTags, logout } = useCart();
  const [draftTags, setDraftTags] = useState<DietaryTag[]>(profileTags);

  const toggleTag = (tag: DietaryTag) => {
    if (tag === "None") {
      setDraftTags(["None"]);
      return;
    }
    const filtered = draftTags.filter((t) => t !== "None");
    if (filtered.includes(tag)) {
      const updated = filtered.filter((t) => t !== tag);
      setDraftTags(updated.length === 0 ? ["None"] : updated);
    } else {
      setDraftTags([...filtered, tag]);
    }
  };

  const savePreferences = () => {
    setProfileTags(draftTags);
  };

  const handleLogout = () => {
    logout();
    router.replace("/Login");
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Dietary Profile</Text>
            <Text style={styles.headerSubtitle}>
              Manage your individual & group order preferences
            </Text>
          </View>
          <View style={styles.settingsBtn}>
            <Ionicons name="settings-sharp" size={20} color="#68716A" />
          </View>
        </View>

        {/* HERO CARD WITH PERFECTLY CENTERED AVATAR */}
        <View style={styles.heroCard}>
          <View style={styles.avatar}>
            <Ionicons
              name="person-outline"
              size={22}
              color="#FFF"
              style={{ textAlign: "center" }}
            />
          </View>
          <Text style={styles.heroTitle}>You</Text>
        </View>

        <Text style={styles.sectionTitle}>Dietary restrictions</Text>
        {tagOptions.map((tag) => {
          const selected = draftTags.includes(tag);
          return (
            <Pressable
              key={tag}
              onPress={() => toggleTag(tag)}
              style={[styles.tagRow, selected && styles.tagRowSelected]}
            >
              <View
                style={[styles.checkbox, selected && styles.checkboxSelected]}
              >
                {selected && (
                  <Text
                    style={{ color: "#FFF", fontSize: 10, fontWeight: "700" }}
                  >
                    ✓
                  </Text>
                )}
              </View>
              <Text style={styles.tagText}>
                {tag === "None" ? "No restrictions" : tag}
              </Text>
            </Pressable>
          );
        })}

        <Pressable onPress={savePreferences} style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save preferences</Text>
        </Pressable>

        <Pressable onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutBtnText}>Sign Out</Text>
        </Pressable>
      </ScrollView>

      <BottomNav activeTab="Profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8F7F1" },
  container: { padding: 20, paddingBottom: 80, gap: 12 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#252A26" },
  headerSubtitle: { fontSize: 11, color: "#68716A", marginTop: 2 },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E5E3DC",
    alignItems: "center",
    justifyContent: "center",
  },
  heroCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#EBF2E8",
    padding: 14,
    borderRadius: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#215C47",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: { fontSize: 16, fontWeight: "700", color: "#252A26" },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#252A26",
    marginTop: 6,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E3DC",
  },
  tagRowSelected: { backgroundColor: "#EBF2E8", borderColor: "#215C47" },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#68716A",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: { backgroundColor: "#215C47", borderColor: "#215C47" },
  tagText: { fontSize: 12, color: "#252A26" },
  saveBtn: {
    backgroundColor: "#215C47",
    padding: 14,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 12,
  },
  saveBtnText: { color: "#FFF", fontWeight: "700", fontSize: 13 },
  logoutBtn: {
    borderWidth: 1,
    borderColor: "#93602F",
    backgroundColor: "#FCF1E4",
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 4,
  },
  logoutBtnText: { color: "#93602F", fontWeight: "700", fontSize: 12 },
});
