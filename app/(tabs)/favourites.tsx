import { AddToFavouritesButton } from '@/components/AddToFavouritesButton';
import { CurrencyType, useFavorites } from '@/hooks/useGetFavouriteCurrencies';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const EmptyState = ({ textColor }: { textColor: string }) => (
  <View style={styles.centerContainer}>
    <Text style={[styles.emptyText, { color: textColor }]}>No favorites yet</Text>
  </View>
);

const RenderItem = ({ item, textColor }: { item: CurrencyType, textColor: string }) => (
  <Pressable
    style={({ pressed }) => [
      styles.itemContainer,
      pressed && styles.pressed
    ]}
    onPress={() => router.push(`/currencies/${item.id}`)}
  >
    <View style={styles.currencyInfo}>
          <Text style={[styles.name, { color: textColor }]}>{item.name}</Text>
          <Text style={[styles.symbol, { color: textColor }]}>{item?.symbol?.toUpperCase()}</Text>
    </View>
    <AddToFavouritesButton
      currency={item}
      size={24}
    />
  </Pressable>
);

const LoadingState = ({ accentColor }: { accentColor: string }) => (
  <SafeAreaView style={{ flex: 1 }}>
  <View style={styles.centerContainer}>
    <ActivityIndicator size="large" color={accentColor} />
    </View>
  </SafeAreaView>
);

const ErrorState = ({ textColor, error }: { textColor: string, error: Error | undefined }) => (
  <SafeAreaView style={{ flex: 1 }}>
  <View style={styles.centerContainer}>
    <Text style={[styles.errorText, { color: textColor }]}>{error?.message}</Text>
    </View>
  </SafeAreaView>
);


export const FavoritesScreen = () => {
  const { data: favorites = [], isLoading, error, refetch } = useFavorites();
  const accentColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');


  if (isLoading) return <LoadingState accentColor={accentColor} />;
  if (error) return <ErrorState textColor={textColor} error={error} />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <FlatList
      data={favorites}
      ListHeaderComponent={<Text style={{ color: textColor, fontSize: 20, fontWeight: 'bold', marginTop: Platform.OS === 'android' ? 16 : 0 }}>Favorites</Text>}
      ListEmptyComponent={<EmptyState textColor={textColor} />}
      renderItem={({ item }) => <RenderItem item={item} textColor={textColor}/>}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refetch}
          tintColor={accentColor}
        />
      }
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  currencyInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  symbol: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.7,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});

export default FavoritesScreen;
