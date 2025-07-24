import { ArrowLeft, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { Perfume } from '../types/perfume';
import { perfumeApi } from '../lib/api';
import { RecommendationEngine } from '../lib/recommendation-engine';
import { FragranceNotes } from './FragranceNotes';
import { RecommendationCard } from './RecommendationCard';
import PerfumeImage from './PerfumeImage';

interface PerfumeDetailProps {
  perfume: Perfume;
  onBack: () => void;
  onPerfumeSelect: (perfume: Perfume) => void;
}

export function PerfumeDetail({ perfume, onBack, onPerfumeSelect }: PerfumeDetailProps) {
  const { data: recommendationData, isLoading } = useQuery({
    queryKey: ['similar-perfumes-data', perfume.id],
    queryFn: () => perfumeApi.getSimilarPerfumesWithData(perfume.id),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });


  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-rose-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Header */}
      <div className="relative z-10 glass-card mx-6 mt-6 sticky top-6">
        <div className="px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-3 text-white hover:text-white/80 transition-colors group"
          >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg">Back to search</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Main perfume info */}
        <div className="glass-card p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="w-full lg:w-96 flex-shrink-0">
              <PerfumeImage 
                perfume={perfume}
                className="shadow-2xl hover:scale-105 transition-transform duration-500"
                width={384}
                height={384}
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-5xl font-black text-white mb-4 leading-tight">
                {perfume.title || perfume.name}
              </h1>
              <p className="text-2xl text-white/90 font-bold mb-6">
                {perfume.brand}
              </p>
              {perfume.year && (
                <div className="inline-flex items-center bg-white/20 rounded-full px-4 py-2 mb-8">
                  <span className="text-white font-semibold">✨ Launched {perfume.year}</span>
                </div>
              )}
              
              {perfume.description && (
                <div className="bg-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">📝 The Story</h3>
                  <p className="text-white/90 leading-relaxed text-lg">
                    {perfume.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fragrance Notes */}
        <div className="mb-8">
          <FragranceNotes
            topNotes={perfume.notes?.top || perfume.top_notes || []}
            middleNotes={perfume.notes?.middle || perfume.middle_notes || []}
            baseNotes={perfume.notes?.base || perfume.base_notes || []}
          />
        </div>

        {/* Recommendations */}
        <div>
          <div className="glass-card p-6 mb-6">
            <h2 className="text-3xl font-black text-white mb-2">
              🔥 Similar vibes
            </h2>
            <p className="text-white/80 text-lg">More scents that match your energy</p>
          </div>
          
          {isLoading && (
            <div className="glass-card p-12 text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-white" />
              <p className="text-white/90 text-lg font-medium">Finding your tribe...</p>
            </div>
          )}

          {recommendationData && recommendationData.length > 0 && (
            <div className="space-y-0">
              {recommendationData.slice(0, 4).map((recData, index) => {
                const reason = RecommendationEngine.generateRecommendationReasonFromData(
                  recData, 
                  index
                );
                
                return (
                  <RecommendationCard
                    key={recData.perfume.id}
                    perfume={recData.perfume}
                    onPress={onPerfumeSelect}
                    reason={reason}
                  />
                );
              })}
            </div>
          )}

          {recommendationData && recommendationData.length === 0 && (
            <div className="glass-card p-12 text-center">
              <div className="text-6xl mb-6">🤷‍♀️</div>
              <p className="text-white/90 text-lg font-medium">Couldn't find similar vibes right now</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}