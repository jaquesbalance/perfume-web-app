import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Search, Filter, Star, Heart } from 'lucide-react';
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

type SortOption = 'relevance' | 'name' | 'brand' | 'year';

function PerfumeApp() {
  const [selectedPerfume, setSelectedPerfume] = useState<Perfume | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');

  const { data, isLoading, error } = useQuery({
    queryKey: ['perfumes', searchQuery, selectedCategory],
    queryFn: async () => {
      console.log('🎯 Query triggered:', { searchQuery, selectedCategory });
      
      if (searchQuery) {
        console.log('📝 Executing search query:', searchQuery);
        return perfumeApi.searchPerfumes(searchQuery);
      } else if (selectedCategory && selectedCategory !== 'all') {
        console.log('🏷️ Executing category filter:', selectedCategory);
        return perfumeApi.getCategoryRecommendations(selectedCategory, 20);
      } else {
        console.log('📋 Executing featured perfumes query');
        return perfumeApi.getFeaturedPerfumes(12);
      }
    },
    enabled: true,
    staleTime: 0, // Temporarily disable caching to see fresh data
  });

  const handlePerfumeSelect = (perfume: Perfume) => {
    setSelectedPerfume(perfume);
  };

  const handleBack = () => {
    setSelectedPerfume(null);
  };

  // Sort perfumes based on selected option
  const sortedPerfumes = data?.perfumes ? [...data.perfumes].sort((a, b) => {
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
    setSelectedCategory(category);
    setSearchQuery(''); // Clear search when selecting category
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
      {/* Header Navigation */}
      <div className="header-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-slate-900">
                FragranceFind
              </h1>
            </div>
            
            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-slate-600 hover:text-slate-900 font-medium">Discover</a>
              <a href="#" className="text-slate-600 hover:text-slate-900 font-medium">Brands</a>
              <a href="#" className="text-slate-600 hover:text-slate-900 font-medium">Notes</a>
            </div>
            
            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-600 hover:text-slate-900">
                <Heart className="w-5 h-5" />
              </button>
              <button className="btn-primary">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Discover Your Perfect Fragrance
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Explore thousands of perfumes with intelligent recommendations based on your preferences
            </p>
          </div>
          
          {/* Enhanced Search */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by perfume name, brand, or fragrance notes..."
                className="w-full pl-12 pr-12 py-4 text-lg border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-sm"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Filter Chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`filter-chip ${
                  selectedCategory === category.id ? 'filter-chip-active' : ''
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                {error instanceof Error ? error.message : 'Please try again later'}
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