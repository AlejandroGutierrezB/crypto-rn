import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSearchCryptos } from '../useSearchCryptos';

global.fetch = jest.fn();

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useSearchCryptos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not fetch data when searchQuery is empty', async () => {
    const { result } = renderHook(() => useSearchCryptos(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(true);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('should fetch cryptos successfully', async () => {
    const mockData = {coins:[
      {
        id: 'bitcoin',
        symbol: 'btc',
        name: 'Bitcoin',
        current_price: 50000,
      },
    ]};

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useSearchCryptos('bitcoin'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://api.coingecko.com/api/v3/search?query=bitcoin'
    );
    expect(result.current.data).toEqual(mockData.coins);
  });

  it('should handle rate limit error', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 429,
    });

    const { result } = renderHook(() => useSearchCryptos('bitcoin'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error('Rate limit exceeded. Please try again later.'));
  });

  it('should handle generic API error', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const { result } = renderHook(() => useSearchCryptos('bitcoin'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error('API error: 500'));
  });
});
