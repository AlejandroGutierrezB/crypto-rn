import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function DetailsScreen({ id }: { id?: string }) {
  if (!id) {
    return null;
  }
  const item = {
    id,
    name: 'Bitcoin',
    symbol: 'BTC',
    current_price: 30000,
    market_cap_rank: 1,
    price_change_percentage_24h: 10,
    ath_change_percentage: 100,
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.name}</Text>
      <Text>Symbol: {item.symbol.toUpperCase()}</Text>
      <Text>Current Price: ${item.current_price}</Text>
      <Text>Market Cap Rank: {item.market_cap_rank}</Text>
      <Text>24h Change: {item.price_change_percentage_24h}%</Text>
      <Text>7d Change: {item.ath_change_percentage}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
