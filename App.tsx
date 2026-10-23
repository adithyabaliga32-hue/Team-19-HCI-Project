import { useMemo, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";

type Screen =
  | "login"
  | "signup"
  | "home"
  | "menu"
  | "profile"
  | "customize"
  | "orderSummary"
  | "groupSummary";

type DietaryTag =
  | "Vegan"
  | "Gluten-free"
  | "Nut allergy"
  | "Lactose intolerance"
  | "None";

type GroupMember = {
  id: number;
  name: string;
  dietaryTag: DietaryTag;
  restaurant: string;
  drink: string;
  size: string;
  temperature: string;
  milk: string;
  syrup: string;
  whip: string;
  price: number;
  added: boolean;
};

type RecentOrder = {
  id: number;
  items: GroupMember[];
  placedAt: string;
};

type MenuDrink = {
  restaurant: string;
  drink: string;
  price: number;
  temperature: string;
  milk: string;
  syrup: string;
  whip: string;
};

const restaurants = ["Starbucks", "Dunkin'", "Dutch Bros"];

const menuDrinks: MenuDrink[] = [
  { restaurant: "Starbucks", drink: "Caffè Latte", price: 5.45, temperature: "Hot", milk: "2% milk", syrup: "No syrup", whip: "No topping" },
  { restaurant: "Starbucks", drink: "Cold Brew", price: 4.25, temperature: "Iced", milk: "No milk", syrup: "No syrup", whip: "No topping" },
  { restaurant: "Starbucks", drink: "Americano", price: 3.45, temperature: "Hot", milk: "No milk", syrup: "No syrup", whip: "No topping" },
  { restaurant: "Starbucks", drink: "Caramel Macchiato", price: 5.95, temperature: "Hot", milk: "2% milk", syrup: "Vanilla syrup", whip: "No topping" },
  { restaurant: "Starbucks", drink: "Caffè Mocha", price: 5.65, temperature: "Hot", milk: "2% milk", syrup: "No syrup", whip: "Dairy whip" },
  { restaurant: "Starbucks", drink: "Iced Matcha Latte", price: 5.75, temperature: "Iced", milk: "2% milk", syrup: "No syrup", whip: "No topping" },
  { restaurant: "Dunkin'", drink: "Original Blend Iced Coffee", price: 3.49, temperature: "Iced", milk: "No milk", syrup: "No syrup", whip: "No topping" },
  { restaurant: "Dunkin'", drink: "Caramel Craze Latte", price: 5.79, temperature: "Hot", milk: "2% milk", syrup: "Caramel syrup", whip: "Dairy whip" },
  { restaurant: "Dunkin'", drink: "Frozen Coffee", price: 5.49, temperature: "Iced", milk: "2% milk", syrup: "No syrup", whip: "No topping" },
  { restaurant: "Dunkin'", drink: "Strawberry Dragonfruit Refresher", price: 4.99, temperature: "Iced", milk: "No milk", syrup: "No syrup", whip: "No topping" },
  { restaurant: "Dutch Bros", drink: "Golden Eagle", price: 5.95, temperature: "Iced", milk: "2% milk", syrup: "Vanilla syrup", whip: "Dairy whip" },
  { restaurant: "Dutch Bros", drink: "Caramelizer", price: 5.75, temperature: "Iced", milk: "2% milk", syrup: "Caramel syrup", whip: "Dairy whip" },
  { restaurant: "Dutch Bros", drink: "Kicker", price: 5.45, temperature: "Iced", milk: "2% milk", syrup: "No syrup", whip: "No topping" },
  { restaurant: "Dutch Bros", drink: "Annihilator", price: 5.75, temperature: "Iced", milk: "2% milk", syrup: "No syrup", whip: "No topping" },
];

const colors = {
  green: "#215C47",
  greenSoft: "#EBF2E8",
  cream: "#F8F7F1",
  muted: "#7A827B",
  line: "#E5E3DC",
  white: "#FFFFFF",
  warning: "#93602F",
  warningSoft: "#FCF1E4",
  text: "#252A26",
};

const initialMembers: GroupMember[] = [
  {
    id: 0,
    name: "Person A",
    dietaryTag: "Vegan",
    restaurant: "Starbucks",
    drink: "Caffè Latte",
    size: "Grande",
    temperature: "Hot",
    milk: "Oat milk",
    syrup: "No syrup",
    whip: "Dairy whip",
    price: 5.45,
    added: false,
  },
  {
    id: 1,
    name: "Person B",
    dietaryTag: "Nut allergy",
    restaurant: "Starbucks",
    drink: "Cold Brew",
    size: "Grande",
    temperature: "Iced",
    milk: "No milk",
    syrup: "Vanilla syrup",
    whip: "No topping",
    price: 4.25,
    added: false,
  },
  {
    id: 2,
    name: "Person C",
    dietaryTag: "None",
    restaurant: "Starbucks",
    drink: "Americano",
    size: "Grande",
    temperature: "Hot",
    milk: "No milk",
    syrup: "No syrup",
    whip: "No topping",
    price: 3.45,
    added: false,
  },
];

const savedFavorite: GroupMember = {
  id: -1,
  name: "Your usual",
  dietaryTag: "Vegan",
  restaurant: "Starbucks",
  drink: "Oat Latte",
  size: "Grande",
  temperature: "Hot",
  milk: "Oat milk",
  syrup: "No syrup",
  whip: "Vegan whip",
  price: 5.45,
  added: false,
};

const tagOptions: DietaryTag[] = [
  "Vegan",
  "Gluten-free",
  "Nut allergy",
  "Lactose intolerance",
  "None",
];
const groupTagOptions: DietaryTag[] = tagOptions.filter(
  (tag) => tag !== "Lactose intolerance",
);

const money = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

function PrimaryButton({
  title,
  onPress,
  secondary = false,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        secondary && styles.secondaryButton,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.primaryButtonText, secondary && styles.secondaryButtonText]}>
        {title}
      </Text>
    </Pressable>
  );
}

function Badge({ tag }: { tag: DietaryTag }) {
  const warning = tag === "Nut allergy";
  return (
    <View style={[styles.badge, warning ? styles.warningBadge : styles.greenBadge]}>
      <Text style={[styles.badgeText, warning && styles.warningText]}>{tag}</Text>
    </View>
  );
}

