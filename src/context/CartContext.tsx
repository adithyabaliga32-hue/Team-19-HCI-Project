import React, { createContext, useContext, useState } from 'react';
import { OrderSummaryData } from '../data/orderData';

export interface UserProfileState {
  name: string;
  restrictions: string[];
}

interface CartContextType {
  cartItem: OrderSummaryData | null;
  quickOrder: (item: OrderSummaryData) => void;
  clearCart: () => void;
  userProfile: UserProfileState;
  updateUserProfile: (name: string, restrictions: string[]) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItem, setCartItem] = useState<OrderSummaryData | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileState>({
    name: 'Adithya Baliga',
    restrictions: ['Vegan', 'Nut allergy'],
  });

  const quickOrder = (item: OrderSummaryData) => {
    setCartItem(item);
  };

  const clearCart = () => {
    setCartItem(null);
  };

  const updateUserProfile = (name: string, restrictions: string[]) => {
    setUserProfile({ name, restrictions });
  };

  return (
    <CartContext.Provider
      value={{
        cartItem,
        quickOrder,
        clearCart,
        userProfile,
        updateUserProfile,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};