import { useState, useEffect } from 'react';
import { perfumeApi } from '../lib/api';
import type { Perfume } from '../types/perfume';

const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg width="400" height="400" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="400" height="400" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="18" fill="%23666" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';

export function usePerfumeImage(perfume: Perfume) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadImage() {
      try {
        if (perfume.imageUrl) {
          // Use direct URL if available
          setImageUrl(perfume.imageUrl);
        } else if (perfume.imgId) {
          // Generate signed URL
          const signedUrl = await perfumeApi.getImageSignedUrl(perfume.imgId);
          if (signedUrl) {
            setImageUrl(signedUrl);
          } else {
            setImageUrl(FALLBACK_IMAGE);
          }
        } else {
          // No image available
          setImageUrl(FALLBACK_IMAGE);
        }
      } catch (err) {
        console.warn('Failed to load image:', err);
        setError(err instanceof Error ? err.message : 'Failed to load image');
        setImageUrl(FALLBACK_IMAGE);
      } finally {
        setLoading(false);
      }
    }

    loadImage();
  }, [perfume.imageUrl, perfume.imgId]);

  return { imageUrl: imageUrl || FALLBACK_IMAGE, loading, error };
}

// Legacy hook for backward compatibility
export function useImageUrl(imgId?: string) {
  // Create a minimal perfume object for the new hook
  const perfume = { imgId } as Perfume;
  return usePerfumeImage(perfume);
}