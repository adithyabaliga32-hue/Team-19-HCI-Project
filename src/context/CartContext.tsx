import React, { createContext, useContext, useState } from 'react';
import { OrderSummaryData } from '../data/orderData';

interface CartContextType {
  cartItem: OrderSummaryData | null;
  quickOrder: (item: OrderSummaryData) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItem, setCartItem] = useState<OrderSummaryData | null>(null);

  const quickOrder = (item: OrderSummaryData) => {
    setCartItem(item);
  };

  const clearCart = () => {
    setCartItem(null);
  };

  return (
    <CartContext.Provider value={{ cartItem, quickOrder, clearCart }}>
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