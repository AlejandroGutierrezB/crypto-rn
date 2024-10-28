import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../index';
import { useInfiniteCryptos } from '@/services/api/useInfiniteCryptos';
import { router } from 'expo-router';

jest.mock('@/services/api/useInfiniteCryptos');
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

describe('HomeScreen', () => {
  const mockData = {
    pages: [[
      { id: '1', name: 'Bitcoin', symbol: 'BTC', current_price: 50000 },
      { id: '2', name: 'Ethereum', symbol: 'ETH', current_price: 3000 },
    ]],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with data', () => {
    (useInfiniteCryptos as jest.Mock).mockReturnValue({
      data: mockData,
      error: null,
      isFetching: false,
      isFetchingNextPage: false,
      hasNextPage: true,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    });

    const { getByText } = render(<HomeScreen />);
    expect(getByText('Bitcoin')).toBeTruthy();
    expect(getByText('Ethereum')).toBeTruthy();
  });

  it('navigates to currency detail when pressed', () => {
    (useInfiniteCryptos as jest.Mock).mockReturnValue({
      data: mockData,
      error: null,
      isFetching: false,
      isFetchingNextPage: false,
      hasNextPage: true,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    });

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

    const { getByText } = render(<HomeScreen />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('shows error state', () => {
    (useInfiniteCryptos as jest.Mock).mockReturnValue({
      data: null,
      error: {
        message: 'Error',
      },
    });

    const { getByText } = render(<HomeScreen />);
    expect(getByText('Error')).toBeTruthy();
  });
});
