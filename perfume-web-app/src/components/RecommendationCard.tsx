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
      similar_notes: 'Similar notes',
      same_brand: 'Same brand',
      similar_family: 'Similar style',
      popular_choice: 'Popular choice',
      complementary: 'Complementary'
    };
    return reasons[type as keyof typeof reasons] || 'Recommended';
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 cursor-pointer hover:shadow-md hover:border-slate-300 transition-all duration-200 group"
      onClick={() => onPress(perfume)}
    >
      <div className="flex items-center space-x-4">
        <PerfumeImage 
          perfume={perfume}
          className="flex-shrink-0 rounded-lg group-hover:scale-105 transition-transform duration-300"
          width={80}
          height={80}
        />
        
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 line-clamp-2 text-base mb-1">
            {perfume.title || perfume.name}
          </h4>
          <p className="text-slate-600 font-semibold text-sm mb-3">
            {perfume.brand}
          </p>
          
          {reason && (
            <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-800 rounded-full px-3 py-1">
              <span className="text-sm font-medium">
                {getReasonText(reason.type)}
              </span>
            </div>
          )}
        </div>

        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-slate-200 transition-colors duration-200">
          <ChevronRight className="w-5 h-5 text-slate-600" />
        </div>
      </div>
    </div>
  );
}