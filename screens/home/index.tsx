import { ThemedView } from '@/components/ThemedView';
import { CryptoCurrencyItem } from '@/screens/home/components/CryptoCurrencyItem';
import { CurrencyListItem } from '@/screens/home/components/CurrencyListItem';
import { Currency, useInfiniteCryptos } from '@/services/api/useInfiniteCryptos';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    refetch,
  } = useInfiniteCryptos();

  const handlePress = (item: Currency) => {
    router.push(`/currencies/${item.id}`);
    }


  return (
    <ThemedView style={{ flex: 1 }}>
      {/* //FlashList will be more performant and same API but to ensure being able to run in expo GO will be avoided */}
      <FlatList
        data={data?.pages?.flat()}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<CurrencyListItem isLoading={!error && (isFetching ||isFetchingNextPage)} error={error} />}
        stickyHeaderIndices={[0]}
        style={{ flex: 1 }}
        contentContainerStyle={styles.listContainer}
        contentOffset={{ x: 0, y: 40 }}
        renderItem={( {item} ) => (
          <TouchableOpacity onPress={() => handlePress(item)}>
            <CryptoCurrencyItem item={item} />
          </TouchableOpacity>
        )}
        onEndReached={() => {
          if (hasNextPage) {
            fetchNextPage();
          }
        }}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={() => refetch()}/>}
        refreshing={isFetching}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator size="small" color="#0000ff" /> : null}
      />
    </ThemedView>
  );
}



const styles = StyleSheet.create({
  statusContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
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