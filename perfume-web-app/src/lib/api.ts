import type { Perfume, ApiResponse, SearchParams } from '../types/perfume';

const API_BASE_URL = 'http://localhost:3000';

// Transform perfume data from API
function transformPerfume(perfume: Perfume): Perfume {
  const notes = perfume.notes || {
    top: perfume.top_notes ? [perfume.top_notes] : [],
    middle: perfume.middle_notes ? [perfume.middle_notes] : [],
    base: perfume.base_notes ? [perfume.base_notes] : [],
  };

  // Handle Neo4j integer format for year
  let year = perfume.year;
  if (year && typeof year === 'object' && 'low' in year) {
    year = (year as any).low;
  }

  return {
    ...perfume,
    notes,
    year,
  };
}

export const perfumeApi = {
  // Get signed URL for image
  async getImageSignedUrl(imgId: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/images/signed-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bucket: 'bourgeon',
          key: `img/${imgId}.jpg`,
          expires: 3600, // 1 hour
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data.status === 'success') {
        return data.url;
      }
      throw new Error(data.message || 'Failed to get signed URL');
    } catch (error) {
      console.warn('Failed to get signed URL for image:', imgId, error);
      return '';
    }
  },
  // Get all perfumes with optional filtering
  async getAllPerfumes(params?: SearchParams): Promise<{ perfumes: Perfume[]; total: number; page: number; limit: number }> {
    const searchParams = new URLSearchParams();
    
    if (params?.query) searchParams.set('search', params.query);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params?.brand?.length) searchParams.set('brand', params.brand.join(','));
    if (params?.category?.length) searchParams.set('category', params.category.join(','));
    if (params?.notes?.length) searchParams.set('notes', params.notes.join(','));

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

  // Search perfumes
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
          return {
            perfume: transformedPerfume,
            // Include recommendation metadata from the perfume object
            similarityScore: item.perfume.similarityScore,
            sharedNotes: item.perfume.sharedNotes,
            olfactiveProfile: item.perfume.olfactiveProfile,
            notes: item.notes
          };
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
};