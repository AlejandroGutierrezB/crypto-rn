import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useLocalSearchParams } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemedText } from '@/components/ThemedText';
import { Platform } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <QueryProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="currencies/[id]" options={({ route }) => ({
          headerShown: Platform.OS !== 'web',
          headerBackTitle: 'Back',
          headerTitle: () => {
            const { id } = route.params as { id: string };
            const formattedId = id?.charAt(0).toUpperCase() + id?.slice(1);
            return <ThemedText>{formattedId}</ThemedText>;
          },
        })}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      </QueryProvider>
    </ThemeProvider>
  );
}
