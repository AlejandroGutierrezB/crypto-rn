import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useInfiniteCryptos } from '@/services/api/useInfiniteCryptos';

global.fetch = jest.fn();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useInfiniteCryptos', () => {

  beforeEach(() => {
    queryClient.clear();
    jest.clearAllMocks();
  });

  it('fetches initial crypto data successfully', async () => {
    const mockResponse = [
      { id: '1', name: 'Bitcoin', symbol: 'BTC', current_price: 50000 },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useInfiniteCryptos(), { wrapper });

    await waitFor(() => {
      expect(result.current.data?.pages[0]).toEqual(mockResponse);
    });
  });

  it('handles error state', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => useInfiniteCryptos(), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toBeUndefined();
    });
  });
});
