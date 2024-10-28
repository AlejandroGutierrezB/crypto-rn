import { useInfiniteQuery } from '@tanstack/react-query';

export interface Currency {
  id:                               string;
  symbol:                           string;
  name:                             string;
  image:                            string;
  current_price:                    number;
  market_cap:                       number;
  market_cap_rank:                  number;
  fully_diluted_valuation:          number;
  total_volume:                     number;
  high_24h:                         number;
  low_24h:                          number;
  price_change_24h:                 number;
  price_change_percentage_24h:      number;
  market_cap_change_24h:            number;
  market_cap_change_percentage_24h: number;
  circulating_supply:               number;
  total_supply:                     number;
  max_supply:                       number;
  price_change_percentage_7d_in_currency?: number;
  ath:                              number;
  ath_change_percentage:            number;
  ath_date:                         Date;
  atl:                              number;
  atl_change_percentage:            number;
  atl_date:                         Date;
  roi:                              null;
  last_updated:                     Date;
}

const fetchCryptos = async ({ pageParam = 1 }): Promise<Currency[]> => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10&price_change_percentage=7d&page=${pageParam}`
  );

  if (response.status === 429) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};

export const useInfiniteCryptos = () => {
  return useInfiniteQuery({
    queryKey: ['cryptos'],
    queryFn: fetchCryptos,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === 10 ? pages.length + 1 : undefined;
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
