import { ThemedText } from '@/components/ThemedText';
import { BlurView } from 'expo-blur';
import { useState } from 'react';
import { Platform, StyleSheet, TextInput, useColorScheme } from 'react-native';

//https://api.coingecko.com/api/v3/search/geckoterminal_tokens?query=eth

interface CurrencyListHeaderProps {
  isLoading: boolean;
  error: Error | null;
  handleSubmit: (text: string) => void;
}

export const CurrencyListHeader = ({isLoading, error, handleSubmit}: CurrencyListHeaderProps) => {
  const theme = useColorScheme()

  return(
    <BlurView intensity={80} tint={theme || "light"} style={[styles.container, {paddingTop: Platform.OS === "ios" ? 64 : 24}]} experimentalBlurMethod={'dimezisBlurView'}>
    <ThemedText type="subtitle">Cryptocurrencies</ThemedText>
    <TextInput
      placeholder="Search"
      style={styles.searchInput}
      //we want to only search when the user presses the search button given we are limited by the API
      onSubmitEditing={(value) => {
        handleSubmit(value.nativeEvent.text);
      }}
      onChangeText={(text) => {
        if (text === '') {
          handleSubmit('');
        }
      }}
      returnKeyType="search"
      blurOnSubmit={true}
      autoCapitalize="none"
      autoCorrect={false}
      clearButtonMode='always'
    />
    {isLoading ? (
        <ThemedText>Loading...</ThemedText>
      ) : error ? (
        <ThemedText style={styles.errorText}>{error.message || "Error fetching data"}</ThemedText>
      ) : null}
  </BlurView>
  )
};

const styles = StyleSheet.create({
  container: {
    left: -16,
    paddingHorizontal: 16,
    width: "120%",
    gap: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '90%',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
});
