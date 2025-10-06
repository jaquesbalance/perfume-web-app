export interface ImageMetadata {
  imgId: string;
  s3Key: string;
  extension: string;
  originalFilename: string;
  uploadedAt?: number;
  migratedFrom?: string;
  migrationDate?: number;
}

export interface Perfume {
  id: string;
  name: string;
  brand: string;
  title: string;
  description: string;
  year?: string | number;
  imgId?: string;
  imageMetadata?: ImageMetadata;
  imageUrl?: string;
  sourceUrl?: string;
  top_notes?: string;
  middle_notes?: string;
  base_notes?: string;
  notes?: {
    top: string[];
    middle: string[];
    base: string[];
  };
}

export interface ApiResponse {
  status: string;
  data: Perfume[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface SearchResponse {
  status: string;
  data: {
    perfume: Perfume;
    notes: Array<{
      category: string | null;
      note: {
        name: string;
        id?: string;
      };
    }>;
  };
}

export interface RecommendationsResponse {
  status: string;
  data: Perfume[];
}

export interface SearchParams {
  query?: string;
  brand?: string[];
  category?: string[];
  notes?: string[];
  sortBy?: 'popular' | 'newest' | 'price' | 'name';
  limit?: number;
  offset?: number;
}

export interface RecommendationReason {
  type: 'similar_notes' | 'same_brand' | 'similar_family' | 'popular_choice' | 'complementary';
  confidence: number;
  details: string;
  matchingElements: string[];
}

export interface RecommendationData {
  perfume: Perfume;
  similarityScore: number;
  sharedNotes: number;
  weightedMatches: number;
  noteMatches: number;
  olfactiveProfile: {
    FLORAL: number;
    WOODY: number;
    ORIENTAL: number;
    FRESH: number;
    FRUITY: number;
    GOURMAND: number;
  };
  notes: Array<{
    category: string | null;
    note: {
      identity?: any;
      labels?: string[];
      properties: {
        name: string;
        profile?: string;
        isCanonical?: boolean;
        active?: boolean;
        group?: string;
      };
    };
  }>;
}