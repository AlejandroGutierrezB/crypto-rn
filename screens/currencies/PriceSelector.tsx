import { useThemeColor } from '@/hooks/useThemeColor';
import { formatCurrency } from '@/utils/formater';
import React, { useMemo, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';


export const PriceSelector = ({
  currencyList,
  currentPriceMap,
}: {
  currencyList: [string, number][],
  currentPriceMap: Record<string, number>,
}) => {
  const backgroundColor = useThemeColor({}, 'cardBackground');
  const textPrimaryColor = useThemeColor({}, 'text');
  const textSecondaryColor = useThemeColor({}, 'textSecondary');

  const [selectedCurrency, setSelectedCurrency] = useState('usd');
  const currentPrice = currentPriceMap[selectedCurrency];

  const dropdownData = useMemo(() =>
    currencyList.map(([currency]) => ({
      label: currency.toUpperCase(),
      value: currency,
    })), [currencyList]
  );

  return (
    <View style={[styles.infoContainer, { backgroundColor }]}>
      <Text style={[styles.label, { color: textSecondaryColor }]}>Current Price</Text>
      <View style={styles.priceSelector}>
        <Text style={[styles.priceText, {color: textPrimaryColor}]}>
          {formatCurrency(currentPrice, selectedCurrency)}
        </Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={[styles.placeholderStyle, {color: textSecondaryColor}]}
          selectedTextStyle={[styles.selectedTextStyle, {color: textPrimaryColor}]}
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

const styles = StyleSheet.create({
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
    width:  '100%',
    height: Platform.OS === 'ios' ? 35 : 35,
  },
  pickerItem: {
    fontSize: 16,
    height: 35,
  },
  dropdown: {
    width:  70,
    height: 35,
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
    color: '#fff',
    textTransform: 'uppercase',
  },
});