function DrinkArtwork({ drink, size }: { drink: string; size: number }) {
  const photoByDrink: Record<string, number> = {
    "Caramel Macchiato": require("./assets/drinks/starbucks-caramel-macchiato.png"),
    "Caffè Mocha": require("./assets/drinks/starbucks-caffe-mocha.png"),
    "Iced Matcha Latte": require("./assets/drinks/starbucks-iced-matcha-latte.png"),
    "Golden Eagle": require("./assets/drinks/dutch-bros-golden-eagle.png"),
    "Caramelizer": require("./assets/drinks/dutch-bros-caramelizer.png"),
    "Kicker": require("./assets/drinks/dutch-bros-kicker.png"),
    "Annihilator": require("./assets/drinks/dutch-bros-annihilator.png"),
    "Strawberry Dragonfruit Refresher": require("./assets/drinks/dunkin-strawberry-dragonfruit-refresher.png"),
    "Frozen Coffee": require("./assets/drinks/dunkin-frozen-coffee.png"),
    "Caramel Craze Latte": require("./assets/drinks/dunkin-caramel-craze-latte.png"),
    "Original Blend Iced Coffee": require("./assets/drinks/dunkin-original-blend-iced-coffee.png"),
  };
  const photo = photoByDrink[drink];

  if (photo) {
    return (
      <Image
        accessibilityLabel={`${drink} photo supplied by the user`}
        source={photo}
        resizeMode="contain"
        style={{ width: size, height: size, borderRadius: size * 0.2 }}
      />
    );
  }

  const illustrationColor = drink.includes("Caramel Macchiato")
    ? "#C98C50"
    : drink.includes("Mocha")
      ? "#58382B"
      : drink.includes("Matcha")
        ? "#91A85C"
        : drink.includes("Strawberry Dragonfruit")
          ? "#D84B74"
          : drink.includes("Iced Coffee")
            ? "#68412D"
            : drink.includes("Caramel Craze")
              ? "#B87945"
            : drink.includes("Golden Eagle")
              ? "#C9944E"
              : drink.includes("Caramelizer")
                ? "#A86536"
                : drink.includes("Kicker")
                  ? "#704B37"
                  : drink.includes("Annihilator")
                    ? "#8B684B"
                    : null;

  if (illustrationColor) {
    return (
      <Svg
        accessibilityLabel={`${drink} original illustration`}
        width={size}
        height={size}
        viewBox="0 0 100 100"
      >
        <Path
          d="M22 29h56l-6 59q-22 9-44 0z"
          fill={illustrationColor}
          stroke="#E8E0D1"
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <Path
          d="M22 31q28-13 56 0v9q-28 12-56 0z"
          fill={drink.includes("Matcha") ? "#B8C98D" : "#F4E6D1"}
          opacity={drink.includes("Mocha") ? 0.75 : 0.95}
        />
        <Path
          d="M20 29q30-14 60 0l-2 7q-28 11-56 0z"
          fill="#FFFDF8"
          stroke="#E8E0D1"
          strokeWidth={2}
        />
        <Path
          d="M66 28 72 9"
          fill="none"
          stroke="#6C4935"
          strokeWidth={4}
          strokeLinecap="round"
        />
        {drink.includes("Caramel") && (
          <Path
            d="M31 44q18 8 0 16t2 16m27-34q-16 9 1 17t-1 17"
            fill="none"
            stroke="#F0C27E"
            strokeWidth={3}
            strokeLinecap="round"
            opacity={0.9}
          />
        )}
        {drink.includes("Strawberry Dragonfruit") && (
          <Path
            d="m38 54 5-5 5 5-5 5zm21 17 4-4 4 4-4 4z"
            fill="#FFD2DD"
          />
        )}
      </Svg>
    );
  }

  const source = drink.includes("Cold Brew")
    ? require("./assets/drinks/cold-brew.png")
    : drink.includes("Americano")
      ? require("./assets/drinks/americano.png")
      : require("./assets/drinks/latte.png");

  return (
    <Image
      accessibilityLabel={`${drink} illustration`}
      source={source}
      resizeMode="cover"
      style={{ width: size, height: size, borderRadius: size * 0.2 }}
    />
  );
}

