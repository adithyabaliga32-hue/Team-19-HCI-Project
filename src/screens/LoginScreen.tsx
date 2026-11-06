import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useCart } from "../context/CartContext";

export default function LoginScreen() {
  const { setIsLoggedIn, setUserEmail } = useCart();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    setError("");
    setUserEmail(email.trim());
    setIsLoggedIn(true);
    router.replace("/");
  };

  const handleGuestContinue = () => {
    setUserEmail("Guest");
    setIsLoggedIn(true);
    router.replace("/");
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* LOGO & HERO */}
        <View style={styles.heroSection}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>SF</Text>
          </View>
          <Text style={styles.brandTitle}>ServeFlow</Text>
          <Text style={styles.brandSubtitle}>
            Campus dining & group orders made simple
          </Text>
        </View>

        {/* LOGIN FORM CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign In</Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              placeholder="example@email.com"
              placeholderTextColor="#68716A"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor="#68716A"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
          </View>

          <Pressable onPress={handleLogin} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Sign In</Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable onPress={handleGuestContinue} style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>Continue as Guest</Text>
          </Pressable>
        </View>

        <Text style={styles.footerNote}>
          UT Dallas · Student Union Dining Platform
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8F7F1" },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
    gap: 20,
  },
  heroSection: { alignItems: "center", gap: 8 },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#215C47",
    alignItems: "center",
    justifyContent: "center",
  },
  logoBadgeText: { color: "#FFF", fontWeight: "700", fontSize: 24 },
  brandTitle: { fontSize: 28, fontWeight: "700", color: "#252A26" },
  brandSubtitle: { fontSize: 13, color: "#68716A", textAlign: "center" },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: "#E5E3DC",
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#252A26" },
  errorText: { color: "#C0392B", fontSize: 12, fontWeight: "600" },
  inputGroup: { gap: 6 },
  inputLabel: { fontSize: 12, fontWeight: "600", color: "#252A26" },
  input: {
    borderWidth: 1,
    borderColor: "#E5E3DC",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: "#252A26",
    backgroundColor: "#F7F6F1",
  },
  primaryBtn: {
    backgroundColor: "#215C47",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 4,
  },
  primaryBtnText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 2,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E5E3DC" },
  dividerText: { fontSize: 11, color: "#68716A" },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#215C47",
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: "#EBF2E8",
  },
  secondaryBtnText: { color: "#215C47", fontWeight: "700", fontSize: 13 },
  footerNote: {
    fontSize: 11,
    color: "#68716A",
    textAlign: "center",
    marginTop: 10,
  },
});
