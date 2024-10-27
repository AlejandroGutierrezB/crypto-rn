import { useGetCurrencyDetails } from '@/services/api/useGetCurrencyDetails';
import { formatCurrency, formatNumber } from '@/utils/formater';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, ScrollView, Image, FlatList, useWindowDimensions, Platform, Button } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import ErrorBoundary from 'react-native-error-boundary';

//Skeletons showing the underlying screen design while be better UX but for the sake of the exercise this is enough
const LoadingState = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

// First, create the new PriceSelector component
const PriceSelector = ({
  currencyList,
  currentPriceMap,
}: {
  currencyList: [string, number][],
  currentPriceMap: Record<string, number>,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState('usd');
  const currentPrice = currentPriceMap[selectedCurrency];

  const dropdownData = useMemo(() =>
    currencyList.map(([currency]) => ({
      label: currency.toUpperCase(),
      value: currency,
    })), [currencyList]
  );

  return (
    <View style={styles.infoContainer}>
      <Text style={styles.label}>Current Price</Text>
      <View style={styles.priceSelector}>
        <Text style={styles.priceText}>
          {formatCurrency(currentPrice, selectedCurrency)}
        </Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={dropdownData}
          maxHeight={300}
          labelField="label"
          valueField="value"
          value={selectedCurrency}
          onChange={item => {
            setSelectedCurrency(item.value);
          }}
        />
      </View>
    </View>
  );
};

export default function DetailsScreen({ id }: { id?: string }) {
  const { data, error, isLoading } = useGetCurrencyDetails(id);
  const currencyList = useMemo(() => Object.entries(data?.market_data?.current_price || {}), [data?.market_data?.current_price] );

  if (isLoading) return <LoadingState />;
  if (error) return <Text>Error loading data</Text>;


  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{data?.name}</Text>
        <View style={styles.symbolContainer}>
          {data?.image?.small && <Image source={{ uri: data.image.small }} style={styles.symbolImage} />}
          <Text style={styles.symbolText}>{data?.symbol.toUpperCase()}</Text>
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
        value={`${formatNumber(data?.market_data.circulating_supply)} ${data?.symbol.toUpperCase()}`}
      />
      <InfoRow
        label="Total Supply"
        value={data?.market_data.total_supply ?
          `${formatNumber(data.market_data.total_supply)} ${data?.symbol.toUpperCase()}` :
          'N/A'
        }
      />
      <InfoRow label="All-Time High" value={formatCurrency(data?.market_data.ath?.usd)} />
      <InfoRow label="All-Time Low" value={formatCurrency(data?.market_data.atl?.usd)} />
    </ScrollView>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
  <View style={styles.infoContainer}>
    <Text style={styles.label}>{label}</Text>
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
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
    padding: 16,
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
  priceContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  currentPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    width: 100, // Fixed width for the picker
  },
  priceSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  pickerWrapper: {
    width: 85,  // Smaller fixed width
    height: 35, // Fixed height
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  picker: {
    // width: Platform.OS === 'ios' ? '100%' : 85,
    width:  60,
    height: Platform.OS === 'ios' ? 35 : 35,
    marginTop: Platform.OS === 'ios' ? -8 : 0,
    marginLeft: Platform.OS === 'ios' ? -8 : 0,
  },
  pickerItem: {
    fontSize: 16,
    height: 35,
  },
  dropdown: {
    width:  70,
    height: 35,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#000',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#000',
    textTransform: 'uppercase',
  },
});
