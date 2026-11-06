import React from "react";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Slot } from "expo-router";
import { CartProvider } from "../context/CartContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <CartProvider>
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
          <StatusBar barStyle="dark-content" backgroundColor="#F8F7F1" />
          <Slot />
        </SafeAreaView>
      </CartProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F7F1",
  },
});
