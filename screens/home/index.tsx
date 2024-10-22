import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CurrencyListItem } from '@/screens/home/components/CurrencyListItem';
import { useFetchTopCryptos } from '@/services/api/useFetchTopCryptos';
import { Image } from 'expo-image';
import { FlatList, StyleSheet, View } from 'react-native';


export default function HomeScreen() {
  const { data, error, isLoading } = useFetchTopCryptos();

  return (
    <ThemedView style={{ flex: 1}} >
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={<CurrencyListItem isLoading={isLoading} error={error} />}
          stickyHeaderIndices={[0]}
          style={{ flex: 1 }}
          contentContainerStyle={styles.listContainer}
          contentOffset={{x: 0, y: 40}}
          renderItem={({ item }) => (
            <View style={styles.cryptoItem}>
              <Image
                style={styles.cryptoImage}
                source={item.image}
                contentFit="cover"
                transition={1000}
              />
              <View style={styles.cryptoInfo}>
                <ThemedText type="defaultSemiBold">{item.name} ({item.symbol.toUpperCase()})</ThemedText>
                <ThemedText>Price: ${item.current_price}</ThemedText>
                <ThemedText>Market Cap Rank: {item.market_cap_rank}</ThemedText>
                <ThemedText>24h Change: {item.price_change_percentage_24h}%</ThemedText>
                <ThemedText>7d Change: {item.ath_change_percentage}%</ThemedText>
              </View>
            </View>
          )}
        />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  cryptoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  cryptoImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
  },
  cryptoInfo: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  listHeader: {
    left: -16,
    paddingHorizontal: 16,
    paddingBottom: 24,
    width: "120%",
  },
});
