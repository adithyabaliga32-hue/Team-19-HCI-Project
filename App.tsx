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
  quantity: number;
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

function getDietaryConflicts(member: GroupMember) {
  const conflicts: string[] = [];

  if (member.dietaryTag === "Vegan") {
    if (member.milk === "2% milk") conflicts.push("2% milk conflicts with Vegan");
    if (member.whip === "Dairy whip") conflicts.push("Dairy whipped cream conflicts with Vegan");
  }
  if (member.dietaryTag === "Lactose intolerance") {
    if (member.milk === "2% milk") conflicts.push("2% milk contains lactose");
    if (member.whip === "Dairy whip") conflicts.push("Dairy whipped cream contains lactose");
  }
  if (member.dietaryTag === "Nut allergy" && member.syrup === "Hazelnut syrup") {
    conflicts.push("Hazelnut syrup conflicts with Nut allergy");
  }

  return conflicts;
}

const restaurants = ["Starbucks", "TeaCo"];
const allRestaurantsOption = "All";

function hasFixedIcedTemperature(drink: string) {
  return /\b(?:iced|frozen|cold brew|refresher|frappuccino|frappe|blended)\b/i.test(
    drink,
  );
}

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
  muted: "#68716A",
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
    quantity: 1,
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
    quantity: 1,
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
    quantity: 1,
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
  quantity: 1,
  added: false,
};

const tagOptions: DietaryTag[] = [
  "Vegan",
  "Gluten-free",
  "Nut allergy",
  "Lactose intolerance",
  "None",
];
const groupTagOptions = tagOptions.filter((tag) => tag !== "Gluten-free");

const money = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" });

