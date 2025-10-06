import type { Perfume, ApiResponse, SearchParams, ImageMetadata } from '../types/perfume';
import { formatNotes } from './note-formatter';

const API_BASE_URL = 'http://localhost:3000';

// Transform perfume data from API
function transformPerfume(perfume: any): Perfume {
  if (!perfume) {
    console.warn('⚠️ No perfume data to transform');
    return {} as Perfume;
  }

  // Handle Neo4j node structure - data is in properties
  const props = perfume.properties || perfume;
  
  // Helper to parse note strings - split only on commas, preserve compound notes
  const parseNotes = (noteString: string | string[]): string[] => {
    if (Array.isArray(noteString)) {
      return formatNotes(noteString);
    }
    if (!noteString) return [];

    const rawNotes = noteString
      .split(',')  // Split only on commas, NOT whitespace
      .map(note => note.trim())  // Trim whitespace from each note
      .filter(Boolean);  // Remove empty strings

    return formatNotes(rawNotes);  // Apply formatting and deduplication
  };

  // Extract notes from the Neo4j format
  const notes = props.notes || {
    top: parseNotes(props.top_notes),
    middle: parseNotes(props.middle_notes),
    base: parseNotes(props.base_notes),
  };

  // Handle Neo4j integer format for year and id
  let year = props.year;
  if (year && typeof year === 'object' && 'low' in year) {
    year = year.low;
  }
  
  let id = props.id || perfume.identity?.low?.toString();
  if (perfume.identity && typeof perfume.identity === 'object' && 'low' in perfume.identity) {
    id = perfume.identity.low.toString();
  }

  const transformed = {
    id: id,
    title: props.title,
    name: props.name || props.title,
    brand: props.brand,
    description: props.description,
    year: year,
    imgId: props.imgId,
    imageMetadata: props.imageMetadata,
    sourceUrl: props.sourceUrl,
    top_notes: props.top_notes,
    middle_notes: props.middle_notes,
    base_notes: props.base_notes,
    notes,
  };
  
  return transformed;
}

// Simple image URL cache for signed URLs
class ImageUrlCache {
  private cache = new Map<string, { url: string; expires: number }>();
  private readonly CACHE_DURATION = 50 * 60 * 1000; // 50 minutes (URLs expire in 1 hour)

