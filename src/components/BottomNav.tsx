// src/components/BottomNav.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type BottomNavProps = {
  activeTab: "Home" | "Menu" | "Orders" | "Profile";
};

export function BottomNav({ activeTab }: BottomNavProps) {
  const tabs = [
    { name: "Home", route: "/", icon: "home-outline", activeIcon: "home" },
    { name: "Menu", route: "/Menu", icon: "cafe-outline", activeIcon: "cafe" },
    {
      name: "Orders",
      route: "/Orders",
      icon: "receipt-outline",
      activeIcon: "receipt",
    },
    {
      name: "Profile",
      route: "/Profile",
      icon: "person-outline",
      activeIcon: "person",
    },
  ] as const;

  return (
    <View style={styles.navBar}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        return (
          <Pressable
            key={tab.name}
            onPress={() => router.push(tab.route)}
            style={styles.tabItem}
          >
            <Ionicons
              name={isActive ? tab.activeIcon : tab.icon}
              size={22}
              color={isActive ? "#215C47" : "#68716A"}
            />
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E3DC",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabItem: {
    alignItems: "center",
    justify: "center",
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
    color: "#68716A",
    marginTop: 2,
  },
  tabLabelActive: {
    color: "#215C47",
    fontWeight: "700",
  },
});
