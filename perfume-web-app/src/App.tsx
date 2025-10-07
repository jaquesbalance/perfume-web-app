import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Sparkles, Target, CheckCircle2, Search } from 'lucide-react';
import type { Perfume } from './types/perfume';
import { perfumeApi } from './lib/api';
import { SearchAutocomplete } from './components/SearchAutocomplete';
import { PerfumeCard } from './components/PerfumeCard';
import { PerfumeDetail } from './components/PerfumeDetail';
import { PreferenceInsights } from './components/PreferenceInsights';
import { useFeedback } from './hooks/useFeedback';
import { validateCategory, sanitizeErrorMessage } from './lib/validation';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

type SortOption = 'relevance' | 'name' | 'brand' | 'year';

function PerfumeApp() {
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const { feedback } = useFeedback();

  const { data, isLoading, error } = useQuery({
    queryKey: ['perfumes', searchQuery, selectedCategory],
    queryFn: async () => {
      if (searchQuery) {
        return perfumeApi.searchPerfumes(searchQuery);
      } else if (selectedCategory && selectedCategory !== 'all') {
        return perfumeApi.getCategoryRecommendations(selectedCategory, 20);
      } else {
        return perfumeApi.getFeaturedPerfumes(12);
      }
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  const handlePerfumeSelect = (perfume: Perfume) => {
    setSelectedPerfume(perfume);
  };

  const handleBack = () => {
    setSelectedPerfume(null);
  };

  // Filter out rejected perfumes and sort
  const sortedPerfumes = data?.perfumes ? [...data.perfumes]
    .filter(perfume => !feedback.rejected.includes(perfume.id)) // Filter out rejected
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.title || a.name).localeCompare(b.title || b.name);
        case 'brand':
          return a.brand.localeCompare(b.brand);
        case 'year':
          const yearA = parseInt(String(a.year)) || 0;
          const yearB = parseInt(String(b.year)) || 0;
          return yearB - yearA; // Newest first
        case 'relevance':
        default:
          return 0; // Keep original order
      }
    }) : [];

  const handleCategoryChange = (category: string) => {
    // Validate category before setting
    if (validateCategory(category)) {
      setSelectedCategory(category);
      setSearchQuery(''); // Clear search when selecting category
    }
  };

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'floral', label: 'Floral' },
    { id: 'woody', label: 'Woody' },
    { id: 'fresh', label: 'Fresh' },
    { id: 'oriental', label: 'Oriental' },
    { id: 'fruity', label: 'Fruity' },
    { id: 'gourmand', label: 'Gourmand' },
  ];

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
    <div className="min-h-screen bg-slate-50">
      {/* Header Navigation - Simplified */}
      <div className="header-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            {/* Logo - Centered */}
            <h1 className="text-2xl font-bold text-slate-900">
              FragranceFind
            </h1>
          </div>
        </div>
      </div>

      {/* Hero Section - Redesigned with "Start With One" approach */}
      <div className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Name one perfume you love.<br />
              We'll find 1,000 more.
            </h2>
          </div>

          {/* Large Prominent Search with Autocomplete */}
          <SearchAutocomplete
            value={searchQuery}
            onChange={setSearchQuery}
            onSelect={handlePerfumeSelect}
            placeholder="Try 'Chanel No. 5' or 'Bleu de Chanel'..."
            className="max-w-3xl mx-auto mb-8"
          />

          {/* OR Divider */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px bg-slate-300 w-20"></div>
            <span className="text-slate-500 font-medium">OR explore by</span>
            <div className="h-px bg-slate-300 w-20"></div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.filter(c => c.id !== 'all').map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white shadow-lg scale-105'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border-2 border-slate-200 hover:border-primary-300'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-16 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-12">
            How It Works
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">
                Tell us one perfume you like
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Search for any fragrance you already know and love. Even just one is enough to get started.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">
                We analyze fragrance notes
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Our algorithm examines the scent profile, notes, and characteristics to understand what you enjoy.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">
                Discover perfect matches
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Get personalized recommendations with similarity scores showing exactly why each fragrance matches your taste.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Preference Insights - Show after 3+ ratings */}
        {data?.perfumes && <PreferenceInsights allPerfumes={data.perfumes} />}
        {isLoading && (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-500" />
            <p className="text-slate-600 text-lg">Finding your perfect fragrance...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-700 font-semibold mb-2">Unable to load perfumes</p>
              <p className="text-red-600 text-sm">
                {sanitizeErrorMessage(error)}
              </p>
            </div>
          </div>
        )}

        {data && (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {searchQuery 
                    ? `Search Results for "${searchQuery}"`
                    : selectedCategory !== 'all'
                    ? `${categories.find(c => c.id === selectedCategory)?.label} Perfumes`
                    : 'Featured Perfumes'
                  }
                </h3>
                <p className="text-slate-600 mt-1">
                  {searchQuery 
                    ? `${data.total} perfumes found`
                    : selectedCategory !== 'all'
                    ? `${sortedPerfumes.length} ${selectedCategory} perfumes`
                    : `${sortedPerfumes.length} perfumes available`
                  }
                </p>
              </div>
              
              {/* Sort Options */}
              <div className="flex items-center space-x-4">
                <select 
                  className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                >
                  <option value="relevance">Sort by: Relevance</option>
                  <option value="name">Name A-Z</option>
                  <option value="brand">Brand</option>
                  <option value="year">Year</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
              {sortedPerfumes.map((perfume) => (
                <PerfumeCard
                  key={perfume.id}
                  perfume={perfume}
                  onClick={handlePerfumeSelect}
                />
              ))}
            </div>

            {/* Empty State */}
            {sortedPerfumes.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No perfumes found</h3>
                <p className="text-slate-600 mb-4">
                  {searchQuery
                    ? `We couldn't find any perfumes matching "${searchQuery}"`
                    : 'No perfumes available at the moment'
                  }
                </p>
                {(searchQuery || selectedCategory !== 'all') && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="btn-primary"
                  >
                    Show All Perfumes
                  </button>
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