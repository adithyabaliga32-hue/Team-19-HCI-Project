import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { BottomNav } from "../components/BottomNav";
import { DrinkArtwork } from "../components/DrinkArtwork";
import { useCart } from "../context/CartContext";

const restaurants = ["Starbucks", "TeaCo"];
const allRestaurantsOption = "All";

type MenuDrink = {
  restaurant: string;
  drink: string;
  price: number;
  temperature: string;
};

const menuDrinks: MenuDrink[] = [
  {
    restaurant: "Starbucks",
    drink: "Caffè Latte",
    price: 5.45,
    temperature: "Hot",
  },
  {
    restaurant: "Starbucks",
    drink: "Cold Brew",
    price: 4.25,
    temperature: "Iced",
  },
  {
    restaurant: "Starbucks",
    drink: "Americano",
    price: 3.45,
    temperature: "Hot",
  },
  {
    restaurant: "Starbucks",
    drink: "Caramel Macchiato",
    price: 5.95,
    temperature: "Hot",
  },
  {
    restaurant: "Starbucks",
    drink: "Caffè Mocha",
    price: 5.65,
    temperature: "Hot",
  },
  {
    restaurant: "Starbucks",
    drink: "Iced Matcha Latte",
    price: 5.75,
    temperature: "Iced",
  },
  {
    restaurant: "TeaCo",
    drink: "Brown Milk Sugar Boba",
    price: 5.95,
    temperature: "Iced",
  },
  {
    restaurant: "TeaCo",
    drink: "Black Milk Tea",
    price: 5.25,
    temperature: "Iced",
  },
  {
    restaurant: "TeaCo",
    drink: "Matcha Milk Tea",
    price: 5.75,
    temperature: "Iced",
  },
  {
    restaurant: "TeaCo",
    drink: "Strawberry Milk Tea",
    price: 5.75,
    temperature: "Iced",
  },
  {
    restaurant: "TeaCo",
    drink: "Peach Iced Tea",
    price: 4.25,
    temperature: "Iced",
  },
  {
    restaurant: "TeaCo",
    drink: "Honey Lemon Tea",
    price: 4.25,
    temperature: "Hot",
  },
];