function PrimaryButton({
  title,
  onPress,
  secondary = false,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        secondary && styles.secondaryButton,
        disabled && styles.primaryButtonDisabled,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.primaryButtonText,
          secondary && styles.secondaryButtonText,
          disabled && styles.primaryButtonTextDisabled,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

function Badge({ tag }: { tag: DietaryTag }) {
  const warning = tag === "Nut allergy" || tag === "Lactose intolerance";
  return (
    <View style={[styles.badge, warning ? styles.warningBadge : styles.greenBadge]}>
      <Text style={[styles.badgeText, warning && styles.warningText]}>
        {tag === "None" ? "No restrictions" : tag}
      </Text>
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
  optionDetails,
}: {
  title: string;
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  optionDetails?: Record<string, string>;
}) {
  return (
    <View style={styles.choiceCard}>
      <View style={styles.choiceHeading}>
        <Text style={styles.fieldLabel}>{title}</Text>
        <Text style={styles.chooseHint}>Choose one</Text>
      </View>
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
              {optionDetails?.[option] && (
                <Text
                  style={[
                    styles.choiceDetail,
                    active && styles.choiceTextSelected,
                  ]}
                >
                  {optionDetails[option]}
                </Text>
              )}
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
  const [menuRestaurantFilter, setMenuRestaurantFilter] = useState("Starbucks");
  const [members, setMembers] = useState(initialMembers);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [quickOrderMember, setQuickOrderMember] = useState<GroupMember | null>(null);
  const [profileTags, setProfileTags] = useState<DietaryTag[]>([
    "Vegan",
    "Nut allergy",
  ]);
  const [profileDraftTags, setProfileDraftTags] = useState<DietaryTag[]>([]);
  const [draftTags, setDraftTags] = useState<DietaryTag[]>([
    "Vegan",
    "Nut allergy",
    "None",
  ]);
  const [editingNameId, setEditingNameId] = useState<number | null>(null);
  const [nameDraft, setNameDraft] = useState("");
  const [showDietary, setShowDietary] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [editingMember, setEditingMember] = useState(0);
  const [groupFlow, setGroupFlow] = useState(false);
  const [useProfileRestrictions, setUseProfileRestrictions] = useState(false);
  const [menuTargetMemberId, setMenuTargetMemberId] = useState(initialMembers[0].id);
  const [switchingDrinkForMemberId, setSwitchingDrinkForMemberId] = useState<
    number | null
  >(null);
  const [returnToGroupSummary, setReturnToGroupSummary] = useState(false);
  const [editingSummaryOrder, setEditingSummaryOrder] = useState(false);
  const [selectedSize, setSelectedSize] = useState("Grande");
  const [selectedTemperature, setSelectedTemperature] = useState("Hot");
  const [selectedMilk, setSelectedMilk] = useState("Oat milk");
  const [selectedSyrup, setSelectedSyrup] = useState("No syrup");
  const [selectedWhip, setSelectedWhip] = useState("Dairy whip");
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const currentMember = quickOrderMember ?? members[editingMember];
  const currentDietaryTags =
    quickOrderMember || useProfileRestrictions
      ? profileTags
      : [currentMember?.dietaryTag ?? "None"];
  const dairyConflictTags = currentDietaryTags.filter(
    (tag) =>
      (tag === "Vegan" || tag === "Lactose intolerance") &&
      (selectedMilk === "2% milk" || selectedWhip === "Dairy whip"),
  );
  const dairyConflict = dairyConflictTags.length > 0;
  const dairyIngredientName = currentDietaryTags.includes("Lactose intolerance")
    ? "lactose"
    : "dairy";
  const nutSyrupConflict =
    currentDietaryTags.includes("Nut allergy") &&
    selectedSyrup === "Hazelnut syrup";
  const orderedMembers = useMemo(
    () => members.filter((member) => member.added),
    [members],
  );
  const subtotal = orderedMembers.reduce(
    (total, member) => total + member.price * member.quantity,
    0,
  );
  const orderedDrinkCount = orderedMembers.reduce(
    (count, member) => count + member.quantity,
    0,
  );
  const orderedMemberConflicts = orderedMembers.flatMap((member) =>
    getDietaryConflicts(member).map((conflict) => ({ member, conflict })),
  );
  const cannotSubmitGroup =
    orderedMemberConflicts.length > 0 || members.some((member) => !member.added);
  const checkoutItems = quickOrderMember ? [quickOrderMember] : orderedMembers;
  const checkoutDrinkCount = checkoutItems.reduce(
    (count, member) => count + member.quantity,
    0,
  );
  const checkoutTotal = checkoutItems.reduce(
    (total, member) => total + member.price * member.quantity,
    0,
  );
  const checkoutDetails = checkoutItems
    .map(
      (member) =>
        `${member.name} (${
          quickOrderMember
            ? profileTags.filter((tag) => tag !== "None").join(", ") || "No restrictions"
            : member.dietaryTag === "None"
              ? "No restrictions"
              : member.dietaryTag
        }): ${member.quantity} × ${member.drink} (${member.milk}, ${member.whip})`,
    )
    .join("\n");

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
        quantity: 1,
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

  function beginCustomization(
    index: number,
    inGroupFlow: boolean,
    fromGroupSummary = false,
  ) {
    const member = members[index];
    if (!member) return;
    setQuickOrderMember(null);
    setEditingMember(index);
    setGroupFlow(inGroupFlow);
    setUseProfileRestrictions(false);
    setReturnToGroupSummary(fromGroupSummary);
    setEditingSummaryOrder(fromGroupSummary);
    setSelectedSize(member.size);
    setSelectedTemperature(
      hasFixedIcedTemperature(member.drink) ? "Iced" : member.temperature,
    );
    setSelectedMilk(member.milk);
    setSelectedSyrup(member.syrup);
    setSelectedWhip(member.whip);
    setSelectedQuantity(member.quantity);
    setScreen("customize");
  }

  function chooseDrink(memberIndex: number, item: MenuDrink) {
    const member = members[memberIndex];
    if (!member) return;
    const switchingCurrentDrink = switchingDrinkForMemberId === member.id;
    const sameDrink =
      switchingCurrentDrink &&
      member.restaurant === item.restaurant &&
      member.drink === item.drink;

    const updatedMember: GroupMember = {
      ...member,
      restaurant: item.restaurant,
      drink: item.drink,
      price: item.price,
      temperature: hasFixedIcedTemperature(item.drink)
        ? "Iced"
        : sameDrink
          ? member.temperature
          : item.temperature,
      milk: sameDrink ? member.milk : item.milk,
      syrup: sameDrink ? member.syrup : item.syrup,
      whip: sameDrink ? member.whip : item.whip,
      added: switchingCurrentDrink ? member.added : false,
    };
    setMembers((current) =>
      current.map((currentMember, index) =>
        index === memberIndex ? updatedMember : currentMember,
      ),
    );
    setSelectedRestaurant(item.restaurant);
    setMenuRestaurantFilter(item.restaurant);
    setQuickOrderMember(null);
    setEditingMember(memberIndex);
    if (!switchingCurrentDrink) {
      setGroupFlow(true);
      setReturnToGroupSummary(false);
      setEditingSummaryOrder(false);
    }
    setUseProfileRestrictions(false);
    setSwitchingDrinkForMemberId(null);
    setSelectedSize(updatedMember.size);
    setSelectedTemperature(updatedMember.temperature);
    setSelectedMilk(updatedMember.milk);
    setSelectedSyrup(updatedMember.syrup);
    setSelectedWhip(updatedMember.whip);
    setSelectedQuantity(updatedMember.quantity);
    setScreen("customize");
  }

  function switchCurrentDrink() {
    if (!currentMember) return;
    setSwitchingDrinkForMemberId(currentMember.id);
    setMenuTargetMemberId(currentMember.id);
    setMenuRestaurantFilter(allRestaurantsOption);
    setSearchQuery("");
    setScreen("menu");
    setActiveTab("Menu");
  }

  function selectRestaurant(restaurant: string) {
    const nextMember = members.find((member) => !member.added) ?? members[0];
    if (nextMember) setMenuTargetMemberId(nextMember.id);
    setSelectedRestaurant(restaurant);
    setMenuRestaurantFilter(restaurant);
    setSearchQuery("");
    setScreen("menu");
    setActiveTab("Menu");
  }

  function selectMenuRestaurant(restaurant: string) {
    setMenuRestaurantFilter(restaurant);
    if (restaurant !== allRestaurantsOption) {
      setSelectedRestaurant(restaurant);
    }
  }

  function quickOrder() {
    const member = savedFavorite;
    setQuickOrderMember(member);
    setGroupFlow(false);
    setUseProfileRestrictions(true);
    setSelectedSize(member.size);
    setSelectedTemperature(member.temperature);
    setSelectedMilk(member.milk);
    setSelectedSyrup(member.syrup);
    setSelectedWhip(member.whip);
    setSelectedQuantity(member.quantity);

    setScreen("orderSummary");
  }

  function addCurrentDrink() {
    if (!currentMember) return;
    if (dairyConflict || nutSyrupConflict) return;

    updateMember(editingMember, {
      size: selectedSize,
      temperature: hasFixedIcedTemperature(currentMember.drink)
        ? "Iced"
        : selectedTemperature,
      milk: selectedMilk,
      syrup: selectedSyrup,
      whip: selectedWhip,
      quantity: selectedQuantity,
      added: true,
    });

    const nextMember = groupFlow
      ? members.findIndex((member, index) => index !== editingMember && !member.added)
      : -1;
    if (groupFlow && nextMember < 0) {
      setScreen("groupSummary");
      setActiveTab("Orders");
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
    setShowSubmitConfirmation(true);
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
    const restaurant = order.items[0]?.restaurant ?? selectedRestaurant;
    setSelectedRestaurant(restaurant);
    setMenuRestaurantFilter(restaurant);
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
    setShowConfirmation(false);
    setShowSubmitConfirmation(false);
  }

  function selectSyrup(syrup: string) {
    setSelectedSyrup(syrup);
  }

  function saveCustomizationDraft() {
    if (!currentMember || quickOrderMember) return;
    updateMember(editingMember, {
      size: selectedSize,
      temperature: hasFixedIcedTemperature(currentMember.drink)
        ? "Iced"
        : selectedTemperature,
      milk: selectedMilk,
      syrup: selectedSyrup,
      whip: selectedWhip,
      quantity: selectedQuantity,
      added: currentMember.added,
    });
    const returnToSummary = returnToGroupSummary || editingSummaryOrder;
    setScreen(returnToSummary ? "groupSummary" : "home");
    setActiveTab(returnToSummary ? "Orders" : "Home");
    setReturnToGroupSummary(false);
    setEditingSummaryOrder(false);
  }

  function openTab(tab: string) {
    setActiveTab(tab);
    setGroupFlow(false);
    setSwitchingDrinkForMemberId(null);
    if (tab === "Home") {
      setScreen("home");
    } else if (tab === "Menu") {
      const nextMember = members.find((member) => !member.added) ?? members[0];
      if (nextMember) setMenuTargetMemberId(nextMember.id);
      setScreen("menu");
    } else if (tab === "Orders") {
      setScreen("groupSummary");
    } else {
      setProfileDraftTags(profileTags);
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
            onPress={() => beginCustomization(index, true, members[index].added)}
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

  function header(title: string, subtitle: string, onBack?: () => void) {
    const handleBack =
      onBack ??
      (() => {
        setScreen("home");
        setActiveTab("Home");
      });
    return (
      <View style={styles.header}>
        <Pressable
          accessibilityLabel={onBack ? "Back to group" : "Back to home"}
          accessibilityRole="button"
          onPress={handleBack}
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
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const drinkCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return (
      <View style={styles.card}>
        <SummaryRow
          title={`Subtotal · ${drinkCount} ${drinkCount === 1 ? "drink" : "drinks"}`}
          value={money(total)}
        />
        <SummaryRow title="Estimated tax" value={money(total * 0.0825)} />
        <View style={styles.divider} />
        <SummaryRow title="Total" value={money(total * 1.0825)} />
      </View>
    );
  }
  function renderRestaurants() {
    return (
      <>
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Nearby restaurants</Text>
        </View>
        <Text style={styles.cardDetail}>Choose a spot near UT Dallas</Text>
  
        {restaurants.map((restaurant) => (
          <Pressable
            key={restaurant}
            accessibilityRole="button"
            onPress={() => selectRestaurant(restaurant)}
            style={styles.card}
          >
            <Text style={styles.cardHeading}>{restaurant}</Text>
            <Text style={styles.cardDetail}>View menu ›</Text>
          </Pressable>
        ))}
      </>
    );
  }
  function renderHome() {
    const favorite = savedFavorite;
    const groupDietarySummary = [
      ...new Set(members.map((member) => member.dietaryTag)),
    ]
      .map((tag) => (tag === "None" ? "No restrictions" : tag))
      .join(" · ");

    return (
      <>
        {header("ServeFlow", "UT Dallas · Your campus orders")}
        {renderSearchBar()}
        {renderHomeSearchResults()}
        {renderRestaurants()}
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
          <Text style={styles.sectionTitle}>Group order</Text>
          <Text style={styles.sectionCount}>
            {members.length} {members.length === 1 ? "person" : "people"} ·{" "}
            {orderedDrinkCount} drinks
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
            <Text style={styles.cardDetail}>{groupDietarySummary}</Text>
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
            {orderedDrinkCount} drinks
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
              title={member.added ? `Edit ${member.name}'s drink` : `Customize for ${member.name}`}
              secondary
              onPress={() => beginCustomization(index, true, members[index].added)}
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
    const targetMembers = members.filter((member) =>
      switchingDrinkForMemberId === null
        ? !member.added
        : member.id === switchingDrinkForMemberId,
    );
    const targetMember =
      targetMembers.find((member) => member.id === menuTargetMemberId) ??
      targetMembers[0];
    const targetMemberIndex = members.findIndex(
      (member) => member.id === targetMember?.id,
    );
    const visibleDrinks = menuDrinks.filter(
      (item) =>
        (menuRestaurantFilter === allRestaurantsOption ||
          item.restaurant === menuRestaurantFilter) &&
        (!query ||
          item.restaurant.toLowerCase().includes(query) ||
          item.drink.toLowerCase().includes(query)),
    );

    return (
      <>
        {header(
          "Menu",
          `${menuRestaurantFilter === allRestaurantsOption ? "All restaurants" : menuRestaurantFilter} · ${
            targetMember
              ? `Choose for ${targetMember.name}`
              : "All drinks added"
          }`,
          switchingDrinkForMemberId !== null
            ? () => {
                setSwitchingDrinkForMemberId(null);
                setActiveTab(editingSummaryOrder ? "Orders" : "Home");
                setScreen("customize");
              }
            : undefined,
        )}
        <PrimaryButton
          title="Manage group & dietary restrictions"
          secondary
          onPress={() => {
            setSwitchingDrinkForMemberId(null);
            setScreen("home");
            setActiveTab("Home");
          }}
        />
        {renderSearchBar()}
        <ChoiceSection
          title="Choose a restaurant"
          options={[allRestaurantsOption, ...restaurants]}
          selected={menuRestaurantFilter}
          onSelect={selectMenuRestaurant}
        />
        <View style={styles.menuTargetCard}>
          <Text style={styles.fieldLabel}>Ordering for</Text>
          {targetMembers.length > 0 ? (
            <View style={styles.menuTargetChoices}>
              {targetMembers.map((member) => {
                const selected = member.id === targetMember?.id;
                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    key={member.id}
                    onPress={() => setMenuTargetMemberId(member.id)}
                    style={[
                      styles.menuTargetChoice,
                      selected && styles.menuTargetChoiceSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.menuTargetName,
                        selected && styles.menuTargetNameSelected,
                      ]}
                    >
                      {member.name}
                    </Text>
                    <Badge tag={member.dietaryTag} />
                  </Pressable>
                );
              })}
            </View>
          ) : (
            <Text style={styles.cardDetail}>
              Everyone has a drink. Review the group order to edit an existing one.
            </Text>
          )}
        </View>
        {visibleDrinks.map((item) => {
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  targetMember
                    ? `Choose ${item.drink} for ${targetMember.name}`
                    : `${item.drink}, no group members available`
                }
                disabled={!targetMember}
                key={`${item.restaurant}-${item.drink}`}
                onPress={() => {
                  if (targetMemberIndex >= 0) chooseDrink(targetMemberIndex, item);
                }}
                style={({ pressed }) => [
                  styles.menuItem,
                  !targetMember && styles.menuItemDisabled,
                  pressed && styles.pressed,
                ]}
              >
                <DrinkArtwork drink={item.drink} size={58} />
                <View style={styles.menuCopy}>
                  <Text style={styles.memberName}>{item.drink}</Text>
                  <Text style={styles.cardDetail}>
                    From {money(item.price)} · {item.temperature}
                    {menuRestaurantFilter === allRestaurantsOption
                      ? ` · ${item.restaurant}`
                      : ""}
                  </Text>
                </View>
                <Text style={styles.chooseText}>
                  {targetMember ? `Choose for ${targetMember.name}` : "Added"}
                </Text>
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
            const selected = profileDraftTags.includes(tag);
            return (
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
                key={tag}
                onPress={() =>
                  setProfileDraftTags((current) => {
                    if (selected) {
                      return current.filter((item) => item !== tag);
                    }
                    if (tag === "None") {
                      return ["None"];
                    }
                    return [...current.filter((item) => item !== "None"), tag];
                  })
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
          <Text style={styles.tipsTitle}>ⓘ  Lactose intolerance — dairy ingredients</Text>
          <Text style={styles.cardDetail}>
            2% milk and dairy whipped cream contain lactose. Choose oat milk and
            vegan whip (or no topping) instead. Check ingredient details with a
            barista.
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
        {groupFlow && (
          <Pressable
            accessibilityRole="button"
            onPress={saveCustomizationDraft}
            style={styles.backToGroup}
          >
            <Text style={styles.backToGroupText}>‹  Back to group</Text>
          </Pressable>
        )}
        {header(
          groupFlow ? "Group customize" : "Customize",
          `${currentMember.restaurant} · UTD Student Union`,
          saveCustomizationDraft,
        )}
        {groupFlow && (
          <View style={styles.groupPersonCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>♙</Text>
            </View>
            <View style={styles.groupPersonCopy}>
              <Text style={styles.memberName}>{currentMember.name}</Text>
              <Text style={styles.cardDetail}>{currentMember.dietaryTag}</Text>
            </View>
          </View>
        )}
        <View style={styles.drinkCard}>
          <DrinkArtwork drink={currentMember.drink} size={76} />
          <View style={styles.drinkCopy}>
            <Text style={styles.cardHeading}>{currentMember.drink}</Text>
            <Text style={styles.priceText}>{money(currentMember.price)}</Text>
            <Text style={styles.cardDetail}>
              {currentMember.size} · {selectedTemperature} · {currentMember.milk}
            </Text>
          </View>
        </View>
        <PrimaryButton
          title="Switch drink"
          secondary
          onPress={switchCurrentDrink}
        />
        {useProfileRestrictions && (
          <View style={styles.profileRestrictionCard}>
            <Text style={styles.fieldLabel}>Dietary checks for this order</Text>
            <View style={styles.restrictionBadges}>
              {currentDietaryTags.filter((tag) => tag !== "None").length > 0 ? (
                currentDietaryTags
                  .filter((tag) => tag !== "None")
                  .map((tag) => <Badge key={tag} tag={tag} />)
              ) : (
                <Text style={styles.cardDetail}>No profile restrictions selected</Text>
              )}
            </View>
          </View>
        )}
        <ChoiceSection
          title="Size"
          options={["Tall", "Grande", "Venti"]}
          selected={selectedSize}
          onSelect={setSelectedSize}
          optionDetails={{ Tall: "12 fl oz", Grande: "16 fl oz", Venti: "24 fl oz" }}
        />
        {!hasFixedIcedTemperature(currentMember.drink) && (
          <ChoiceSection
            title="Temperature"
            options={["Hot", "Iced"]}
            selected={selectedTemperature}
            onSelect={setSelectedTemperature}
            optionDetails={{ Hot: "☕", Iced: "❄" }}
          />
        )}
        <ChoiceSection
          title="Milk"
          options={["Oat milk", "2% milk", "Almond milk", "No milk"]}
          selected={selectedMilk}
          onSelect={setSelectedMilk}
          optionDetails={{
            "Oat milk": "Plant-based",
            "2% milk": "Contains dairy",
            "Almond milk": "Plant-based",
          }}
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
          optionDetails={{
            "Dairy whip": "Contains dairy",
            "Vegan whip": "Plant-based",
            "No topping": "No topping",
          }}
        />
        {dairyConflict && (
          <View style={styles.conflictNotice}>
            <Text style={styles.conflictTitle}>
              ⚠  Dairy conflicts with {dairyConflictTags.join(" & ")}
            </Text>
            <Text style={styles.cardDetail}>
              {selectedMilk === "2% milk" && selectedWhip === "Dairy whip"
                ? `2% milk and dairy whipped cream contain ${dairyIngredientName}. Choose oat milk and a dairy-free topping.`
                : selectedMilk === "2% milk"
                  ? `2% milk contains ${dairyIngredientName}. Choose oat milk instead.`
                  : `Dairy whipped cream contains ${dairyIngredientName}. Choose vegan whip or no topping.`}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                if (selectedMilk === "2% milk") setSelectedMilk("Oat milk");
                if (selectedWhip === "Dairy whip") {
                  setSelectedWhip("Vegan whip");
                }
              }}
              style={styles.conflictAction}
            >
              <Text style={styles.conflictActionText}>
                {selectedMilk === "2% milk" && selectedWhip === "Dairy whip"
                  ? "Switch to Oat Milk & Vegan Whip"
                  : selectedMilk === "2% milk"
                    ? "Switch to Oat Milk"
                    : "Switch to Vegan Whip"}
              </Text>
            </Pressable>
          </View>
        )}
        {nutSyrupConflict && (
          <View style={styles.conflictNotice}>
            <Text style={styles.conflictTitle}>⚠  Hazelnut conflicts with Nut allergy</Text>
            <Text style={styles.cardDetail}>
              Hazelnut syrup is selected. Choose vanilla syrup instead to continue.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setSelectedSyrup("Vanilla syrup")}
              style={styles.conflictAction}
            >
              <Text style={styles.conflictActionText}>Switch to Vanilla Syrup</Text>
            </Pressable>
          </View>
        )}
        <View style={styles.quantityCard}>
          <View style={styles.quantityCopy}>
            <Text style={styles.fieldLabel}>Quantity</Text>
            <Text style={styles.cardDetail}>
              {money(currentMember.price)} each · {money(currentMember.price * selectedQuantity)} total
            </Text>
          </View>
          <View style={styles.quantityControls}>
            <Pressable
              accessibilityLabel="Decrease quantity"
              accessibilityRole="button"
              disabled={selectedQuantity <= 1}
              onPress={() => setSelectedQuantity((quantity) => Math.max(1, quantity - 1))}
              style={[styles.quantityButton, selectedQuantity <= 1 && styles.quantityButtonDisabled]}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </Pressable>
            <Text accessibilityLabel={`Quantity ${selectedQuantity}`} style={styles.quantityValue}>
              {selectedQuantity}
            </Text>
            <Pressable
              accessibilityLabel="Increase quantity"
              accessibilityRole="button"
              onPress={() => setSelectedQuantity((quantity) => quantity + 1)}
              style={styles.quantityButton}
            >
              <Text style={styles.quantityButtonText}>＋</Text>
            </Pressable>
          </View>
        </View>
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
            <Text style={styles.cardHeading}>
              ☕  {currentMember.quantity} × {currentMember.drink}
            </Text>
            <Text style={styles.cardHeading}>
              {money(currentMember.price * currentMember.quantity)}
            </Text>
          </View>
          <View style={styles.summaryMemberHeader}>
            {currentDietaryTags
              .filter((tag) => tag !== "None")
              .map((tag) => <Badge key={tag} tag={tag} />)}
          </View>
          <View style={styles.divider} />
          <SummaryRow title="Quantity" value={String(currentMember.quantity)} />
          <SummaryRow
            title="Size"
            value={`${currentMember.size} · ${
              currentMember.size === "Tall"
                ? "12"
                : currentMember.size === "Venti"
                  ? "24"
                  : "16"
            } fl oz`}
          />
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
    const drinkCount = orderedMembers.reduce(
      (count, member) => count + member.quantity,
      0,
    );
    const membersWithoutDrinks = members.filter((member) => !member.added);
    return (
      <>
        {header(
          "Group summary",
          `${members.length} people · ${drinkCount} drinks · Review each person`,
        )}
        <PrimaryButton
          title="Manage group & dietary restrictions"
          secondary
          onPress={() => {
            setScreen("home");
            setActiveTab("Home");
          }}
        />
        <View style={styles.card}>
          {orderedMembers.length === 0 ? (
            <Text style={styles.cardDetail}>Your group order is empty.</Text>
          ) : (
            orderedMembers.map((member, index) => {
              const memberIndex = members.findIndex(
                (person) => person.id === member.id,
              );
              const conflicts = getDietaryConflicts(member);
              return (
                <View key={member.id} style={styles.groupSummaryItem}>
                  {index > 0 && <View style={styles.divider} />}
                  <View style={styles.summaryMemberHeader}>
                    <Text style={styles.cardHeading}>♙  {member.name}</Text>
                    <Badge tag={member.dietaryTag} />
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.bodyText}>
                      {member.quantity} × {member.drink}
                    </Text>
                    <Text style={styles.bodyText}>
                      {money(member.price * member.quantity)}
                    </Text>
                  </View>
                  <Text style={styles.cardDetail}>
                    {member.restaurant} · {member.size} · {member.temperature} · {member.milk}
                    {member.syrup !== "No syrup" ? ` · ${member.syrup}` : ""} ·{" "}
                    {member.whip}
                  </Text>
                  {conflicts.map((conflict) => (
                    <Text key={conflict} style={styles.summaryConflictText}>
                      ⚠ {conflict}
                    </Text>
                  ))}
                  {memberIndex >= 0 && (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() =>
                        beginCustomization(memberIndex, true, true)
                      }
                      style={styles.editSummaryButton}
                    >
                      <Text style={styles.editSummaryButtonText}>
                        Edit {member.name}’s drink
                      </Text>
                    </Pressable>
                  )}
                </View>
              );
            })
          )}
        </View>
        {membersWithoutDrinks.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardHeading}>Drinks still needed</Text>
            {membersWithoutDrinks.map((member, index) => {
              const memberIndex = members.findIndex(
                (person) => person.id === member.id,
              );
              return (
                <View key={member.id}>
                  {index > 0 && <View style={styles.divider} />}
                  <View style={styles.summaryMemberHeader}>
                    <Text style={styles.bodyText}>{member.name}</Text>
                    <Badge tag={member.dietaryTag} />
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => beginCustomization(memberIndex, true)}
                    style={styles.editSummaryButton}
                  >
                    <Text style={styles.editSummaryButtonText}>
                      Choose a drink for {member.name}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}
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
                (sum, item) => sum + item.price * item.quantity,
                0,
              );
              const orderDrinkCount = order.items.reduce(
                (count, item) => count + item.quantity,
                0,
              );
              return (
                <View key={order.id} style={styles.recentOrderCard}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.cardHeading}>
                      {orderDrinkCount}{" "}
                      {orderDrinkCount === 1 ? "drink" : "drinks"}
                    </Text>
                    <Text style={styles.cardHeading}>{money(total)}</Text>
                  </View>
                  <Text style={styles.cardDetail}>{order.placedAt}</Text>
                  {order.items.map((item) => (
                    <View key={item.id} style={styles.recentOrderItem}>
                      <View style={styles.summaryMemberHeader}>
                        <Text style={styles.memberName}>{item.name}</Text>
                        <Badge tag={item.dietaryTag} />
                      </View>
                      <Text style={styles.cardDetail}>
                        {item.quantity} × {item.drink} · {item.restaurant}
                      </Text>
                      <Text style={styles.cardDetail}>
                        {item.milk} · {item.whip}
                        {item.syrup !== "No syrup" ? ` · ${item.syrup}` : ""}
                      </Text>
                    </View>
                  ))}
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
      return (
        <PrimaryButton
          title="Continue to drink menu"
          onPress={() => {
            const nextMember = members.find((member) => !member.added);
            if (nextMember) setMenuTargetMemberId(nextMember.id);
            setScreen(nextMember ? "menu" : "groupSummary");
            setActiveTab(nextMember ? "Menu" : "Orders");
          }}
        />
      );
    }

    if (screen === "customize" && currentMember) {
      const hasConflict = dairyConflict || nutSyrupConflict;
      if (editingSummaryOrder) {
        return (
          <PrimaryButton
            title={
              nutSyrupConflict
                ? "Resolve syrup conflict to save"
                : dairyConflict
                  ? "Resolve dairy conflict to save"
                  : `Save ${currentMember.name}'s changes`
            }
            disabled={hasConflict}
            onPress={saveCustomizationDraft}
          />
        );
      }
      const hasMoreGroupMembers = members.some(
        (member, index) => index !== editingMember && !member.added,
      );
      const title = nutSyrupConflict
        ? "Resolve syrup conflict to add"
        : dairyConflict
          ? "Resolve dairy conflict to add"
          : groupFlow
            ? hasMoreGroupMembers
              ? `Add ${currentMember.name}'s drink`
              : "Add & review group order"
            : `Add to cart · ${money(currentMember.price * selectedQuantity)}`;
      return (
        <PrimaryButton
          title={title}
          disabled={hasConflict}
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
            : `Pay & submit · ${money(currentMember.price * currentMember.quantity * 1.0825)}`;
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
              title={
                orderedMemberConflicts.length > 0
                  ? "Resolve conflicts before checkout"
                  : members.some((member) => !member.added)
                    ? "Add the remaining drinks first"
                    : `Review & place group order · ${money(subtotal * 1.0825)}`
              }
              disabled={cannotSubmitGroup}
              onPress={() => setShowSubmitConfirmation(true)}
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
            setProfileTags(profileDraftTags);
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
    secondaryTitle?: string;
    onSecondary?: () => void;
  }) {
    return (
      <Modal
        animationType="fade"
        onRequestClose={onSecondary ?? onPrimary}
        transparent
        visible={visible}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.dialog, modalWidthStyle]}>
            <Text style={styles.dialogTitle}>{title}</Text>
            <Text style={styles.dialogMessage}>{message}</Text>
            <PrimaryButton title={primaryTitle} onPress={onPrimary} />
            {secondaryTitle && onSecondary && (
              <PrimaryButton
                title={secondaryTitle}
                secondary
                onPress={onSecondary}
              />
            )}
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
            visible: showSubmitConfirmation,
            title: "Review your order",
            message:
              `${checkoutDrinkCount} ${checkoutDrinkCount === 1 ? "drink" : "drinks"} · ` +
              `${money(checkoutTotal * 1.0825)} including estimated tax\n\n` +
              `${checkoutDetails}\n\n` +
              "Pickup: Student Union counter. Dietary labels are guidance only; confirm ingredients and cross-contact with the barista.",
            primaryTitle: "Confirm & place order",
            onPrimary: () => {
              setShowSubmitConfirmation(false);
              submitOrder();
            },
            secondaryTitle: "Review order",
            onSecondary: () => setShowSubmitConfirmation(false),
          })}
          {renderPromptModal({
            visible: showConfirmation,
            title: "Order submitted",
            message: "Your order has been submitted.",
            primaryTitle: "Done",
            onPrimary: () => setShowConfirmation(false),
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
  backToGroup: {
    alignSelf: "flex-start",
    paddingVertical: 2,
  },
  backToGroupText: {
    color: colors.green,
    fontSize: 11,
    fontWeight: "700",
  },
  groupPersonCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    padding: 11,
    borderRadius: 14,
    backgroundColor: colors.greenSoft,
  },
  groupPersonCopy: {
    flex: 1,
    gap: 2,
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
    fontSize: 12,
    lineHeight: 17,
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
    fontSize: 12,
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
    fontSize: 11,
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
    fontSize: 11,
    fontWeight: "600",
  },
  removeMemberText: {
    color: colors.warning,
    fontSize: 11,
    fontWeight: "600",
  },
  disabledActionText: {
    color: colors.muted,
    opacity: 0.5,
  },
  memberName: {
    color: colors.text,
    fontSize: 13,
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
    fontSize: 10,
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
  primaryButtonDisabled: {
    backgroundColor: "#E6E7E1",
  },
  primaryButtonTextDisabled: {
    color: colors.muted,
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
    fontSize: 11,
    lineHeight: 17,
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
    fontSize: 12,
    fontWeight: "700",
  },
  menuTargetCard: {
    gap: 9,
    padding: 12,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  menuTargetChoices: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  menuTargetChoice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    backgroundColor: colors.white,
  },
  menuTargetChoiceSelected: {
    borderColor: "#9BB6A5",
    backgroundColor: colors.greenSoft,
  },
  menuTargetName: {
    color: colors.text,
    fontSize: 12,
  },
  menuTargetNameSelected: {
    color: colors.green,
    fontWeight: "700",
  },
  menuItemDisabled: {
    opacity: 0.5,
  },
  profileRestrictionCard: {
    gap: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    backgroundColor: colors.white,
  },
  restrictionBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
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
  recentOrderItem: {
    gap: 4,
    paddingVertical: 7,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
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
  choiceHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  chooseHint: {
    color: colors.muted,
    fontSize: 10,
  },
  choiceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },
  choice: {
    flexGrow: 1,
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 9,
    backgroundColor: colors.white,
  },
  choiceSelected: {
    borderColor: "#9BB6A5",
    backgroundColor: colors.greenSoft,
  },
  choiceText: {
    color: colors.muted,
    fontSize: 11,
    textAlign: "center",
  },
  choiceDetail: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 2,
    textAlign: "center",
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
  conflictNotice: {
    gap: 7,
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.warningSoft,
  },
  conflictTitle: {
    color: colors.warning,
    fontSize: 12,
    fontWeight: "700",
  },
  conflictAction: {
    alignSelf: "flex-start",
    paddingVertical: 3,
  },
  conflictActionText: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "700",
  },
  groupSummaryItem: {
    gap: 7,
  },
  summaryConflictText: {
    color: colors.warning,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "600",
  },
  editSummaryButton: {
    alignSelf: "flex-start",
    minHeight: 32,
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  editSummaryButtonText: {
    color: colors.green,
    fontSize: 12,
    fontWeight: "700",
  },
  quantityCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: colors.white,
  },
  quantityCopy: {
    flex: 1,
    gap: 4,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: "#A1B5A4",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonDisabled: {
    opacity: 0.4,
  },
  quantityButtonText: {
    color: colors.green,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 20,
  },
  quantityValue: {
    minWidth: 14,
    color: colors.text,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
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
    fontSize: 10,
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
    fontSize: 11,
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
    fontSize: 11,
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