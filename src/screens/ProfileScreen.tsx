import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { COLORS, SPACING } from '../constants/theme';
import { BottomNav } from '../components/BottomNav';
import { useCart } from '../context/CartContext';

const ALL_DIETARY_OPTIONS = [
  'Vegan',
  'Nut allergy',
  'Lactose intolerance',
  'Gluten-free',
  'Halal',
  'Kosher',
  'Soy allergy',
  'Egg allergy',
  'Shellfish allergy',
  'Vegetarian',
];

export default function ProfileScreen() {
  const router = useRouter();
  const { userProfile, updateUserProfile } = useCart();

  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile.name);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>(
    userProfile.restrictions
  );

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || 'AB';
  };

  const toggleRestriction = (option: string) => {
    if (selectedRestrictions.includes(option)) {
      setSelectedRestrictions(selectedRestrictions.filter((r) => r !== option));
    } else {
      setSelectedRestrictions([...selectedRestrictions, option]);
    }
  };

  const filteredOptions = ALL_DIETARY_OPTIONS.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setIsEditingName(false);
    }
  };

  const handleSavePreferences = () => {
    updateUserProfile(nameInput.trim() || 'Adithya Baliga', selectedRestrictions);
    Alert.alert('Preferences Saved', 'Your dietary preferences have been updated.', [
      { text: 'OK', onPress: () => router.push('/') },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
            <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <View>
            <Text style={styles.screenTitle}>Dietary profile</Text>
            <Text style={styles.screenSubtitle}>A little care with every cup</Text>
          </View>
        </View>

        {/* Profile Card / Name Header */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{getInitials(nameInput)}</Text>
          </View>
          <View style={styles.profileInfo}>
            {isEditingName ? (
              <View style={styles.editNameRow}>
                <TextInput
                  style={styles.nameInput}
                  value={nameInput}
                  onChangeText={setNameInput}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleSaveName}
                />
                <TouchableOpacity onPress={handleSaveName} style={styles.saveNameIcon}>
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.nameDisplayRow}
                onPress={() => setIsEditingName(true)}
              >
                <Text style={styles.userName}>{nameInput}</Text>
                <Feather name="edit-2" size={16} color={COLORS.primary} style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            )}
            <Text style={styles.userSubtitle}>Used for individual & group orders</Text>
          </View>
        </View>

        {/* Conflict Notice Banner */}
        <View style={styles.noticeBanner}>
          <Feather name="shield" size={20} color={COLORS.primary} style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.noticeTitle}>We’ll flag choices that may conflict.</Text>
            <Text style={styles.noticeSubtitle}>Your profile helps you choose.</Text>
          </View>
        </View>

        {/* Dietary Restrictions Search Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dietary restrictions</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color={COLORS.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restrictions (e.g., Vegan, Halal)"
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Selectable Options List */}
        <View style={styles.optionsList}>
          {filteredOptions.map((option) => {
            const isSelected = selectedRestrictions.includes(option);
            return (
              <TouchableOpacity
                key={option}
                style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                onPress={() => toggleRestriction(option)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                  size={22}
                  color={isSelected ? COLORS.primary : COLORS.textMuted}
                  style={{ marginRight: 12 }}
                />
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Feature Explanations Card */}
        <View style={styles.explanationCard}>
          <View style={styles.explanationRow}>
            <Ionicons name="cafe-outline" size={20} color={COLORS.primary} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.explanationTitle}>Vegan — dairy & whip prompt</Text>
              <Text style={styles.explanationText}>
                When ordering, you'll be prompted to switch whipped cream to vegan whip and select a plant-based milk.
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.explanationRow}>
            <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.explanationTitle}>Nut allergy — hazelnut warning</Text>
              <Text style={styles.explanationText}>
                Hazelnut and other nut modifiers are flagged in group orders.
              </Text>
            </View>
          </View>
        </View>

        {/* Save Preferences Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSavePreferences} activeOpacity={0.85}>
          <Text style={styles.saveButtonText}>Save preferences</Text>
        </TouchableOpacity>

      </ScrollView>

      <BottomNav activeTab="Profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  screenSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  profileHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 20,
    marginBottom: SPACING.md,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
  profileInfo: {
    flex: 1,
  },
  nameDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  userSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  editNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
    paddingVertical: 2,
  },
  saveNameIcon: {
    paddingLeft: 8,
  },
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.badgeBg,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  noticeSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    marginBottom: SPACING.xs,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 25,
    paddingHorizontal: SPACING.lg,
    height: 44,
    marginVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  optionsList: {
    gap: 10,
    marginBottom: SPACING.xl,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionCardSelected: {
    backgroundColor: COLORS.badgeBg,
    borderColor: COLORS.primary,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  explanationCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  explanationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  saveButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: '700',
  },
});