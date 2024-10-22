import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CryptoCyrrencyItem } from '@/screens/home/components/CryptoCyrrencyItem';
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
          renderItem={({ item }) => (<CryptoCyrrencyItem item={item} />)}
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
