import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import type { Perfume } from './types/perfume';
import { perfumeApi } from './lib/api';
import { SearchInput } from './components/SearchInput';
import { PerfumeCard } from './components/PerfumeCard';
import { PerfumeDetail } from './components/PerfumeDetail';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function PerfumeApp() {
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['perfumes', searchQuery],
    queryFn: () => searchQuery 
      ? perfumeApi.searchPerfumes(searchQuery)
      : perfumeApi.getAllPerfumes({ limit: 20 }),
    enabled: true,
  });

  const handlePerfumeSelect = (perfume: Perfume) => {
    setSelectedPerfume(perfume);
  };

  const handleBack = () => {
    setSelectedPerfume(null);
  };

  if (selectedPerfume) {
    return (
      <PerfumeDetail 
        perfume={selectedPerfume}
        onBack={handleBack}
        onPerfumeSelect={handlePerfumeSelect}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">
            Perfume Discovery
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Discover your next favorite fragrance with intelligent recommendations
          </p>
          
          <div className="max-w-2xl mx-auto">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by perfume name, brand, or notes..."
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {isLoading && (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-500" />
            <p className="text-gray-600">Searching perfumes...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Error loading perfumes</p>
            <p className="text-gray-500 text-sm">
              {error instanceof Error ? error.message : 'Something went wrong'}
            </p>
          </div>
        )}

        {data && (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                {searchQuery 
                  ? `Found ${data.total} perfumes matching "${searchQuery}"`
                  : `Showing ${data.perfumes.length} perfumes`
                }
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {data.perfumes.map((perfume) => (
                <PerfumeCard
                  key={perfume.id}
                  perfume={perfume}
                  onClick={handlePerfumeSelect}
                />
              ))}
            </div>

            {data.perfumes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No perfumes found</p>
                {searchQuery && (
                  <p className="text-gray-400 text-sm mt-2">
                    Try adjusting your search terms
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PerfumeApp />
    </QueryClientProvider>
  );
}

export default App;