import { ChevronRight } from 'lucide-react';
import type { Perfume, RecommendationReason } from '../types/perfume';
import PerfumeImage from './PerfumeImage';

interface RecommendationCardProps {
  perfume: Perfume;
  onPress: (perfume: Perfume) => void;
  reason?: RecommendationReason;
}

export function RecommendationCard({ perfume, onPress, reason }: RecommendationCardProps) {

  const getReasonText = (type: string) => {
    const reasons = {
      similar_notes: '🌸 Similar vibes',
      same_brand: '✨ Same brand energy',
      similar_family: '💫 Similar aesthetic',
      popular_choice: '🔥 Trending pick',
      complementary: '🤝 Perfect match'
    };
    return reasons[type as keyof typeof reasons] || '💎 Recommended';
  };

  return (
    <div 
      className="glass-card p-4 cursor-pointer hover:bg-white/15 transition-all duration-300 mb-4 group"
      onClick={() => onPress(perfume)}
    >
      <div className="flex items-center space-x-4">
        <PerfumeImage 
          perfume={perfume}
          className="flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
          width={80}
          height={80}
        />
        
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-white line-clamp-2 text-base mb-1">
            {perfume.title || perfume.name}
          </h4>
          <p className="text-white/90 font-semibold text-sm mb-3">
            {perfume.brand}
          </p>
          
          {reason && (
            <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1">
              <span className="text-sm text-white font-medium">
                {getReasonText(reason.type)}
              </span>
            </div>
          )}
        </div>

        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
          <ChevronRight className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}