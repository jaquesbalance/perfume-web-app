import { ChevronRight } from 'lucide-react';
import type { Perfume, RecommendationReason } from '../types/perfume';
import PerfumeImage from './PerfumeImage';

interface RecommendationCardProps {
  perfume: Perfume;
  onPress: (perfume: Perfume) => void;
  reason?: RecommendationReason;
}

export function RecommendationCard({ perfume, onPress, reason }: RecommendationCardProps) {

  // Calculate match percentage from confidence (0-1 scale to 0-100%)
  const matchPercentage = reason?.confidence ? Math.round(reason.confidence * 100) : null;

  // Get badge color based on match strength
  const getBadgeColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-100 text-green-800';
    if (confidence >= 0.75) return 'bg-blue-100 text-blue-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-slate-100 text-slate-800';
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 cursor-pointer hover:shadow-md hover:border-slate-300 transition-all duration-200 group"
      onClick={() => onPress(perfume)}
    >
      <div className="flex items-center space-x-4">
        <PerfumeImage
          perfume={perfume}
          className="flex-shrink-0 rounded-lg group-hover:scale-105 transition-transform duration-300"
          width={96}
          height={96}
        />

        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 line-clamp-2 text-lg mb-1">
            {perfume.title || perfume.name}
          </h4>
          <p className="text-slate-600 font-semibold text-sm mb-3">
            {perfume.brand}
          </p>

          {reason && (
            <div className="space-y-2">
              {/* Match percentage badge */}
              {matchPercentage && (
                <div className="flex items-center gap-2 mb-2">
                  <div className={`inline-flex items-center ${getBadgeColor(reason.confidence)} rounded-full px-3 py-1`}>
                    <span className="text-sm font-bold">
                      {matchPercentage}% Match
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={matchPercentage} aria-valuemin={0} aria-valuemax={100} aria-label={`${matchPercentage}% similarity match`}>
                    <div
                      className={`h-full transition-all duration-300 ${
                        reason.confidence >= 0.9 ? 'bg-green-500' :
                        reason.confidence >= 0.75 ? 'bg-blue-500' :
                        reason.confidence >= 0.6 ? 'bg-yellow-500' :
                        'bg-slate-400'
                      }`}
                      style={{ width: `${matchPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Detailed explanation */}
              <p className="text-slate-700 text-sm leading-relaxed">
                {reason.details}
              </p>
            </div>
          )}
        </div>

        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-slate-200 transition-colors duration-200 flex-shrink-0">
          <ChevronRight className="w-5 h-5 text-slate-600" />
        </div>
      </div>
    </div>
  );
}