import { ThemedText } from '@/components/ThemedText';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, useColorScheme } from 'react-native';

export const CurrencyListItem = ({isLoading, error}: {isLoading: boolean, error: Error | null}) => {
  const theme = useColorScheme()
  return(
    <BlurView intensity={80} tint={theme || "light"} style={[styles.container, {paddingTop: Platform.OS === "ios" ? 64 : 24}]} experimentalBlurMethod={'dimezisBlurView'}>
    <ThemedText type="subtitle">Top 10 Cryptocurrencies</ThemedText>
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
    paddingBottom: 24,
    width: "120%",
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
