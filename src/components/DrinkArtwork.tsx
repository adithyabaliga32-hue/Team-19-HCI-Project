import React, { memo } from "react";
import { Image } from "react-native";
import Svg, { Path } from "react-native-svg";

function DrinkArtworkComponent({
  drink,
  size,
}: {
  drink: string;
  size: number;
}) {
  const photoByDrink: Record<string, any> = {
    "Caramel Macchiato": require("../../assets/drinks/starbucks-caramel-macchiato.png"),
    "Caffè Mocha": require("../../assets/drinks/starbucks-caffe-mocha.png"),
    "Iced Matcha Latte": require("../../assets/drinks/starbucks-iced-matcha-latte.png"),
    "Brown Milk Sugar Boba": require("../../assets/drinks/teaco-brown-milk-sugar-boba.png"),
    "Black Milk Tea": require("../../assets/drinks/teaco-black-milk-tea.png"),
    "Matcha Milk Tea": require("../../assets/drinks/teaco-matcha-milk-tea.png"),
    "Strawberry Milk Tea": require("../../assets/drinks/teaco-strawberry-milk-tea.png"),
    "Peach Iced Tea": require("../../assets/drinks/teaco-peach-iced-tea.png"),
    "Honey Lemon Tea": require("../../assets/drinks/teaco-honey-lemon-tea.png"),
  };

  const photo = photoByDrink[drink];

  if (photo) {
    return (
      <Image
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
        : null;

  if (illustrationColor) {
    return (
      <Svg width={size} height={size} viewBox="0 0 100 100">
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
      </Svg>
    );
  }

  const fallbackSource = drink.includes("Cold Brew")
    ? require("../../assets/drinks/cold-brew.png")
    : drink.includes("Americano")
      ? require("../../assets/drinks/americano.png")
      : require("../../assets/drinks/latte.png");

  return (
    <Image
      source={fallbackSource}
      resizeMode="cover"
      style={{ width: size, height: size, borderRadius: size * 0.2 }}
    />
  );
}

export const DrinkArtwork = memo(DrinkArtworkComponent);
