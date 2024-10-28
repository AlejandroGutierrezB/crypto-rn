import { ThemedView } from '@/components/ThemedView';
import { MemoizedCryptoCurrencyItem } from '@/screens/home/components/CryptoCurrencyItem';
import { CurrencyListHeader } from '@/screens/home/components/CurrencyListHeader';
import { Currency, useInfiniteCryptos } from '@/services/api/useInfiniteCryptos';
import { useSearchCryptos } from '@/services/api/useSearchCryptos';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isRefetching,
    refetch,
  } = useInfiniteCryptos();

  const {
    data: searchData,
    error: searchError,
    isFetching: searchIsFetching,
  } = useSearchCryptos(searchQuery);

  const combinedError = error || searchError;
  const combinedIsFetching = isFetching || searchIsFetching;

  const handleSubmitSearch = useCallback((text: string) => {
    setSearchQuery(text);
    refetch();
  }, [searchQuery]);

  return (
    <ThemedView style={{ flex: 1 }}>
      {/* //FlashList will be more performant and same API but to ensure being able to run in expo GO will be avoided */}
      <FlatList
        testID='crypto-list'
        data={searchQuery ? (searchData as unknown as Currency[]) : data?.pages?.flat()}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<CurrencyListHeader isLoading={!combinedError && (combinedIsFetching ||isFetchingNextPage)} error={combinedError} handleSubmit={handleSubmitSearch} />}
        stickyHeaderIndices={[0]}
        style={{ flex: 1 }}
        contentContainerStyle={styles.listContainer}
        contentOffset={{ x: 0, y: 40 }}
        renderItem={( {item} ) => <MemoizedCryptoCurrencyItem item={item} />}
        onEndReached={() => {
          if (hasNextPage && !searchQuery) {
            fetchNextPage();
          }
        }}
        refreshControl={searchQuery ? undefined:<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()}/>}
        refreshing={isRefetching}
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