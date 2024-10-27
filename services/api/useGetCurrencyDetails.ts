import { CurrencyDetails } from "@/screens/currencies/CurrencyDetails.types";
import { useQuery } from "@tanstack/react-query";

const fetchCurrencyDetails = async (id: string | undefined) => {
  const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const useGetCurrencyDetails = (id: string| undefined) => {
  return useQuery<CurrencyDetails>({
    queryKey: ['currencyDetails', id],
    queryFn: () => fetchCurrencyDetails(id),
    enabled: !!id,
  });
}