  get(key: string): string | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() < cached.expires) {
      return cached.url;
    }
    if (cached) {
      this.cache.delete(key); // Remove expired entry
    }
    return null;
  }

  set(key: string, url: string): void {
    this.cache.set(key, {
      url,
      expires: Date.now() + this.CACHE_DURATION
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

const imageCache = new ImageUrlCache();

export const perfumeApi = {
  // Get featured perfumes for homepage - with timeout fallback
  async getFeaturedPerfumes(limit: number = 12): Promise<{ perfumes: Perfume[]; total: number }> {
    try {
      // Try featured endpoint with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout for faster UX
      
      const response = await fetch(`${API_BASE_URL}/api/perfumes/featured?limit=${limit}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      
      if (data.data && data.data.length > 0) {
        return {
          perfumes: data.data.map(transformPerfume),
          total: data.pagination?.total || data.data.length,
        };
      }
    } catch (error) {
      console.warn('Featured endpoint failed or timed out, falling back to regular perfumes:', error);
    }
    
    // Fallback to regular perfumes with imageMetadata
    console.log('Using fallback: regular perfumes with random selection');
    const fallback = await this.getAllPerfumes({ limit, random: true });
    return {
      perfumes: fallback.perfumes,
      total: fallback.total,
    };
  },

  // Fast image URL generation using exact extension from metadata
  async getImageSignedUrl(imgId: string, imageMetadata?: ImageMetadata): Promise<string> {
    // Use exact extension from metadata - no more guessing!
    const extension = imageMetadata?.extension || '.jpg';
    const cacheKey = `${imgId}${extension}`;
    
    // Check cache first
    const cachedUrl = imageCache.get(cacheKey);
    if (cachedUrl) {
      return cachedUrl;
    }

    try {
      // Add timeout for faster failure
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout per image
      
      const response = await fetch(`${API_BASE_URL}/api/images/signed-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          bucket: 'bourgeon',
          key: `img/${imgId}${extension}`,
          expires: 3600,
        }),
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        // Don't log warnings for 404s - many images don't exist
        if (response.status !== 404) {
          console.warn(`Failed to get signed URL for ${imgId}${extension}:`, response.status);
        }
        return '';
      }
      
      const data = await response.json();
      if (data.status === 'success' && data.url) {
        imageCache.set(cacheKey, data.url);
        return data.url;
      }
    } catch (error) {
      // Don't log timeout errors - they're expected
      if (!error.name?.includes('Abort')) {
        console.warn(`Error getting signed URL for ${imgId}${extension}:`, error);
      }
    }
    
    return '';
  },

  // Get all perfumes with optional filtering
  async getAllPerfumes(params?: SearchParams & { random?: boolean; withImages?: boolean }): Promise<{ perfumes: Perfume[]; total: number; page: number; limit: number }> {
    const searchParams = new URLSearchParams();
    
    if (params?.query) searchParams.set('search', params.query);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params?.brand?.length) searchParams.set('brand', params.brand.join(','));
    if (params?.category?.length) searchParams.set('category', params.category.join(','));
    if (params?.notes?.length) searchParams.set('notes', params.notes.join(','));
    if (params?.random) searchParams.set('random', 'true');
    if (params?.withImages) searchParams.set('withImages', 'true');

    const url = `${API_BASE_URL}/api/perfumes${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: ApiResponse = await response.json();
    
    return {
      perfumes: data.data.map(transformPerfume),
      total: data.pagination?.total || data.data.length,
      page: data.pagination?.page || 1,
      limit: data.pagination?.limit || data.data.length,
    };
  },

  // Search perfumes - backend image filtering is too slow, so search all
  async searchPerfumes(query: string): Promise<{ perfumes: Perfume[]; total: number }> {
    const result = await this.getAllPerfumes({ query, limit: 50 });
    return {
      perfumes: result.perfumes,
      total: result.total,
    };
  },

  // Get perfume by ID
  async getPerfumeById(id: string): Promise<Perfume> {
    const response = await fetch(`${API_BASE_URL}/api/perfumes/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    // Handle the nested structure with perfume property
    const perfumeData = data.data.perfume || data.data;
    return transformPerfume(perfumeData);
  },

  // Get similar perfumes using recommendation engine
  async getSimilarPerfumes(perfumeId: string): Promise<Perfume[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          similarTo: perfumeId,
          limit: 10,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data.status === 'success' && data.data) {
        // Transform the recommendation data to extract perfume objects
        return data.data.map((item: any) => transformPerfume(item.perfume)).slice(0, 4);
      }
      
      throw new Error(data.message || 'Failed to get recommendations');
    } catch (error) {
      console.warn('Failed to get similar perfumes, falling back to simple search:', error);
      
      // Fallback to simple brand-based search if recommendations fail
      const targetPerfume = await this.getPerfumeById(perfumeId);
      const sameBrandResult = await this.getAllPerfumes({ 
        query: targetPerfume.brand, 
        limit: 10 
      });
      
      return sameBrandResult.perfumes
        .filter(p => p.id !== targetPerfume.id)
        .slice(0, 4);
    }
  },

  // Get similar perfumes with full recommendation data
  async getSimilarPerfumesWithData(perfumeId: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          similarTo: perfumeId,
          limit: 10,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();

      if (data.status === 'success' && data.data) {
        // Transform perfumes and preserve recommendation metadata
        return data.data.map((item: any) => {
          const transformedPerfume = transformPerfume(item.perfume);

          // Backend returns similarity data INSIDE the perfume object
          // We need to extract it and put it at the top level for the recommendation engine
          const result = {
            perfume: transformedPerfume,
            // Extract from item.perfume (backend structure)
            similarityScore: item.perfume?.similarityScore,
            sharedNotes: item.perfume?.sharedNotes,
            olfactiveProfile: item.perfume?.olfactiveProfile,
            notes: item.notes
          };

          return result;
        }).slice(0, 4);
      }
      
      throw new Error(data.message || 'Failed to get recommendations');
    } catch (error) {
      console.warn('Failed to get recommendation data:', error);
      return [];
    }
  },

  // Get personalized recommendations (popular perfumes)
  async getPersonalizedRecommendations(): Promise<Perfume[]> {
    const result = await this.getAllPerfumes({ limit: 10 });
    return result.perfumes;
  },

  // Get category-based recommendations
  async getCategoryRecommendations(category: string, limit: number = 20, brands?: string[]): Promise<{ perfumes: Perfume[]; total: number }> {
    try {
      const requestBody: any = {
        category,
        limit,
      };
      
      // Only add brands if specifically provided
      if (brands && brands.length > 0) {
        requestBody.brands = brands;
      }
      
      console.log('🔍 Category API Request:', requestBody);
      console.log('📍 Full URL:', `${API_BASE_URL}/api/recommendations`);
      console.log('📋 Request body as JSON:', JSON.stringify(requestBody));
      
      const response = await fetch(`${API_BASE_URL}/api/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`📊 ${category} API Response:`, {
        status: data.status,
        dataLength: data.data?.length,
        firstItem: data.data?.[0]?.perfume?.title,
        first3Items: data.data?.slice(0, 3).map((item: any) => item.perfume?.title),
        rawResponse: data // Log full response to see what we're getting
      });
      
      if (data.status === 'success' && data.data) {
        const perfumes = data.data.map((item: any) => {
          // The API returns the perfume data directly in item.perfume
          const perfumeData = item.perfume;
          console.log('🔧 Raw perfume data:', perfumeData);
          return transformPerfume(perfumeData);
        });
        return {
          perfumes,
          total: perfumes.length,
        };
      }
      
      throw new Error(data.message || 'Failed to get category recommendations');
    } catch (error) {
      console.warn(`Failed to get ${category} recommendations:`, error);
      
      // Fallback to regular search if category recommendations fail
      const result = await this.getAllPerfumes({ limit });
      return {
        perfumes: result.perfumes,
        total: result.total,
      };
    }
  },
};