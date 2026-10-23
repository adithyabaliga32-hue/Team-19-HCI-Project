export interface OrderCustomization {
  label: string;
  value: string;
  extraCharge?: string;
}

export interface UserDietaryProfile {
  allergies: string[];
  preferences: string[];
}

export interface OrderSummaryData {
  title: string;
  category: string;
  quantity: number;
  basePrice: number;
  customizations: OrderCustomization[];
  locationName: string;
  locationDetails: string;
  estimatedTime: string;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  total: number;
}

export const MOCK_USER_PROFILE: UserDietaryProfile = {
  allergies: ['Nut allergy'],
  preferences: ['Vegan'],
};

export const MOCK_ORDER_SUMMARY: OrderSummaryData = {
  title: 'Oat Latte',
  category: 'Caffè Latte',
  quantity: 1,
  basePrice: 5.45,
  customizations: [
    { label: 'Size', value: 'Grande · 16 fl oz' },
    { label: 'Temperature', value: 'Hot' },
    { label: 'Milk', value: 'Oat milk', extraCharge: '+$0.70' },
    { label: 'Topping', value: 'Vegan whip', extraCharge: 'no extra charge' },
  ],
  locationName: 'Starbucks UTD',
  locationDetails: 'Student Union · Pickup counter',
  estimatedTime: 'Ready in 10 min',
  paymentMethod: 'Visa ending 1234',
  subtotal: 5.45,
  tax: 0.45,
  total: 5.90,
};