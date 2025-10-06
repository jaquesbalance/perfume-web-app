import type { Perfume } from '../types/perfume';
import PerfumeImage from './PerfumeImage';
import { Heart } from 'lucide-react';

interface PerfumeCardProps {
  perfume: Perfume;
  onClick: (perfume: Perfume) => void;
  similarityScore?: number; // Optional: 0-1 confidence score
  similarTo?: string; // Optional: Name of perfume this is similar to
}

export function PerfumeCard({ perfume, onClick, similarityScore, similarTo }: PerfumeCardProps) {
  console.log('🎭 PerfumeCard data:', {
    id: perfume.id,
    title: perfume.title,
    name: perfume.name,
    brand: perfume.brand,
    notes: perfume.notes
  });

  // Calculate match percentage from similarity score
  const matchPercentage = similarityScore ? Math.round(similarityScore * 100) : null;

  // Get badge color based on match strength
  const getBadgeColor = () => {
    if (!similarityScore) return '';
    if (similarityScore >= 0.9) return 'bg-green-500';
    if (similarityScore >= 0.75) return 'bg-blue-500';
    if (similarityScore >= 0.6) return 'bg-yellow-500';
    return 'bg-slate-400';
  };

  return (
    <div
      className="perfume-card cursor-pointer group relative overflow-hidden"
      onClick={() => onClick(perfume)}
    >
      {/* Similarity Badge */}
      {matchPercentage && (
        <div className="absolute top-2 left-2 z-10">
          <div className={`${getBadgeColor()} text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg`}>
            {matchPercentage}%
          </div>
        </div>
      )}

      {/* Favorite Button */}
      <button
        className="absolute top-2 right-2 z-10 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 border border-slate-200"
        onClick={(e) => {
          e.stopPropagation();
          // Handle favorite logic here
        }}
      >
        <Heart className="w-3 h-3 text-slate-700 hover:text-red-600" />
      </button>

      {/* Image */}
      <div className="aspect-[4/5] relative overflow-hidden bg-slate-100">
        <PerfumeImage 
          perfume={perfume}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          width={150}
          height={187}
        />
        
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <button className="bg-white text-slate-900 px-2 py-1 rounded text-xs font-semibold hover:bg-slate-100 transition-colors duration-200 shadow-lg">
            Quick View
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-2 space-y-2">
        <div className="space-y-1">
          {/* Similar To Label */}
          {similarTo && (
            <p className="text-slate-500 text-2xs font-medium italic">
              Similar to {similarTo}
            </p>
          )}

          <h3 className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
            {perfume.title || perfume.name}
          </h3>
          <p className="text-slate-600 font-medium text-xs">
            {perfume.brand}
          </p>
        </div>
        
        {/* Year */}
        <div className="flex items-center justify-between">
          {perfume.year && (
            <span className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-2xs font-semibold">
              {perfume.year}
            </span>
          )}
        </div>
        
        {/* Notes Preview */}
        {perfume.notes && perfume.notes.top && perfume.notes.middle && perfume.notes.base && (
          <div className="flex flex-wrap gap-1 mt-1">
            {[
              ...(perfume.notes.top || []), 
              ...(perfume.notes.middle || []), 
              ...(perfume.notes.base || [])
            ].slice(0, 3).map((note, index) => (
              <span key={`${perfume.id}-note-${index}-${note}`} className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-2xs font-medium">
                {note}
              </span>
            ))}
            {([
              ...(perfume.notes.top || []), 
              ...(perfume.notes.middle || []), 
              ...(perfume.notes.base || [])
            ].length > 3) && (
              <span key={`${perfume.id}-more-notes`} className="text-slate-600 text-2xs font-medium">
                +{([
                  ...(perfume.notes.top || []), 
                  ...(perfume.notes.middle || []), 
                  ...(perfume.notes.base || [])
                ].length - 3)} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}