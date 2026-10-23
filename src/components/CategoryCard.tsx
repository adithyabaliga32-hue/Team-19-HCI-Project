import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';
import { Category } from '../data/homeData';

interface CategoryCardProps {
  category: Category;
  onPress?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  const renderIcon = () => {
    switch (category.iconType) {
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={category.iconName as any} size={28} color={COLORS.primary} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={category.iconName as any} size={24} color={COLORS.primary} />;
      default:
        return <Ionicons name={category.iconName as any} size={28} color={COLORS.primary} />;
    }
  }; // <--- Notice renderIcon ends here

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      {renderIcon()}
      <Text style={styles.label}>{category.label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.xs,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
  },
});