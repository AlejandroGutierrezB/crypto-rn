import { useQuery } from '@tanstack/react-query';
import { GraphPoint } from 'react-native-graph';

interface Stats {
  stats: [number, number][];
}


export const useGetPriceChart = (id: string | undefined) => {
  return useQuery({
    queryKey: ['price-chart', id],
    //this won't work on web due to CORS but decent enough for this exercise in mobile
    queryFn: () => fetch(`https://www.coingecko.com/price_charts/${id}/usd/30_days.json`).then(res => res.json()),
    select: (data: Stats) => data.stats.map(([x, y]: [number, number]) => ({ day: new Date(x).toLocaleDateString(), price: y })),
    enabled: !!id,
  });
}