function BrandIcon() {
  return (
    <Svg
      accessibilityLabel="ServeFlow coffee cup logo"
      width={38}
      height={38}
      viewBox="0 0 40 40"
    >
      <Path
        d="M11 17h17v9a7 7 0 0 1-7 7h-3a7 7 0 0 1-7-7zM28 20h2.5a3.5 3.5 0 0 1 0 7H28M15 9v4m6-6v6m6-4v2"
        fill="none"
        stroke={colors.white}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 36h14"
        fill="none"
        stroke={colors.white}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function TabIcon({ name, color }: { name: string; color: string }) {
  const common = {
    fill: "none" as const,
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" accessibilityRole="image">
      {name === "Home" && (
        <>
          <Path d="m4.5 10 7.5-6 7.5 6v9.5a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z" {...common} />
          <Path d="M9.5 20.5v-7h5v7" {...common} />
        </>
      )}
      {name === "Menu" && (
        <>
          <Path d="M5 9h12v7a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5z" {...common} />
          <Path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17M8 3v3M12 2v4M16 3v3" {...common} />
        </>
      )}
      {name === "Orders" && (
        <>
          <Path d="M6 3.5h12v17l-2.2-1.5-1.8 1.5-2-1.5-2 1.5-1.8-1.5L6 20.5z" {...common} />
          <Path d="M9 8h6M9 16h6" {...common} />
          <Path d="M13.5 10.5c-.4-.6-1-.9-1.8-.9a1.5 1.5 0 0 0 0 3h.6a1.5 1.5 0 0 1 0 3c-.8 0-1.5-.4-1.9-1M12 8.7v.8m0 6.1v.8" {...common} />
        </>
      )}
      {name === "Profile" && (
        <>
          <Circle cx={12} cy={7.5} r={3.5} {...common} />
          <Path d="M4.5 21v-1.5a7.5 7.5 0 0 1 15 0V21" {...common} />
        </>
      )}
    </Svg>
  );
}

function ChoiceSection({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}) {
  return (
    <View style={styles.choiceCard}>
      <Text style={styles.fieldLabel}>{title}</Text>
      <View style={styles.choiceRow}>
        {options.map((option) => {
          const active = option === selected;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              key={option}
              onPress={() => onSelect(option)}
              style={[styles.choice, active && styles.choiceSelected]}
            >
              <Text style={[styles.choiceText, active && styles.choiceTextSelected]}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function SummaryRow({ title, value }: { title: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.mutedText}>{title}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

export default function App() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const modalWidthStyle =
    Platform.OS === "web"
      ? {
          width: Math.max(
            1,
            Math.min(390, windowWidth - 40, (windowHeight * 430 * 0.9) / 932),
          ),
          alignSelf: "center" as const,
        }
      : undefined;
  const [screen, setScreen] = useState<Screen>("login");
  const [activeTab, setActiveTab] = useState("Home");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRestaurant, setSelectedRestaurant] = useState("Starbucks");
  const [members, setMembers] = useState(initialMembers);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [quickOrderMember, setQuickOrderMember] = useState<GroupMember | null>(null);
  const [profileTags, setProfileTags] = useState<DietaryTag[]>([
    "Vegan",
    "Nut allergy",
  ]);
  const [draftTags, setDraftTags] = useState<DietaryTag[]>([
    "Vegan",
    "Nut allergy",
    "None",
  ]);
  const [editingNameId, setEditingNameId] = useState<number | null>(null);
  const [nameDraft, setNameDraft] = useState("");
  const [showDietary, setShowDietary] = useState(false);
  const [showConflict, setShowConflict] = useState(false);
  const [showNutWarning, setShowNutWarning] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [editingMember, setEditingMember] = useState(0);
  const [groupFlow, setGroupFlow] = useState(false);
  const [selectedSize, setSelectedSize] = useState("Grande");
  const [selectedTemperature, setSelectedTemperature] = useState("Hot");
  const [selectedMilk, setSelectedMilk] = useState("Oat milk");
  const [selectedSyrup, setSelectedSyrup] = useState("No syrup");
  const [selectedWhip, setSelectedWhip] = useState("Dairy whip");

  const currentMember = quickOrderMember ?? members[editingMember];
  const orderedMembers = useMemo(
    () => members.filter((member) => member.added),
    [members],
  );
  const subtotal = orderedMembers.reduce((total, member) => total + member.price, 0);

  function updateMember(index: number, updates: Partial<GroupMember>) {
    setMembers((current) =>
      current.map((member, memberIndex) =>
        memberIndex === index ? { ...member, ...updates } : member,
      ),
    );
  }

  function addMember() {
    const id = members.reduce((maxId, member) => Math.max(maxId, member.id), -1) + 1;
    let nameIndex = members.length;
    let name = `Person ${String.fromCharCode(65 + nameIndex)}`;
    while (members.some((member) => member.name === name)) {
      nameIndex += 1;
      name =
        nameIndex < 26
          ? `Person ${String.fromCharCode(65 + nameIndex)}`
          : `Person ${nameIndex + 1}`;
    }
    setMembers((current) => [
      ...current,
      {
        id,
        name,
        dietaryTag: "None",
        restaurant: selectedRestaurant,
        drink: "Americano",
        size: "Grande",
        temperature: "Hot",
        milk: "No milk",
        syrup: "No syrup",
        whip: "No topping",
        price: 3.45,
        added: false,
      },
    ]);
    setDraftTags((current) => [...current, "None"]);
  }

  function removeMember(index: number) {
    if (members.length <= 1) return;
    const removedId = members[index]?.id;
    setMembers((current) => current.filter((_, memberIndex) => memberIndex !== index));
    setDraftTags((current) => current.filter((_, memberIndex) => memberIndex !== index));
    if (removedId === editingNameId) {
      setEditingNameId(null);
      setNameDraft("");
    }
    setEditingMember((current) => (current > index ? current - 1 : current));
  }

  function saveMemberName(index: number) {
    const name = nameDraft.trim();
    if (!name) return;
    updateMember(index, { name });
    setEditingNameId(null);
    setNameDraft("");
  }

  function beginCustomization(index: number, inGroupFlow: boolean) {
    const member = members[index];
    if (!member) return;
    setQuickOrderMember(null);
    setEditingMember(index);
    setGroupFlow(inGroupFlow);
    setSelectedSize(member.size);
    setSelectedTemperature(member.temperature);
    setSelectedMilk(member.milk);
    setSelectedSyrup(member.syrup);
    setSelectedWhip(member.whip);
    setScreen("customize");
  }

  function chooseDrink(memberIndex: number, item: MenuDrink) {
    const member = members[memberIndex];
    if (!member) return;

    const updatedMember: GroupMember = {
      ...member,
      restaurant: item.restaurant,
      drink: item.drink,
      price: item.price,
      temperature: item.temperature,
      milk: item.milk,
      syrup: item.syrup,
      whip: item.whip,
      added: false,
    };
    setMembers((current) =>
      current.map((currentMember, index) =>
        index === memberIndex ? updatedMember : currentMember,
      ),
    );
    setSelectedRestaurant(item.restaurant);
    setQuickOrderMember(null);
    setEditingMember(memberIndex);
    setGroupFlow(false);
    setSelectedSize(updatedMember.size);
    setSelectedTemperature(item.temperature);
    setSelectedMilk(item.milk);
    setSelectedSyrup(item.syrup);
    setSelectedWhip(item.whip);
    setScreen("customize");
  }

  function selectRestaurant(restaurant: string) {
    setSelectedRestaurant(restaurant);
    setSearchQuery("");
    setScreen("home");
    setActiveTab("Home");
  }

  function quickOrder() {
    const member = savedFavorite;
    setQuickOrderMember(member);
    setGroupFlow(false);
    setSelectedSize(member.size);
    setSelectedTemperature(member.temperature);
    setSelectedMilk(member.milk);
    setSelectedSyrup(member.syrup);
    setSelectedWhip(member.whip);

    if (profileTags.includes("Vegan") && member.whip !== "Vegan whip") {
      setShowConflict(true);
    } else {
      setScreen("orderSummary");
    }
  }

  function addCurrentDrink() {
    if (!currentMember) return;

    updateMember(editingMember, {
      size: selectedSize,
      temperature: selectedTemperature,
      milk: selectedMilk,
      syrup: selectedSyrup,
      whip: selectedWhip,
      added: true,
    });

    if (currentMember.dietaryTag === "Vegan" && selectedWhip !== "Vegan whip") {
      setShowConflict(true);
    } else {
      setScreen("orderSummary");
    }
  }

  function continueAfterSummary() {
    if (groupFlow) {
      const nextMember = members.findIndex((member) => !member.added);
      if (nextMember >= 0) {
        beginCustomization(nextMember, true);
      } else {
        setScreen("groupSummary");
        setActiveTab("Orders");
      }
      return;
    }
    submitOrder();
  }

  function submitOrder() {
    const placedItems = quickOrderMember ? [quickOrderMember] : orderedMembers;
    if (placedItems.length > 0) {
      setRecentOrders((current) =>
        [
          {
            id: Date.now(),
            items: placedItems.map((item) => ({ ...item, added: true })),
            placedAt: new Date().toLocaleString(),
          },
          ...current,
        ].slice(0, 5),
      );
    }
    setMembers((current) =>
      current.map((member) => ({ ...member, added: false })),
    );
    setQuickOrderMember(null);
    setGroupFlow(false);
    setScreen("home");
    setActiveTab("Home");
    setShowConfirmation(true);
  }

  function reorderRecentOrder(order: RecentOrder) {
    setMembers(order.items.map((item) => ({ ...item, added: true })));
    setDraftTags(order.items.map((item) => item.dietaryTag));
    setSelectedRestaurant(order.items[0]?.restaurant ?? selectedRestaurant);
    setQuickOrderMember(null);
    setGroupFlow(true);
    setActiveTab("Orders");
    setScreen("groupSummary");
  }

  function logOut() {
    setScreen("login");
    setActiveTab("Home");
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setLoginError("");
    setQuickOrderMember(null);
    setGroupFlow(false);
    setShowDietary(false);
    setShowConflict(false);
    setShowNutWarning(false);
    setShowConfirmation(false);
  }

  function selectSyrup(syrup: string) {
    if (syrup === "Hazelnut syrup" && currentMember?.dietaryTag === "Nut allergy") {
      setShowNutWarning(true);
      return;
    }
    setSelectedSyrup(syrup);
  }

  function openTab(tab: string) {
    setActiveTab(tab);
    setGroupFlow(false);
    if (tab === "Home") {
      setScreen("home");
    } else if (tab === "Menu") {
      setScreen("menu");
    } else if (tab === "Orders") {
      setScreen("groupSummary");
    } else {
      setDraftTags(members.map((member) => member.dietaryTag));
      setScreen("profile");
    }
  }

  function renderSearchBar() {
    return (
      <View style={styles.searchBar}>
        <Svg width={20} height={20} viewBox="0 0 24 24" accessibilityRole="image">
          <Circle
            cx={10.8}
            cy={10.8}
            r={6.3}
            fill="none"
            stroke={colors.muted}
            strokeWidth={1.8}
          />
          <Path
            d="m15.5 15.5 4 4"
            fill="none"
            stroke={colors.muted}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </Svg>
        <TextInput
          accessibilityLabel="Search restaurants or drinks"
          autoCapitalize="none"
          onChangeText={setSearchQuery}
          onSubmitEditing={() => {
            if ("starbucks".includes(searchQuery.trim().toLowerCase())) {
              setSearchQuery("");
            }
            openTab("Menu");
          }}
          placeholder="Search restaurants or drinks"
          placeholderTextColor={colors.muted}
          returnKeyType="search"
          style={styles.searchInput}
          value={searchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable
            accessibilityLabel="Clear search"
            accessibilityRole="button"
            onPress={() => setSearchQuery("")}
            style={styles.searchClear}
          >
            <Text style={styles.searchClearText}>×</Text>
          </Pressable>
        )}
      </View>
    );
  }

  function renderHomeSearchResults() {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return null;

    const matchingRestaurants = restaurants.filter((restaurant) =>
      restaurant.toLowerCase().includes(query),
    );
    const matchingDrinks = menuDrinks.filter(
      (item) =>
        item.drink.toLowerCase().includes(query) ||
        item.restaurant.toLowerCase().includes(query),
    );
    const matchingMembers = members
      .map((member, index) => ({ member, index }))
      .filter(({ member }) => member.drink.toLowerCase().includes(query));

    return (
      <View style={styles.searchResults}>
        <Text style={styles.fieldLabel}>Search results</Text>
        {matchingRestaurants.map((restaurant) => (
          <Pressable
            accessibilityRole="button"
            key={restaurant}
            onPress={() => selectRestaurant(restaurant)}
            style={styles.searchResult}
          >
            <View style={styles.searchResultCopy}>
              <Text style={styles.memberName}>{restaurant}</Text>
              <Text style={styles.cardDetail}>UTD Student Union · Restaurant</Text>
            </View>
            <Text style={styles.chooseText}>View menu  ›</Text>
          </Pressable>
        ))}
        {matchingDrinks.map((item) => {
          const memberIndex = members.findIndex((member) => !member.added);
          const targetIndex = memberIndex < 0 ? 0 : memberIndex;
          return (
            <Pressable
              accessibilityRole="button"
              key={`${item.restaurant}-${item.drink}`}
              onPress={() => chooseDrink(targetIndex, item)}
              style={styles.searchResult}
            >
              <View style={styles.searchResultCopy}>
                <Text style={styles.memberName}>{item.drink}</Text>
                <Text style={styles.cardDetail}>
                  {item.restaurant} · From {money(item.price)}
                </Text>
              </View>
              <Text style={styles.chooseText}>Customize  ›</Text>
            </Pressable>
          );
        })}
        {matchingMembers.map(({ member, index }) => (
          <Pressable
            accessibilityRole="button"
            key={member.id}
            onPress={() => beginCustomization(index, false)}
            style={styles.searchResult}
          >
            <View style={styles.searchResultCopy}>
              <Text style={styles.memberName}>{member.drink}</Text>
              <Text style={styles.cardDetail}>From {money(member.price)}</Text>
            </View>
            <Text style={styles.chooseText}>Customize  ›</Text>
          </Pressable>
        ))}
        {matchingRestaurants.length === 0 &&
          matchingDrinks.length === 0 &&
          matchingMembers.length === 0 && (
          <Text style={styles.cardDetail}>No restaurants or drinks found.</Text>
        )}
      </View>
    );
  }

  function header(title: string, subtitle: string) {
    return (
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Back to home"
          accessibilityRole="button"
          onPress={() => {
            setScreen("home");
            setActiveTab("Home");
          }}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </Pressable>
        <View style={styles.headerCopy}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        </View>
      </View>
    );
  }

  function pickupCard() {
    return (
      <View style={styles.card}>
        <Text style={styles.cardHeading}>⌖  {selectedRestaurant} UTD</Text>
        <Text style={styles.cardDetail}>Student Union · Pickup counter</Text>
        <Text style={styles.readyText}>Ready in 10 min</Text>
        <View style={styles.divider} />
        <Text style={styles.cardHeading}>▱  Visa ending 1234</Text>
        <Text style={styles.cardDetail}>Payment method</Text>
      </View>
    );
  }

  function priceCard(items: GroupMember[]) {
    const total = items.reduce((sum, item) => sum + item.price, 0);
    return (
      <View style={styles.card}>
        <SummaryRow title={`Subtotal · ${items.length} drinks`} value={money(total)} />
        <SummaryRow title="Estimated tax" value={money(total * 0.0825)} />
        <View style={styles.divider} />
        <SummaryRow title="Total" value={money(total * 1.0825)} />
      </View>
    );
  }

  function renderHome() {
    const favorite = savedFavorite;

    return (
      <>
        {header("ServeFlow", "UTD Student Union")}
        {renderSearchBar()}
        {renderHomeSearchResults()}
        <ChoiceSection
          title="Choose a restaurant"
          options={restaurants}
          selected={selectedRestaurant}
          onSelect={selectRestaurant}
        />
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Your usual</Text>
        </View>
        <View style={styles.memberCard}>
          <View style={styles.memberDetails}>
            <DrinkArtwork drink={favorite.drink} size={72} />
            <View style={styles.memberCopy}>
              <Text style={styles.memberName}>{favorite.drink}</Text>
              <Text style={styles.cardDetail}>
                {favorite.restaurant} · {favorite.milk} · {favorite.whip} · {favorite.size} ·{" "}
                {favorite.temperature}
              </Text>
              <Text style={styles.priceText}>{money(favorite.price)}</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            {profileTags
              .filter((tag) => tag !== "None")
              .map((tag) => <Badge key={tag} tag={tag} />)}
          </View>
          <PrimaryButton
            title="Quick order"
            onPress={quickOrder}
          />
        </View>
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Explore the menu</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => openTab("Menu")}
          >
            <Text style={styles.chooseText}>See drinks  ›</Text>
          </Pressable>
        </View>
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Group order</Text>
          <Text style={styles.sectionCount}>
            {members.length} {members.length === 1 ? "person" : "people"} ·{" "}
            {orderedMembers.length} drinks
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
          accessibilityRole="button"
          onPress={() => {
            setDraftTags(members.map((member) => member.dietaryTag));
            setShowDietary(true);
          }}
          style={styles.tagSettings}
        >
          <Text style={styles.tagIcon}>◆</Text>
          <View style={styles.tagCopy}>
            <Text style={styles.crewTitle}>Set dietary tags</Text>
            <Text style={styles.cardDetail}>Vegan · Nut allergy · No restrictions</Text>
          </View>
          <Text style={styles.mutedText}>›</Text>
        </Pressable>
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Group members</Text>
          <Pressable
            accessibilityRole="button"
            onPress={addMember}
            style={styles.addMemberButton}
          >
            <Text style={styles.addMemberButtonText}>＋ Add person</Text>
          </Pressable>
          <Text style={styles.sectionCount}>
            {members.length} {members.length === 1 ? "person" : "people"} ·{" "}
            {orderedMembers.length} drinks
          </Text>
        </View>
        {members.map((member, index) => (
          <View key={member.id} style={styles.memberCard}>
            <View style={styles.memberDetails}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>♙</Text>
              </View>
              <View style={styles.memberCopy}>
                <View style={styles.memberNameRow}>
                  {editingNameId === member.id ? (
                    <TextInput
                      accessibilityLabel={`Name for group member ${index + 1}`}
                      autoFocus
                      maxLength={32}
                      onChangeText={setNameDraft}
                      onSubmitEditing={() => saveMemberName(index)}
                      placeholder="Enter a name"
                      returnKeyType="done"
                      style={styles.memberNameInput}
                      value={nameDraft}
                    />
                  ) : (
                    <Text style={styles.memberName}>{member.name}</Text>
                  )}
                  <Badge tag={member.dietaryTag} />
                </View>
                <Text numberOfLines={2} style={styles.cardDetail}>
                  {member.restaurant} · {member.drink} · {member.size} · {member.milk}
                </Text>
              </View>
            </View>
            <View style={styles.memberActions}>
              {editingNameId === member.id ? (
                <>
                  <Pressable
                    accessibilityRole="button"
                    disabled={!nameDraft.trim()}
                    onPress={() => saveMemberName(index)}
                    style={styles.memberActionButton}
                  >
                    <Text style={styles.memberActionText}>Save name</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      setEditingNameId(null);
                      setNameDraft("");
                    }}
                    style={styles.memberActionButton}
                  >
                    <Text style={styles.memberActionText}>Cancel</Text>
                  </Pressable>
                </>
              ) : (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setNameDraft(member.name);
                    setEditingNameId(member.id);
                  }}
                  style={styles.memberActionButton}
                >
                  <Text style={styles.memberActionText}>Edit name</Text>
                </Pressable>
              )}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remove ${member.name} from group`}
                disabled={members.length <= 1}
                onPress={() => removeMember(index)}
                style={styles.memberActionButton}
              >
                <Text
                  style={[
                    styles.removeMemberText,
                    members.length <= 1 && styles.disabledActionText,
                  ]}
                >
                  Remove
                </Text>
              </Pressable>
            </View>
            <PrimaryButton
              title="Customize drink"
              secondary
              onPress={() => beginCustomization(index, false)}
            />
          </View>
        ))}
        <Text style={styles.finePrint}>
          Dietary labels are guidance, not a guarantee of allergen safety. Confirm
          ingredients and cross-contact risks with a barista.
        </Text>
      </>
    );
  }

  function renderMenu() {
    const query = searchQuery.trim().toLowerCase();
    const visibleDrinks = menuDrinks.filter(
      (item) =>
        item.restaurant === selectedRestaurant &&
        (!query ||
          selectedRestaurant.toLowerCase().includes(query) ||
          item.drink.toLowerCase().includes(query)),
    );

    return (
      <>
        {header("Menu", `${selectedRestaurant} · Select a drink for your group`)}
        {renderSearchBar()}
        <Text style={styles.cardDetail}>
          Sample menu items and prices are for demonstration.
        </Text>
        {visibleDrinks.map((item) => {
            const memberIndex = members.findIndex((member) => !member.added);
            const targetIndex = memberIndex < 0 ? 0 : memberIndex;
            return (
              <Pressable
                accessibilityRole="button"
                key={`${item.restaurant}-${item.drink}`}
                onPress={() => chooseDrink(targetIndex, item)}
                style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
              >
                <DrinkArtwork drink={item.drink} size={58} />
                <View style={styles.menuCopy}>
                  <Text style={styles.memberName}>{item.drink}</Text>
                  <Text style={styles.cardDetail}>
                    From {money(item.price)} · {item.temperature}
                  </Text>
                </View>
                <Text style={styles.chooseText}>Choose</Text>
              </Pressable>
            );
          })}
        {visibleDrinks.length === 0 && (
          <Text style={styles.cardDetail}>No drinks match your search.</Text>
        )}
      </>
    );
  }

  function renderProfile() {
    return (
      <>
        {header("Dietary profile", "Manage your dietary preferences")}
        <View style={styles.profileHero}>
          <View style={styles.profileInitials}>
            <Text style={styles.profileInitialsText}>YO</Text>
          </View>
          <View>
            <Text style={styles.crewTitle}>Your preferences</Text>
            <Text style={styles.cardDetail}>Used for individual & group orders</Text>
          </View>
        </View>
        <View style={styles.profileCallout}>
          <Text style={styles.calloutTitle}>✓  We’ll flag choices that may conflict.</Text>
          <Text style={styles.cardDetail}>Your profile helps you choose.</Text>
        </View>
        <Text style={styles.sectionTitle}>Dietary restrictions</Text>
        {tagOptions
          .filter((tag) => tag !== "Gluten-free")
          .map((tag) => {
            const selected = profileTags.includes(tag);
            return (
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
                key={tag}
                onPress={() =>
                  setProfileTags((current) =>
                    selected
                      ? current.filter((item) => item !== tag)
                      : [...current, tag],
                  )
                }
                style={[styles.restriction, selected && styles.restrictionSelected]}
              >
                <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                  {selected && <Text style={styles.checkboxTick}>✓</Text>}
                </View>
                <Text style={styles.bodyText}>{tag}</Text>
              </Pressable>
            );
          })}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>♧  Vegan — whipped cream choice</Text>
          <Text style={styles.cardDetail}>
            If you choose oat milk while dairy whipped cream is selected, we’ll ask
            whether you’d like to switch to vegan whip.
          </Text>
          <View style={styles.divider} />
          <Text style={styles.tipsTitle}>ⓘ  Nut allergy — hazelnut alert</Text>
          <Text style={styles.cardDetail}>
            If someone with a nut allergy selects hazelnut syrup, we’ll show a
            warning and offer vanilla syrup instead.
          </Text>
        </View>
        <View style={styles.logoutSection}>
          <PrimaryButton title="Log out" secondary onPress={logOut} />
        </View>
      </>
    );
  }

  function renderCustomize() {
    if (!currentMember) return null;
    return (
      <>
        {header("Customize", `${currentMember.restaurant} · UTD Student Union`)}
        <View style={styles.drinkCard}>
          <DrinkArtwork drink={currentMember.drink} size={76} />
          <View style={styles.drinkCopy}>
            <Text style={styles.cardHeading}>{currentMember.drink}</Text>
            <Text style={styles.priceText}>{money(currentMember.price)}</Text>
            <Text style={styles.cardDetail}>
              {currentMember.size} · {currentMember.temperature} · {currentMember.milk}
            </Text>
          </View>
        </View>
        <ChoiceSection
          title="Size"
          options={["Tall", "Grande", "Venti"]}
          selected={selectedSize}
          onSelect={setSelectedSize}
        />
        <ChoiceSection
          title="Temperature"
          options={["Hot", "Iced"]}
          selected={selectedTemperature}
          onSelect={setSelectedTemperature}
        />
        <ChoiceSection
          title="Milk"
          options={["Oat milk", "2% milk", "Almond milk", "No milk"]}
          selected={selectedMilk}
          onSelect={setSelectedMilk}
        />
        <ChoiceSection
          title="Syrup"
          options={["No syrup", "Vanilla syrup", "Caramel syrup", "Hazelnut syrup"]}
          selected={selectedSyrup}
          onSelect={selectSyrup}
        />
        <ChoiceSection
          title="Topping"
          options={["Dairy whip", "Vegan whip", "No topping"]}
          selected={selectedWhip}
          onSelect={setSelectedWhip}
        />
        {currentMember.dietaryTag === "Vegan" && (
          <Text style={styles.finePrint}>
            Vegan preference: choose plant-based milk and vegan whip. Confirm
            ingredients with the barista.
          </Text>
        )}
      </>
    );
  }

  function renderIndividualSummary() {
    if (!currentMember) return null;
    return (
      <>
        {header("Order summary", `${currentMember.drink} · Ready to review`)}
        <View style={styles.card}>
          <View style={styles.summaryRow}>
            <Text style={styles.cardHeading}>☕  {currentMember.drink}</Text>
            <Text style={styles.cardHeading}>{money(currentMember.price)}</Text>
          </View>
          <View style={styles.summaryMemberHeader}>
            {quickOrderMember
              ? profileTags
                  .filter((tag) => tag !== "None")
                  .map((tag) => <Badge key={tag} tag={tag} />)
              : <Badge tag={currentMember.dietaryTag} />}
          </View>
          <View style={styles.divider} />
          <SummaryRow title="Size" value={`${currentMember.size} · 16 fl oz`} />
          <SummaryRow title="Temperature" value={currentMember.temperature} />
          <SummaryRow title="Milk" value={currentMember.milk} />
          {currentMember.syrup !== "No syrup" && (
            <SummaryRow title="Syrup" value={currentMember.syrup} />
          )}
          <SummaryRow title="Topping" value={currentMember.whip} />
        </View>
        {pickupCard()}
        {priceCard([currentMember])}
      </>
    );
  }

  function renderGroupSummary() {
    return (
      <>
        {header(
          "Group summary",
          `${members.length} members · ${orderedMembers.length} drinks · One pickup`,
        )}
        <View style={styles.card}>
          {orderedMembers.length === 0 ? (
            <Text style={styles.cardDetail}>Your group order is empty.</Text>
          ) : (
            orderedMembers.map((member, index) => (
              <View key={member.id}>
                {index > 0 && <View style={styles.divider} />}
                <View style={styles.summaryMemberHeader}>
                  <Text style={styles.cardHeading}>♙  {member.name}</Text>
                  <Badge tag={member.dietaryTag} />
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.bodyText}>1 × {member.drink}</Text>
                  <Text style={styles.bodyText}>{money(member.price)}</Text>
                </View>
                <Text style={styles.cardDetail}>
                  {member.restaurant} · {member.size} · {member.temperature} · {member.milk}
                  {member.syrup !== "No syrup" ? ` · ${member.syrup}` : ""} ·{" "}
                  {member.whip}
                </Text>
              </View>
            ))
          )}
        </View>
        <Text style={styles.finePrint}>
          Dietary labels are not a guarantee of allergen safety. Shared equipment
          may cause cross-contact. Confirm ingredients and preparation with a
          barista.
        </Text>
        {pickupCard()}
        {priceCard(orderedMembers)}
        <View style={styles.recentOrdersSection}>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>Recent orders</Text>
            <Text style={styles.sectionCount}>
              {recentOrders.length} {recentOrders.length === 1 ? "order" : "orders"}
            </Text>
          </View>
          {recentOrders.length === 0 ? (
            <View style={styles.card}>
              <Text style={styles.cardDetail}>
                Completed orders will appear here so you can reorder them.
              </Text>
            </View>
          ) : (
            recentOrders.map((order) => {
              const total = order.items.reduce(
                (sum, item) => sum + item.price,
                0,
              );
              return (
                <View key={order.id} style={styles.recentOrderCard}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.cardHeading}>
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "drink" : "drinks"}
                    </Text>
                    <Text style={styles.cardHeading}>{money(total)}</Text>
                  </View>
                  <Text style={styles.cardDetail}>{order.placedAt}</Text>
                  <Text style={styles.cardDetail} numberOfLines={2}>
                    {order.items
                      .map((item) => `${item.name}: ${item.drink} (${item.restaurant})`)
                      .join(" · ")}
                  </Text>
                  <PrimaryButton
                    title="Reorder"
                    secondary
                    onPress={() => reorderRecentOrder(order)}
                  />
                </View>
              );
            })
          )}
        </View>
      </>
    );
  }

  function pageContent() {
    switch (screen) {
      case "home":
        return renderHome();
      case "menu":
        return renderMenu();
      case "profile":
        return renderProfile();
      case "customize":
        return renderCustomize();
      case "orderSummary":
        return renderIndividualSummary();
      case "groupSummary":
        return renderGroupSummary();
      default:
        return null;
    }
  }

  function bottomActions() {
    if (screen === "home") {
      const nextMember = members.findIndex((member) => !member.added);
      return (
        <PrimaryButton
          title={
            nextMember < 0
              ? "Review group order"
              : `Start with ${members[nextMember].name}  ›`
          }
          onPress={() => {
            if (nextMember < 0) {
              setScreen("groupSummary");
              setActiveTab("Orders");
            } else {
              beginCustomization(nextMember, true);
            }
          }}
        />
      );
    }
    if (screen === "customize" && currentMember) {
      return (
        <PrimaryButton
          title={`Add to cart · ${money(currentMember.price)}`}
          onPress={addCurrentDrink}
        />
      );
    }
    if (screen === "orderSummary" && currentMember) {
      const nextMember = groupFlow ? members.findIndex((member) => !member.added) : -1;
      const title =
        nextMember >= 0
          ? `Continue with ${members[nextMember].name}`
          : groupFlow
            ? "Review group order"
            : `Pay & submit · ${money(currentMember.price * 1.0825)}`;
      return (
        <>
          <PrimaryButton title={title} onPress={continueAfterSummary} />
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setScreen("home");
              setActiveTab("Home");
            }}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </>
      );
    }
    if (screen === "groupSummary") {
      return (
        <>
          {orderedMembers.length > 0 && (
            <PrimaryButton
              title={`Pay & submit group · ${money(subtotal * 1.0825)}`}
              onPress={submitOrder}
            />
          )}
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setScreen("home");
              setActiveTab("Home");
            }}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
        </>
      );
    }
    if (screen === "profile") {
      return (
        <PrimaryButton
          title="Save preferences"
          onPress={() => {
            setActiveTab("Home");
            setScreen("home");
          }}
        />
      );
    }
    return null;
  }

  function renderTabs() {
    const tabs = ["Home", "Menu", "Orders", "Profile"];
    return (
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const active = activeTab === tab;
          return (
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              key={tab}
              onPress={() => openTab(tab)}
              style={styles.tab}
            >
              <TabIcon name={tab} color={active ? colors.green : colors.muted} />
              <Text style={[styles.tabLabel, active && styles.tabActive]}>{tab}</Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  function renderDietaryModal() {
    return (
      <Modal
        animationType="slide"
        onRequestClose={() => setShowDietary(false)}
        transparent
        visible={showDietary}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.dietarySheet, modalWidthStyle]}>
            <Text style={styles.dialogTitle}>Set dietary tags</Text>
            <Text style={styles.cardDetail}>Checks apply to each person’s drink.</Text>
            {members.map((member, index) => (
              <View key={member.id}>
                <View style={styles.dietaryPersonHeading}>
                  <View style={styles.dietaryAvatar}>
                    <Text style={styles.dietaryAvatarText}>
                      {member.name.match(/^Person ([A-Z])$/)?.[1] ??
                        member.name.trim().charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <View style={styles.dietarySelectedBadge}>
                    <Text style={styles.dietarySelectedBadgeText}>
                      ✓ {draftTags[index]}
                    </Text>
                  </View>
                </View>
                <View style={styles.dietaryOptions}>
                  {groupTagOptions.map((tag) => {
                    const active = draftTags[index] === tag;
                    return (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                        key={tag}
                        onPress={() =>
                          setDraftTags((current) =>
                            current.map((item, itemIndex) =>
                              itemIndex === index ? tag : item,
                            ),
                          )
                        }
                        style={[
                          styles.dietaryChoice,
                          active && styles.dietaryChoiceSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dietaryChoiceText,
                            active && styles.dietaryChoiceTextSelected,
                          ]}
                        >
                          {tag}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                {index < members.length - 1 && (
                  <View style={styles.dietaryDivider} />
                )}
              </View>
            ))}
            <Text style={styles.cardDetail}>
              Ask your group member before selecting. These preferences apply to
              their drink only.
            </Text>
            <View style={styles.modalActions}>
              <PrimaryButton
                title="Cancel"
                secondary
                onPress={() => setShowDietary(false)}
              />
              <PrimaryButton
                title="Confirm tags"
                onPress={() => {
                  setMembers((current) =>
                    current.map((member, index) => ({
                      ...member,
                      dietaryTag: draftTags[index],
                    })),
                  );
                  setShowDietary(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  function renderPromptModal({
    visible,
    title,
    message,
    primaryTitle,
    onPrimary,
    secondaryTitle,
    onSecondary,
  }: {
    visible: boolean;
    title: string;
    message: string;
    primaryTitle: string;
    onPrimary: () => void;
    secondaryTitle: string;
    onSecondary: () => void;
  }) {
    return (
      <Modal
        animationType="fade"
        onRequestClose={onSecondary}
        transparent
        visible={visible}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.dialog, modalWidthStyle]}>
            <Text style={styles.dialogTitle}>{title}</Text>
            <Text style={styles.dialogMessage}>{message}</Text>
            <PrimaryButton title={primaryTitle} onPress={onPrimary} />
            <PrimaryButton
              title={secondaryTitle}
              secondary
              onPress={onSecondary}
            />
          </View>
        </View>
      </Modal>
    );
  }

  if (screen === "login" || screen === "signup") {
    const isSignUp = screen === "signup";

    return (
      <SafeAreaProvider>
        <View style={styles.appViewport}>
          <SafeAreaView
            edges={["top", "bottom"]}
            style={[styles.root, styles.mobileFrame]}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              style={styles.root}
            >
              <StatusBar barStyle="dark-content" />
              <ScrollView
                contentContainerStyle={[
                  styles.content,
                  styles.loginContent,
                  isSignUp && styles.signupContent,
                ]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.loginBrand}>
                  <BrandIcon />
                </View>
                <Text style={styles.brandName}>ServeFlow</Text>
                <Text style={styles.loginTitle}>
                  {isSignUp ? "Create your account" : "Welcome back"}
                </Text>
                <Text style={styles.loginIntro}>
                  {isSignUp
                    ? "Create an account to make group ordering easier."
                    : "Sign in to order your favorite drinks with your group."}
                </Text>
                {isSignUp && (
                  <>
                    <Text style={styles.fieldLabel}>Full name</Text>
                    <TextInput
                      autoCapitalize="words"
                      autoComplete="name"
                      onChangeText={setFullName}
                      placeholder="Your name"
                      placeholderTextColor={colors.muted}
                      returnKeyType="next"
                      style={styles.textInput}
                      textContentType="name"
                      value={fullName}
                    />
                  </>
                )}
                <Text style={styles.fieldLabel}>Email address</Text>
                <TextInput
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.muted}
                  style={styles.textInput}
                  textContentType="emailAddress"
                  value={email}
                />
                <Text style={styles.fieldLabel}>Password</Text>
                <TextInput
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.muted}
                  secureTextEntry
                  style={styles.textInput}
                  textContentType="password"
                  value={password}
                />
                {isSignUp && (
                  <>
                    <Text style={styles.fieldLabel}>Confirm password</Text>
                    <TextInput
                      autoComplete="new-password"
                      onChangeText={setConfirmPassword}
                      placeholder="Re-enter your password"
                      placeholderTextColor={colors.muted}
                      returnKeyType="done"
                      secureTextEntry
                      style={styles.textInput}
                      textContentType="newPassword"
                      value={confirmPassword}
                    />
                  </>
                )}
                {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}
                <PrimaryButton
                  title={isSignUp ? "Create account" : "Sign in"}
                  onPress={() => {
                    if (
                      (isSignUp && !fullName.trim()) ||
                      !email.trim() ||
                      !password ||
                      (isSignUp && !confirmPassword)
                    ) {
                      setLoginError(
                        isSignUp
                          ? "Complete each field to create your account."
                          : "Enter an email address and password to continue.",
                      );
                      return;
                    }
                    if (!email.trim().includes("@")) {
                      setLoginError("Enter a valid email address.");
                      return;
                    }
                    if (isSignUp && password !== confirmPassword) {
                      setLoginError("Your passwords do not match.");
                      return;
                    }
                    setLoginError("");
                    setScreen("home");
                    setActiveTab("Home");
                  }}
                />
                <View style={styles.authSwitchRow}>
                  <Text style={styles.authSwitchText}>
                    {isSignUp
                      ? "Already have an account?"
                      : "New to ServeFlow?"}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      setLoginError("");
                      setScreen(isSignUp ? "login" : "signup");
                    }}
                  >
                    <Text style={styles.authSwitchLink}>
                      {isSignUp ? "Sign in" : "Sign up"}
                    </Text>
                  </Pressable>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.appViewport}>
        <SafeAreaView
          edges={["top", "bottom"]}
          style={[styles.root, styles.mobileFrame]}
        >
          <StatusBar barStyle="dark-content" />
          <ScrollView
            contentContainerStyle={[
              styles.content,
              windowWidth >= 1280 && styles.wideContent,
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {pageContent()}
          </ScrollView>
          <View style={styles.bottomArea}>{bottomActions()}</View>
          {renderTabs()}
          {renderDietaryModal()}
          {renderPromptModal({
            visible: showConflict,
            title: "Switch to vegan whip?",
            message:
              "Your Vegan preference may conflict with dairy whipped cream. Confirm ingredients and cross-contact risks with the barista.",
            primaryTitle: "Switch to Vegan Whip",
            onPrimary: () => {
              if (quickOrderMember) {
                setQuickOrderMember({ ...quickOrderMember, whip: "Vegan whip" });
              } else {
                updateMember(editingMember, { whip: "Vegan whip" });
              }
              setSelectedWhip("Vegan whip");
              setShowConflict(false);
              setScreen("orderSummary");
            },
            secondaryTitle: "Keep dairy whip",
            onSecondary: () => {
              setShowConflict(false);
              setScreen("orderSummary");
            },
          })}
          {renderPromptModal({
            visible: showNutWarning,
            title: "Hazelnut allergy warning",
            message:
              "Hazelnut syrup may conflict with this nut-allergy preference. Choose vanilla syrup instead, and confirm ingredients and cross-contact risks with the barista.",
            primaryTitle: "Switch to Vanilla Syrup",
            onPrimary: () => {
              setSelectedSyrup("Vanilla syrup");
              setShowNutWarning(false);
            },
            secondaryTitle: "Cancel",
            onSecondary: () => setShowNutWarning(false),
          })}
          {renderPromptModal({
            visible: showConfirmation,
            title: "Order submitted",
            message:
              "Your prototype order has been submitted. Payment and order fulfillment are simulated.",
            primaryTitle: "Done",
            onPrimary: () => setShowConfirmation(false),
            secondaryTitle: "Close",
            onSecondary: () => setShowConfirmation(false),
          })}
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appViewport: {
    flex: 1,
    backgroundColor: colors.cream,
    alignItems: "stretch",
    justifyContent: "flex-start",
  },
  root: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.cream,
  },
  mobileFrame: Platform.select({
    web: {
      height: "100%",
      width: "100%",
      maxWidth: "100%",
      overflow: "hidden",
      borderRadius: 0,
    } as const,
    default: {},
  }),
  content: {
    flexGrow: 1,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
    gap: 12,
  },
  wideContent: {
    maxWidth: 1120,
  },
  loginContent: {
    justifyContent: "center",
    paddingTop: 48,
    paddingBottom: 48,
  },
  signupContent: {
    paddingTop: 28,
    paddingBottom: 28,
  },
  searchBar: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    backgroundColor: colors.white,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 13,
  },
  searchClear: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  searchClearText: {
    color: colors.muted,
    fontSize: 22,
    lineHeight: 24,
  },
  searchResults: {
    gap: 8,
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.white,
  },
  searchResult: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  searchResultCopy: {
    flex: 1,
    gap: 3,
  },
  loginBrand: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  brandName: {
    color: colors.green,
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },
  loginIntro: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
  },
  textInput: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    color: colors.text,
    marginTop: -5,
    marginBottom: 3,
  },
  errorText: {
    color: "#A33B32",
    fontSize: 12,
  },
  authSwitchRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  authSwitchText: {
    color: colors.muted,
    fontSize: 12,
  },
  authSwitchLink: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "700",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 2,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  backButtonText: {
    color: colors.green,
    fontSize: 30,
    lineHeight: 32,
    marginTop: -4,
  },
  headerCopy: {
    flex: 1,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 2,
  },
  crewBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.greenSoft,
    borderRadius: 17,
    padding: 14,
  },
  crewIcon: {
    color: colors.green,
    fontSize: 26,
  },
  crewTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  cardDetail: {
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
  },
  tagSettings: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
  },
  tagIcon: {
    color: colors.green,
    fontSize: 18,
  },
  tagCopy: {
    flex: 1,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    columnGap: 8,
    rowGap: 6,
    marginTop: 2,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  sectionCount: {
    color: colors.green,
    fontSize: 11,
    fontWeight: "700",
    marginLeft: "auto",
  },
  addMemberButton: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.greenSoft,
  },
  addMemberButtonText: {
    color: colors.green,
    fontSize: 10,
    fontWeight: "700",
  },
  memberCard: {
    gap: 10,
    padding: 12,
    backgroundColor: colors.white,
    borderRadius: 17,
  },
  memberDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0E6D5",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.green,
    fontSize: 18,
  },
  memberCopy: {
    flex: 1,
    gap: 3,
  },
  memberNameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  memberNameInput: {
    minWidth: 100,
    maxWidth: "100%",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 4,
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  memberActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  memberActionButton: {
    minHeight: 28,
    justifyContent: "center",
    paddingHorizontal: 9,
    borderRadius: 14,
    backgroundColor: "#F7F6F1",
  },
  memberActionText: {
    color: colors.green,
    fontSize: 10,
    fontWeight: "600",
  },
  removeMemberText: {
    color: colors.warning,
    fontSize: 10,
    fontWeight: "600",
  },
  disabledActionText: {
    color: colors.muted,
    opacity: 0.5,
  },
  memberName: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  greenBadge: {
    backgroundColor: colors.greenSoft,
  },
  warningBadge: {
    backgroundColor: colors.warningSoft,
  },
  badgeText: {
    color: colors.green,
    fontSize: 9,
    fontWeight: "600",
  },
  warningText: {
    color: colors.warning,
  },
  primaryButton: {
    minHeight: 46,
    borderRadius: 24,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  secondaryButton: {
    backgroundColor: colors.greenSoft,
    borderWidth: 1,
    borderColor: "#A1B5A4",
  },
  secondaryButtonText: {
    color: colors.green,
  },
  pressed: {
    opacity: 0.75,
  },
  finePrint: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 13,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  menuCopy: {
    flex: 1,
    gap: 4,
  },
  chooseText: {
    color: colors.green,
    fontSize: 11,
    fontWeight: "700",
  },
  profileHero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileInitials: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0E6D5",
  },
  profileInitialsText: {
    color: colors.text,
    fontSize: 13,
  },
  profileCallout: {
    gap: 5,
    padding: 14,
    backgroundColor: colors.greenSoft,
    borderRadius: 16,
  },
  calloutTitle: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "700",
  },
  restriction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 11,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 11,
    backgroundColor: colors.white,
  },
  restrictionSelected: {
    borderColor: "#9BB6A5",
    backgroundColor: colors.greenSoft,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: colors.muted,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    borderColor: colors.green,
    backgroundColor: colors.green,
  },
  checkboxTick: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "700",
  },
  bodyText: {
    color: colors.text,
    fontSize: 12,
  },
  tipsCard: {
    gap: 8,
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  logoutSection: {
    gap: 10,
    marginTop: 8,
  },
  recentOrdersSection: {
    gap: 10,
    marginTop: 8,
  },
  recentOrderCard: {
    gap: 8,
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  tipsTitle: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "700",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.line,
    marginVertical: 5,
  },
  drinkCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  drinkCopy: {
    flex: 1,
    gap: 4,
  },
  cardHeading: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  priceText: {
    color: colors.green,
    fontSize: 13,
    fontWeight: "700",
  },
  choiceCard: {
    gap: 8,
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  choiceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },
  choice: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    paddingHorizontal: 11,
    paddingVertical: 8,
    backgroundColor: colors.white,
  },
  choiceSelected: {
    borderColor: "#9BB6A5",
    backgroundColor: colors.greenSoft,
  },
  choiceText: {
    color: colors.muted,
    fontSize: 11,
  },
  choiceTextSelected: {
    color: colors.green,
    fontWeight: "600",
  },
  card: {
    gap: 8,
    padding: 14,
    borderRadius: 17,
    backgroundColor: colors.white,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  mutedText: {
    color: colors.muted,
    fontSize: 11,
  },
  summaryValue: {
    color: colors.text,
    fontSize: 11,
    textAlign: "right",
  },
  readyText: {
    color: colors.green,
    fontSize: 11,
    fontWeight: "700",
  },
  summaryMemberHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  bottomArea: {
    gap: 4,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: colors.cream,
  },
  cancelButton: {
    alignItems: "center",
    padding: 6,
  },
  cancelButtonText: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "700",
  },
  tabBar: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 5 : 8,
    backgroundColor: colors.white,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  tabLabel: {
    color: colors.muted,
    fontSize: 9,
  },
  tabActive: {
    color: colors.green,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(20, 25, 21, 0.45)",
  },
  dialog: {
    gap: 12,
    padding: 20,
    borderRadius: 18,
    backgroundColor: colors.white,
  },
  dialogTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
  },
  dialogMessage: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  dietarySheet: {
    gap: 12,
    maxHeight: "90%",
    padding: 20,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  dietaryPersonHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 7,
  },
  dietaryAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0E6D5",
  },
  dietaryAvatarText: {
    color: colors.green,
    fontSize: 11,
    fontWeight: "700",
  },
  dietarySelectedBadge: {
    marginLeft: "auto",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: colors.greenSoft,
  },
  dietarySelectedBadgeText: {
    color: colors.green,
    fontSize: 10,
    fontWeight: "600",
  },
  dietaryDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.line,
    marginVertical: 9,
  },
  dietaryOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  dietaryChoice: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: "#F7F6F1",
  },
  dietaryChoiceSelected: {
    borderColor: colors.green,
    backgroundColor: colors.green,
  },
  dietaryChoiceText: {
    color: colors.muted,
    fontSize: 10,
  },
  dietaryChoiceTextSelected: {
    color: colors.white,
    fontWeight: "600",
  },
  modalActions: {
    flexDirection: "row",
    gap: 8,
  },
});
