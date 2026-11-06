import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type DietaryTag =
  | "Vegan"
  | "Gluten-free"
  | "Nut allergy"
  | "Lactose intolerance"
  | "None";

export type GroupMember = {
  id: number;
  name: string;
  dietaryTags: DietaryTag[];
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

export function getDietaryConflicts(member: GroupMember) {
  const conflicts: string[] = [];
  const tags = member.dietaryTags;

  if (tags.includes("Vegan")) {
    if (member.milk === "2% milk")
      conflicts.push("2% milk conflicts with Vegan");
    if (member.whip === "Dairy whip")
      conflicts.push("Dairy whipped cream conflicts with Vegan");
  }
  if (tags.includes("Lactose intolerance")) {
    if (member.milk === "2% milk") conflicts.push("2% milk contains lactose");
    if (member.whip === "Dairy whip")
      conflicts.push("Dairy whipped cream contains lactose");
  }
  if (tags.includes("Nut allergy") && member.syrup === "Hazelnut syrup") {
    conflicts.push("Hazelnut syrup conflicts with Nut allergy");
  }

  return conflicts;
}

type CartContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  userEmail: string;
  setUserEmail: (email: string) => void;
  logout: () => void;
  members: GroupMember[];
  activeMemberId: number;
  setActiveMemberId: (id: number) => void;
  profileTags: DietaryTag[];
  setProfileTags: (tags: DietaryTag[]) => void;
  addMember: () => void;
  removeMember: (index: number) => void;
  updateMemberName: (index: number, name: string) => void;
  toggleMemberDietaryTag: (index: number, tag: DietaryTag) => void;
  updateMemberCustomization: (
    memberId: number,
    updates: Partial<GroupMember>,
  ) => void;
  
  updateMemberDietaryTags: (memberId: number, tags: DietaryTag[]) => void;
  clearCart: () => void;
};

const initialMembers: GroupMember[] = [
  {
    id: 0,
    name: "You",
    dietaryTags: ["Vegan"],
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
    dietaryTags: ["Nut allergy"],
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
    dietaryTags: ["None"],
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

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [members, setMembers] = useState<GroupMember[]>(initialMembers);
  const [activeMemberId, setActiveMemberId] = useState<number>(0);
  const [profileTags, setProfileTags] = useState<DietaryTag[]>([
    "Vegan",
    "Nut allergy",
  ]);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserEmail("");
  }, []);

  const clearCart = useCallback(() => {
    setMembers((prev) => prev.map((m) => ({ ...m, added: false })));
  }, []);

  const addMember = useCallback(() => {
    setMembers((prev) => {
      const id = prev.reduce((max, m) => Math.max(max, m.id), -1) + 1;
      let nameIndex = prev.length;
      let name = `Person ${String.fromCharCode(65 + nameIndex)}`;
      while (prev.some((m) => m.name === name)) {
        nameIndex += 1;
        name =
          nameIndex < 26
            ? `Person ${String.fromCharCode(65 + nameIndex)}`
            : `Person ${nameIndex + 1}`;
      }
      return [
        ...prev,
        {
          id,
          name,
          dietaryTags: ["None"],
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
    });
  }, []);

  const removeMember = useCallback((index: number) => {
    setMembers((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const updateMemberName = useCallback((index: number, name: string) => {
    setMembers((prev) =>
      prev.map((m, i) => (i === index ? { ...m, name } : m)),
    );
  }, []);

  const toggleMemberDietaryTag = useCallback(
    (index: number, tag: DietaryTag) => {
      setMembers((prev) =>
        prev.map((m, i) => {
          if (i !== index) return m;
          if (tag === "None") return { ...m, dietaryTags: ["None"] };

          const filtered = m.dietaryTags.filter((t) => t !== "None");
          const exists = filtered.includes(tag);
          const updated = exists
            ? filtered.filter((t) => t !== tag)
            : [...filtered, tag];
          return {
            ...m,
            dietaryTags: updated.length === 0 ? ["None"] : updated,
          };
        }),
      );
    },
    [],
  );

  const updateMemberCustomization = useCallback(
    (memberId: number, updates: Partial<GroupMember>) => {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === memberId ? { ...m, ...updates, added: true } : m,
        ),
      );
    },
    [],
  );

  const updateMemberDietaryTags = useCallback(
    (memberId: number, tags: DietaryTag[]) => {
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, dietaryTags: tags } : m)),
      );
    },
    [],
  );

  const value = useMemo(
    () => ({
      isLoggedIn,
      setIsLoggedIn,
      userEmail,
      setUserEmail,
      logout,
      members,
      activeMemberId,
      setActiveMemberId,
      profileTags,
      setProfileTags,
      addMember,
      removeMember,
      updateMemberName,
      toggleMemberDietaryTag,
      updateMemberCustomization,
      updateMemberDietaryTags,
      clearCart,
    }),
    [
      isLoggedIn,
      userEmail,
      logout,
      members,
      activeMemberId,
      profileTags,
      addMember,
      removeMember,
      updateMemberName,
      toggleMemberDietaryTag,
      updateMemberCustomization,
      updateMemberDietaryTags,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
