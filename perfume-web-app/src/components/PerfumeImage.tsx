import { useState, useEffect } from 'react';
import type { Perfume } from '../types/perfume';
import { perfumeApi } from '../lib/api';

interface PerfumeImageProps {
  perfume: Perfume;
  className?: string;
  width?: number;
  height?: number;
}

export function PerfumeImage({ 
  perfume, 
  className = '', 
  width = 200, 
  height = 200 
}: PerfumeImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadImage() {
      setLoading(true);
      setError(null);

      try {
        if (perfume.imageUrl) {
          // Use direct URL if available
          setImageUrl(perfume.imageUrl);
        } else if (perfume.imgId || perfume.imageMetadata?.imgId) {
          // Use imgId from imageMetadata if main imgId is null (backend migration)
          const imgId = perfume.imgId || perfume.imageMetadata?.imgId;
          // Generate signed URL for S3 image with exact extension from metadata
          const signedUrl = await perfumeApi.getImageSignedUrl(imgId!, perfume.imageMetadata);
          if (signedUrl) {
            setImageUrl(signedUrl);
          } else {
            setImageUrl(null);
          }
        } else {
          // No image available
          setImageUrl(null);
        }
      } catch (err) {
        console.warn('Failed to load perfume image:', err);
        setError(err instanceof Error ? err.message : 'Failed to load image');
        setImageUrl(null);
      } finally {
        setLoading(false);
      }
    }

    loadImage();
  }, [perfume.imageUrl, perfume.imgId, perfume.imageMetadata]);

  // Create elegant placeholder with perfume name/brand
  const createPlaceholder = () => {
    const perfumeName = perfume.title || perfume.name;
    const brandName = perfume.brand;
    
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${width}" height="${height}" fill="#f8fafc"/>
        <rect x="10" y="10" width="${width-20}" height="${height-20}" fill="none" stroke="#e2e8f0" stroke-width="2" rx="8"/>
        <text x="50%" y="40%" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#64748b" text-anchor="middle" dy=".3em">${perfumeName}</text>
        <text x="50%" y="60%" font-family="Inter, sans-serif" font-size="10" fill="#94a3b8" text-anchor="middle" dy=".3em">${brandName}</text>
      </svg>
    `)}`;
  };

  if (loading) {
    return (
      <div 
        className={`flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl ${className}`}
        style={{ width, height }}
      >
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl || createPlaceholder()}
      alt={`${perfume.title || perfume.name} by ${perfume.brand}`}
      className={className}
      onError={(e) => {
        const img = e.target as HTMLImageElement;
        console.warn('Image failed to load:', imageUrl);
        // Set to placeholder if not already
        if (img.src !== createPlaceholder()) {
          img.src = createPlaceholder();
        }
      }}
    />
  );
}

export default PerfumeImage;