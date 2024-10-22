import { useQuery } from "@tanstack/react-query";

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
  ath:                              number;
  ath_change_percentage:            number;
  ath_date:                         Date;
  atl:                              number;
  atl_change_percentage:            number;
  atl_date:                         Date;
  roi:                              null;
  last_updated:                     Date;
}

export const fetchTopCryptos = async () => {
  const url = new URL('https://api.coingecko.com/api/v3/coins/markets');
  url.search = new URLSearchParams({
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: '10',
    page: '1',
  }).toString();

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};

export const useFetchTopCryptos = () => useQuery<Currency[]>({
    queryKey: ['topCryptos'],
    queryFn: fetchTopCryptos
  });
