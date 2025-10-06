import { useState, useEffect, useCallback } from 'react';
import type { Perfume } from '../types/perfume';

export type FeedbackStatus = 'loved' | 'rejected' | null;

export interface FeedbackData {
  loved: string[];
  rejected: string[];
  timestamp: string;
}

interface FeedbackAnalysis {
  topNotes: Array<{ note: string; count: number }>;
  topBrands: Array<{ brand: string; count: number }>;
  preferredYearRange: { min: number; max: number } | null;
}

const STORAGE_KEY = 'fragrance_feedback';

// Helper to get feedback from localStorage
function loadFeedback(): FeedbackData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load feedback from localStorage:', error);
  }
  return {
    loved: [],
    rejected: [],
    timestamp: new Date().toISOString(),
  };
}

// Helper to save feedback to localStorage
function saveFeedback(data: FeedbackData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...data,
      timestamp: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Failed to save feedback to localStorage:', error);
  }
}

export function useFeedback() {
  const [feedback, setFeedback] = useState<FeedbackData>(loadFeedback);

  // Save to localStorage whenever feedback changes
  useEffect(() => {
    saveFeedback(feedback);
  }, [feedback]);

  // Get feedback status for a specific perfume
  const getFeedbackStatus = useCallback((perfumeId: string): FeedbackStatus => {
    if (feedback.loved.includes(perfumeId)) return 'loved';
    if (feedback.rejected.includes(perfumeId)) return 'rejected';
    return null;
  }, [feedback]);

  // Toggle love status
  const toggleLove = useCallback((perfumeId: string) => {
    setFeedback(prev => {
      const isCurrentlyLoved = prev.loved.includes(perfumeId);

      return {
        loved: isCurrentlyLoved
          ? prev.loved.filter(id => id !== perfumeId)
          : [...prev.loved, perfumeId],
        rejected: prev.rejected.filter(id => id !== perfumeId), // Remove from rejected if present
        timestamp: new Date().toISOString(),
      };
    });
  }, []);

  // Toggle reject status
  const toggleReject = useCallback((perfumeId: string) => {
    setFeedback(prev => {
      const isCurrentlyRejected = prev.rejected.includes(perfumeId);

      return {
        loved: prev.loved.filter(id => id !== perfumeId), // Remove from loved if present
        rejected: isCurrentlyRejected
          ? prev.rejected.filter(id => id !== perfumeId)
          : [...prev.rejected, perfumeId],
        timestamp: new Date().toISOString(),
      };
    });
  }, []);

  // Clear all feedback
  const clearFeedback = useCallback(() => {
    setFeedback({
      loved: [],
      rejected: [],
      timestamp: new Date().toISOString(),
    });
  }, []);

  // Get total feedback count
  const getTotalFeedbackCount = useCallback(() => {
    return feedback.loved.length + feedback.rejected.length;
  }, [feedback]);

  // Analyze user preferences from loved perfumes
  const analyzePreferences = useCallback((perfumes: Perfume[]): FeedbackAnalysis => {
    const lovedPerfumes = perfumes.filter(p => feedback.loved.includes(p.id));

    if (lovedPerfumes.length === 0) {
      return {
        topNotes: [],
        topBrands: [],
        preferredYearRange: null,
      };
    }

    // Count notes
    const noteCounts = new Map<string, number>();
    lovedPerfumes.forEach(perfume => {
      const allNotes = [
        ...(perfume.notes?.top || []),
        ...(perfume.notes?.middle || []),
        ...(perfume.notes?.base || []),
      ];

      allNotes.forEach(note => {
        const normalizedNote = note.toLowerCase().trim();
        noteCounts.set(normalizedNote, (noteCounts.get(normalizedNote) || 0) + 1);
      });
    });

    // Count brands
    const brandCounts = new Map<string, number>();
    lovedPerfumes.forEach(perfume => {
      const brand = perfume.brand;
      brandCounts.set(brand, (brandCounts.get(brand) || 0) + 1);
    });

    // Find year range
    const years = lovedPerfumes
      .map(p => parseInt(String(p.year)))
      .filter(y => !isNaN(y) && y > 0);

    const preferredYearRange = years.length > 0
      ? { min: Math.min(...years), max: Math.max(...years) }
      : null;

    return {
      topNotes: Array.from(noteCounts.entries())
        .map(([note, count]) => ({ note, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5),
      topBrands: Array.from(brandCounts.entries())
        .map(([brand, count]) => ({ brand, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3),
      preferredYearRange,
    };
  }, [feedback]);

  // Check if user has enough feedback to show insights (3+ ratings)
  const hasEnoughFeedback = useCallback(() => {
    return getTotalFeedbackCount() >= 3;
  }, [getTotalFeedbackCount]);

  return {
    feedback,
    getFeedbackStatus,
    toggleLove,
    toggleReject,
    clearFeedback,
    getTotalFeedbackCount,
    analyzePreferences,
    hasEnoughFeedback,
  };
}
