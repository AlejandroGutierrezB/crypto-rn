import { useThemeColor } from '@/hooks/useThemeColor';
import { PriceSelector } from '@/screens/currencies/PriceSelector';
import PriceChart  from '@/screens/currencies/PriceChart';
import { useGetCurrencyDetails } from '@/services/api/useGetCurrencyDetails';
import { formatCurrency, formatNumber } from '@/utils/formater';
import React, { useMemo } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import {AddToFavouritesButton} from '@/components/AddToFavouritesButton';

const LoadingState = () => {
  const accentColor = useThemeColor({}, 'tint');

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={accentColor} />
    </View>
  );
}

export default function DetailsScreen({ id }: { id?: string }) {
  const { data, error, isLoading } = useGetCurrencyDetails(id);
  const currencyList = useMemo(() => Object.entries(data?.market_data?.current_price || {}), [data?.market_data?.current_price]);

  const backgroundColor = useThemeColor({}, 'background');
  const textPrimaryColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');

  if (isLoading) return <LoadingState />;
  if (error) return <Text>Error loading data</Text>;

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <PriceChart id={id} />

      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: textPrimaryColor }]}>{data?.name}</Text>
        <View style={styles.symbolContainer}>
          {data?.image?.small && <Image source={{ uri: data.image.small }} style={styles.symbolImage} />}
          <Text style={[styles.symbolText, { color: textSecondaryColor }]}>{data?.symbol.toUpperCase()}</Text>
          {data && <AddToFavouritesButton
            currency={data}
          />}
        </View>
      </View>

      <PriceSelector
        currencyList={currencyList}
        currentPriceMap={data?.market_data?.current_price || {}}
      />

      <InfoRow label="24h Change" value={`${data?.market_data?.price_change_percentage_24h}%`} />
      <InfoRow label="24h Trading Volume" value={formatCurrency(data?.market_data.total_volume?.usd)} />
      <InfoRow label="Market Cap" value={formatCurrency(data?.market_data.market_cap?.usd)} />
      <InfoRow
        label="Circulating Supply"
        value={`${formatNumber(data?.market_data.circulating_supply)}`}
      />
      <InfoRow
        label="Total Supply"
        value={data?.market_data.total_supply ?
          `${formatNumber(data.market_data.total_supply)}` :
          'N/A'
        }
      />
      <InfoRow label="All-Time High" value={formatCurrency(data?.market_data.ath?.usd)} />
      <InfoRow label="All-Time Low" value={formatCurrency(data?.market_data.atl?.usd)} />
      <View style={{paddingBottom: 60}} />
    </ScrollView>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string | number }) => {
  const textPrimaryColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');
  const cardBackgroundColor = useThemeColor({}, 'cardBackground');
  const shadowColor = useThemeColor({}, 'shadowColor');

  return (
    <View style={[styles.infoContainer, { backgroundColor: cardBackgroundColor, shadowColor }]}>
      <Text style={[styles.label, { color: textSecondaryColor }]}>{label}</Text>
      <Text style={[styles.value, { color: textPrimaryColor }]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbolImage: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  symbolText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
