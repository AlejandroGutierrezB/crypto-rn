import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Currency } from '@/services/api/useInfiniteCryptos';
import { SearchResult } from '@/services/api/useSearchCryptos';
import { CurrencyDetails } from '@/screens/currencies/CurrencyDetails.types';

export type CurrencyType = Currency | SearchResult | CurrencyDetails;

const FAVORITES_KEY = 'cryptoFavorites';

type FavoritesStorage = {
  [key: string]: CurrencyType;
};

const getFavorites = async (): Promise<FavoritesStorage> => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : {};
  } catch (error) {
    console.error('Error loading favorites:', error);
    return {};
  }
};

const saveFavorites = async (favorites: FavoritesStorage): Promise<FavoritesStorage> => {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return favorites;
  } catch (error) {
    console.error('Error saving favorites:', error);
    throw error;
  }
};

export const useFavorites = () => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: getFavorites,
    select: (data: FavoritesStorage) => Object.values(data) || [],
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (currency: CurrencyType) => {
      const currentFavorites = await getFavorites();
      const newFavorites = { ...currentFavorites };

      if (currency.id in newFavorites) {
        delete newFavorites[currency.id];
      } else {
        newFavorites[currency.id] = currency;
      }

      return saveFavorites(newFavorites);
    },
    onMutate: async (currency: CurrencyType) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['favorites'] });

      // Snapshot the previous value
      const previousFavorites = queryClient.getQueryData(['favorites']);

      // Optimistically update to the new value
      queryClient.setQueryData(['favorites'], (old: FavoritesStorage) => {
        const updated = { ...old };
        if (currency.id in updated) {
          delete updated[currency.id];
        } else {
          updated[currency.id] = currency;
        }
        return updated;
      });

      // Return context object with snapshot
      return { previousFavorites };
    },
    // If mutation fails, roll back to the previous value
    onError: (err, variables, context) => {
      queryClient.setQueryData(['favorites'], context?.previousFavorites);
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};

