import { useEffect } from "react";
import HomeScreen from "../screens/HomeScreen";
import { useCart } from "../context/CartContext";
import { router } from "expo-router";

export default function HomeRoute() {
  const { isLoggedIn } = useCart();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/Login");
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  return <HomeScreen />;
}