const money = (val: number) =>
  val.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function MenuScreen() {
  const {
    members,
    activeMemberId,
    setActiveMemberId,
    updateMemberCustomization,
  } = useCart();
const [searchQuery, setSearchQuery] = useState("");
const [menuFilter, setMenuFilter] = useState(allRestaurantsOption);
const [targetMemberId, setTargetMemberId] = useState(activeMemberId);

useFocusEffect(
  useCallback(() => {
    setTargetMemberId(activeMemberId);
  }, [activeMemberId]),
);

  const targetMember = useMemo(
    () => members.find((m) => m.id === targetMemberId) ?? members[0],
    [members, targetMemberId],
  );

  const visibleDrinks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return menuDrinks.filter(
      (item) =>
        (menuFilter === allRestaurantsOption ||
          item.restaurant === menuFilter) &&
        (!query ||
          item.restaurant.toLowerCase().includes(query) ||
          item.drink.toLowerCase().includes(query)),
    );
  }, [menuFilter, searchQuery]);

  const handleSelectMember = (id: number) => {
    setTargetMemberId(id);
    setActiveMemberId(id);
  };

  const handleSelectDrink = useCallback(
    (item: MenuDrink) => {
      if (targetMember) {
        setActiveMemberId(targetMember.id);
        updateMemberCustomization(targetMember.id, {
          drink: item.drink,
          restaurant: item.restaurant,
          price: item.price,
          temperature: item.temperature,
        });
        router.push("/Customize");
      }
    },
    [targetMember, setActiveMemberId, updateMemberCustomization],
  );

  const hasAddedItems = useMemo(() => members.some((m) => m.added), [members]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Menu</Text>
      <Text style={styles.headerSubtitle}>Select a drink for your group</Text>

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
          placeholder="Search drinks or restaurants"
          placeholderTextColor="#68716A"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.chipScroll}>
        {[allRestaurantsOption, ...restaurants].map((r) => {
          const active = r === menuFilter;
          return (
            <Pressable
              key={r}
              onPress={() => setMenuFilter(r)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {r}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.targetCard}>
        <Text style={styles.sectionTitle}>Ordering for:</Text>
        <View style={styles.memberChipRow}>
          {members.map((m) => {
            const active = m.id === targetMemberId;
            const tagText = m.dietaryTags
              .map((t) => (t === "None" ? "No restrictions" : t))
              .join(", ");
            return (
              <Pressable
                key={m.id}
                onPress={() => handleSelectMember(m.id)}
                style={[styles.memberChip, active && styles.memberChipActive]}
              >
                <Text
                  style={[
                    styles.memberChipText,
                    active && styles.memberChipTextActive,
                  ]}
                >
                  {m.name} ({tagText})
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Text style={styles.sectionTitle}>Available drinks</Text>
    </View>
  );

  const renderDrinkItem = useCallback(
    ({ item }: { item: MenuDrink }) => {
      const isSelected =
        targetMember?.added && targetMember.drink === item.drink;
      return (
        <View style={[styles.drinkRow, isSelected && styles.drinkRowSelected]}>
          <DrinkArtwork drink={item.drink} size={50} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.drinkName}>{item.drink}</Text>
            <Text style={styles.cardDetail}>
              {item.restaurant} · From {money(item.price)}
            </Text>
          </View>
          <Pressable
            onPress={() => handleSelectDrink(item)}
            style={[styles.chooseBtn, isSelected && styles.chooseBtnActive]}
          >
            <Text
              style={[
                styles.chooseBtnText,
                isSelected && styles.chooseBtnTextActive,
              ]}
            >
              {isSelected
                ? "Customize ✓"
                : `Select for ${targetMember?.name ?? "Group"}`}
            </Text>
          </Pressable>
        </View>
      );
    },
    [targetMember, handleSelectDrink],
  );

  return (
    <View style={styles.root}>
      <FlatList
        data={visibleDrinks}
        keyExtractor={(item) => `${item.restaurant}-${item.drink}`}
        ListHeaderComponent={renderHeader}
        renderItem={renderDrinkItem}
        contentContainerStyle={[
          styles.container,
          hasAddedItems && { paddingBottom: 140 },
        ]}
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={Platform.OS === "android"}
        getItemLayout={(_, index) => ({
          length: 70,
          offset: 70 * index,
          index,
        })}
      />

      {hasAddedItems && (
        <View style={styles.stickyBar}>
          <Pressable
            onPress={() => router.push("/Orders")}
            style={styles.confirmBtn}
          >
            <Text style={styles.confirmBtnText}>
              Confirm & View Order Summary ›
            </Text>
          </Pressable>
        </View>
      )}

      <BottomNav activeTab="Menu" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8F7F1" },
  container: { padding: 20, paddingBottom: 90, gap: 10 },
  headerContainer: { gap: 12, marginBottom: 4 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#252A26" },
  headerSubtitle: { fontSize: 11, color: "#68716A", marginBottom: 4 },
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
  chipScroll: { flexDirection: "row", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E3DC",
    backgroundColor: "#FFF",
  },
  chipActive: { backgroundColor: "#215C47", borderColor: "#215C47" },
  chipText: { fontSize: 11, color: "#68716A" },
  chipTextActive: { color: "#FFF", fontWeight: "600" },
  targetCard: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E3DC",
  },
  sectionTitle: { fontSize: 13, fontWeight: "600", color: "#252A26" },
  memberChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  memberChip: {
    borderWidth: 1,
    borderColor: "#E5E3DC",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#F7F6F1",
  },
  memberChipActive: { backgroundColor: "#EBF2E8", borderColor: "#215C47" },
  memberChipText: { fontSize: 11, color: "#68716A" },
  memberChipTextActive: { color: "#215C47", fontWeight: "700" },
  drinkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "transparent",
    marginVertical: 4,
  },
  drinkRowSelected: { borderColor: "#215C47", backgroundColor: "#EBF2E8" },
  drinkName: { fontSize: 13, fontWeight: "700", color: "#252A26" },
  cardDetail: { fontSize: 11, color: "#68716A" },
  chooseBtn: {
    backgroundColor: "#EBF2E8",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#A1B5A4",
  },
  chooseBtnActive: { backgroundColor: "#215C47", borderColor: "#215C47" },
  chooseBtnText: { color: "#215C47", fontSize: 11, fontWeight: "700" },
  chooseBtnTextActive: { color: "#FFF" },
  stickyBar: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 75 : 62,
    left: 0,
    right: 0,
    backgroundColor: "#F8F7F1",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E3DC",
  },
  confirmBtn: {
    backgroundColor: "#215C47",
    padding: 14,
    borderRadius: 20,
    alignItems: "center",
  },
  confirmBtnText: { color: "#FFF", fontWeight: "700", fontSize: 13 },
});
