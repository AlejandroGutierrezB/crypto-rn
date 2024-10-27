import DetailsScreen from '@/screens/currencies/CurrencyDetails';
import { useLocalSearchParams } from 'expo-router';

export default function CurrencyScreen() {
  const {
    id,
  } = useLocalSearchParams<{ id: string; }>();

  return <DetailsScreen id={id} />;
}
