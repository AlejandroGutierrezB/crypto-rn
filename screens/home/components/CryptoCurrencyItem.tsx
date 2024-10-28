import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Currency } from '@/services/api/useInfiniteCryptos';
import { formatCurrency } from '@/utils/formater';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

const TendencyBlock = ({ value, label }: { value: number, label: string }) => {
  if (!value) return null;
  const isPositive = value >= 0;
  return (
    <View style={styles.changeItem}>
        <MaterialIcons
          name={isPositive ? 'trending-up' : 'trending-down'}
          size={16}
          color={isPositive ? '#4caf50' : '#f44336'}
        />
        <ThemedText
          style={[
            styles.cryptoChange,
            { color: isPositive ? '#4caf50' : '#f44336' },
          ]}
        >
          {label}: {value.toFixed(2)}%
        </ThemedText>
      </View>
  );
};

const CryptoChanges = ({ item }: { item: Currency }) => {
  return (
    <View style={styles.changeContainer}>
       <TendencyBlock value={item?.price_change_percentage_7d_in_currency || 0} label="7d" />
       <TendencyBlock value={item.price_change_percentage_24h} label="24h" />
    </View>
  );
};

const MarketCapRank = ({ rank }: { rank: number }) => {
  return (
    <ThemedText style={styles.cryptoRank} type="defaultSemiBold">
      #{rank}
    </ThemedText>
  );
};

const CryptoHeader = ({ item }: { item: Currency }) => {
  const backgroundColor = useThemeColor({ light: '#fff', dark: '#121212' }, 'background');
  return (
    <View style={styles.cryptoHeader}>
      <View style={styles.headerContent}>
        <Image
          style={[styles.cryptoImage, { backgroundColor }]}
          source={item.image}
          contentFit="contain"
          transition={1000}
        />
        <View>
          <ThemedText type="defaultSemiBold" style={styles.cryptoName}>
            {item.name}
          </ThemedText>
          <ThemedText style={styles.cryptoSymbol}>
            {item.symbol.toUpperCase()}
          </ThemedText>
        </View>
      </View>
      <View style={styles.cryptoPriceContainer}>
        <ThemedText style={styles.cryptoPrice} type="defaultSemiBold">
          {formatCurrency(item.current_price)}
        </ThemedText>
      </View>
    </View>
  );
};

const CryptoFooter = ({ item }: { item: Currency }) => {
  return (
    <View style={styles.footer}>
      <MarketCapRank rank={item.market_cap_rank} />
      <CryptoChanges item={item} />
    </View>
  );
};

const CryptoCurrencyItem = ({ item }: { item: Currency }) => {
  const backgroundColor = useThemeColor({}, 'cardBackground');
  const handlePress = () => {
    router.push(`/currencies/${item.id}`);
  };

  return (
    <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          }
        ]}
        android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
      >
          <View style={[styles.cryptoCard, { backgroundColor }]}>
        <CryptoHeader item={item} />
        <CryptoFooter item={item} />
    </View>
      </Pressable>
  );
};

export const MemoizedCryptoCurrencyItem = memo(CryptoCurrencyItem);

const styles = StyleSheet.create({
  cryptoCard: {
    padding: 12,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cryptoImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  cryptoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cryptoName: {
    fontSize: 16,
    marginBottom: 2,
  },
  cryptoSymbol: {
    fontSize: 12,
  },
  cryptoPriceContainer: {
    alignItems: 'flex-end',
  },
  cryptoPrice: {
    fontSize: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  cryptoRank: {
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 2,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  changeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  cryptoChange: {
    fontSize: 12,
    marginLeft: 4,
  },
});
