import { useGetCurrencyDetails } from '@/services/api/useGetCurrencyDetails';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View, ScrollView, Image, FlatList, useWindowDimensions } from 'react-native';

//Skeletons showing the underlying screen design while be better UX but for the sake of the exercise this is enough
const LoadingState = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

const formatCurrency = (amount: number | undefined, currency= 'USD', locale = 'en-US') => {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    notation: 'compact',
    currency: currency
  }).format(amount);
};

const formatNumber = (amount: number | undefined, locale = 'en-US') => {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(amount);
};



export default function DetailsScreen({ id }: { id?: string }) {
  const { data, error, isLoading } = useGetCurrencyDetails(id);
  const { width } = useWindowDimensions();

  if (isLoading) return <LoadingState />;
  if (error) return <Text>Error loading data</Text>;

  const isLargeScreen = width > 600;

  const infoItems = [
    { label: "Current Price", value: `${formatCurrency(data?.market_data.current_price?.usd)}` },
    { label: "Price (EUR)", value: `${formatCurrency(data?.market_data.current_price?.eur, 'EUR')}` },
    { label: "Price (GBP)", value: `${formatCurrency(data?.market_data.current_price?.gbp, 'GBP')}` },
    { label: "Market Cap", value: `${formatCurrency(data?.market_data.market_cap?.usd)}` },
    { label: "24h Trading Volume", value: `${formatCurrency(data?.market_data.total_volume?.usd)}` },
    { label: "24h Change", value: `${data?.market_data?.price_change_percentage_24h}%` },
    { label: "Circulating Supply", value: `${formatNumber(data?.market_data.circulating_supply)} ${data?.symbol.toUpperCase()}` },
    { label: "Total Supply", value: data?.market_data.total_supply ? `${formatNumber(data.market_data.total_supply)} ${data?.symbol.toUpperCase()}` : 'N/A' },
    { label: "All-Time High", value: `${formatCurrency(data?.market_data.ath?.usd)}` },
    { label: "All-Time Low", value: `${formatCurrency(data?.market_data.atl?.usd)}` },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{data?.name}</Text>
        <View style={styles.symbolContainer}>
          {data?.image?.small && <Image source={{ uri: data.image.small }} style={styles.symbolImage} />}
          <Text style={styles.symbolText}>{data?.symbol.toUpperCase()}</Text>
        </View>
      </View>
      <FlatList
        data={infoItems}
        renderItem={({ item }) => <InfoRow label={item.label} value={item.value} />}
        keyExtractor={(item) => item.label}
        numColumns={isLargeScreen ? 2 : 1}
        columnWrapperStyle={isLargeScreen ? styles.row : undefined}
      />
    </View>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
  <View style={styles.infoContainer}>
    <Text style={styles.label}>{label}: </Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: '#555',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  skeletonTitle: {
    height: 40,
    marginBottom: 24,
    borderRadius: 4,
  },
  skeletonInfo: {
    height: 20,
    marginBottom: 12,
    borderRadius: 4,
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
    color: '#555',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
