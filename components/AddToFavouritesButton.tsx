import { CurrencyType, useFavorites, useToggleFavorite } from '@/hooks/useGetFavouriteCurrencies';
import { useThemeColor } from '@/hooks/useThemeColor';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';



interface AddToFavouritesButtonProps {
  currency: CurrencyType;
  size?: number;
}

export const AddToFavouritesButton = ({ currency, size = 24 }: AddToFavouritesButtonProps) => {
  const accentColor = useThemeColor({}, 'tint');
  const { data: favorites = [] } = useFavorites();
  const { mutate: toggleFavorite, isPending } = useToggleFavorite();

  const isFavorite = useMemo(() => favorites.some((fav: CurrencyType) => fav.id === currency.id), [favorites, currency] );

  return (
    <Pressable
      onPress={() => toggleFavorite(currency)}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed
      ]}
      hitSlop={8}
    >
      {({ pressed }) => (
        isFavorite ? (
          <Ionicons
          name='star'
            size={size}
            color={accentColor}
            style={[
              styles.icon,
              pressed && styles.pressedIcon
            ]}
          />
        ) : (
          <Ionicons
            name='star-outline'
            size={size}
            color={accentColor}
            style={[
              styles.icon,
              pressed && styles.pressedIcon
            ]}
          />
        )
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    transform: [{ scale: 0.96 }],
  },
  icon: {
    transform: [{ scale: 1 }],
  },
  pressedIcon: {
    opacity: 0.8,
  },
});
