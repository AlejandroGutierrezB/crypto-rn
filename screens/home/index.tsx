import { ThemedView } from '@/components/ThemedView';
import { CryptoCyrrencyItem } from '@/screens/home/components/CryptoCyrrencyItem';
import { CurrencyListItem } from '@/screens/home/components/CurrencyListItem';
import { Currency, useFetchTopCryptos } from '@/services/api/useFetchTopCryptos';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const { data, error, isLoading } = useFetchTopCryptos();
  const router = useRouter();

  const handlePress = (item: Currency) => {
    router.push(`/currencies/${item.id}`);
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<CurrencyListItem isLoading={isLoading} error={error} />}
        stickyHeaderIndices={[0]}
        style={{ flex: 1 }}
        contentContainerStyle={styles.listContainer}
        contentOffset={{ x: 0, y: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePress(item)}>
            <CryptoCyrrencyItem item={item} />
          </TouchableOpacity>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  listHeader: {
    left: -16,
    paddingHorizontal: 16,
    paddingBottom: 24,
    width: '120%',
  },
});
