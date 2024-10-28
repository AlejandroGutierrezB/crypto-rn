import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../index';
import { router } from 'expo-router';
import { useInfiniteCryptos } from '@/services/api/useInfiniteCryptos';
import { useSearchCryptos } from '@/services/api/useSearchCryptos';

jest.mock('@/services/api/useInfiniteCryptos');
jest.mock('@/services/api/useSearchCryptos');
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

describe('HomeScreen', () => {
  const mockData = {
    pages: [[
      { id: '1', name: 'Bitcoin', symbol: 'BTC', current_price: 50000, price_change_percentage_24h: 5.5 },
      { id: '2', name: 'Ethereum', symbol: 'ETH', current_price: 3000, price_change_percentage_24h: -2.3 },
    ]],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Add default mock implementations for both hooks
    (useInfiniteCryptos as jest.Mock).mockReturnValue({
      data: mockData,
      error: null,
      isFetching: false,
      isFetchingNextPage: false,
      hasNextPage: true,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    });
    (useSearchCryptos as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      isFetching: false,
    });
  });

  it('renders correctly with data', () => {
    const { getByText } = render(<HomeScreen />);

    expect(getByText('Bitcoin')).toBeTruthy();
    expect(getByText('Ethereum')).toBeTruthy();
    expect(getByText('$50K')).toBeTruthy();
    expect(getByText('$3K')).toBeTruthy();

  });

  it('navigates to currency detail when pressed', () => {
    const { getByText } = render(<HomeScreen />);
    fireEvent.press(getByText('Bitcoin'));

    expect(router.push).toHaveBeenCalledWith('/currencies/1');
  });


  it('shows loading state', () => {
    (useInfiniteCryptos as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      isFetching: true,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    });
    // Make sure search is also not loading
    (useSearchCryptos as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      isFetching: false,
    });

    const { getByText } = render(<HomeScreen />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('shows error state', () => {
    (useInfiniteCryptos as jest.Mock).mockReturnValue({
      data: null,
      error: {
        message: 'Error',
      },
      isFetching: false,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    });
    // Make sure search has no errors
    (useSearchCryptos as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      isFetching: false,
    });

    const { getByText } = render(<HomeScreen />);
    expect(getByText('Error')).toBeTruthy();
  });

  it('displays search results when submiting searching', async () => {
    const searchResults = [
      { id: '3', name: 'Cardano', symbol: 'ADA', current_price: 1.2, price_change_percentage_24h: 3.1 },
      { id: '4', name: 'Polkadot', symbol: 'DOT', current_price: 15.8, price_change_percentage_24h: -1.2 },
    ];

    (useSearchCryptos as jest.Mock).mockReturnValue({
      data: searchResults,
      error: null,
      isFetching: false,
    });

    const { getByPlaceholderText, getByText, queryByText } = render(<HomeScreen />);
    const searchInput = getByPlaceholderText('Search');

    fireEvent(searchInput, 'submitEditing', { nativeEvent: { text: 'ada' } });


    // Original list items should not be visible
    expect(queryByText('Bitcoin')).toBeNull();
    expect(queryByText('Ethereum')).toBeNull();

    // Search results should be visible
    expect(getByText('Cardano')).toBeTruthy();
    expect(getByText('$1.2')).toBeTruthy();
  });

  it('shows loading state while searching', () => {
    (useSearchCryptos as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      isFetching: true,
    });

    const { getByPlaceholderText, getByText } = render(<HomeScreen />);
    const searchInput = getByPlaceholderText('Search');

    fireEvent(searchInput, 'submitEditing', { nativeEvent: { text: 'ada' } });

    expect(getByText('Loading...')).toBeTruthy();
  });
});
