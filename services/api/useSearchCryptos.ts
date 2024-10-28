import { useQuery } from '@tanstack/react-query';

export interface SearchResult {
  id: string;
  name: string;
  api_symbol: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  large: string;
}

const fetchCryptos = async (searchQuery = ''): Promise<{coins: SearchResult[]}> => {
  const url =
  `https://api.coingecko.com/api/v3/search?query=${searchQuery}`;

  const response = await fetch(url
  );

  if (response.status === 429) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
};

export const useSearchCryptos = (searchQuery?: string) => {
  return useQuery({
    queryKey: ['search', 'cryptos', searchQuery],
    queryFn: () => fetchCryptos(searchQuery),
    enabled: !!searchQuery,
    retry: false,
    select: (data) => data.coins,
  });
};
