import DetailsScreen from '@/screens/currencies/details';
import { useLocalSearchParams } from 'expo-router';

export default function CurrencyScreen() {
  const {
    id,
  } = useLocalSearchParams<{ id: string; }>();

  return <DetailsScreen id={id} />;
}
