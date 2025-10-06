import { ArrowLeft, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
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

  // Scroll to top when perfume changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [perfume.id]);


  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-3 text-slate-700 hover:text-slate-900 transition-colors group"
          >
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-slate-200 transition-colors duration-300">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg">Back to search</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Main perfume info */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="w-full lg:w-96 flex-shrink-0">
              <PerfumeImage 
                perfume={perfume}
                className="shadow-lg rounded-xl hover:scale-105 transition-transform duration-500"
                width={384}
                height={384}
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">
                {perfume.title || perfume.name}
              </h1>
              <p className="text-2xl text-slate-700 font-semibold mb-6">
                {perfume.brand}
              </p>
              {perfume.year && (
                <div className="inline-flex items-center bg-primary-100 text-primary-800 rounded-full px-4 py-2 mb-8">
                  <span className="font-semibold">Launched {perfume.year}</span>
                </div>
              )}
              
              {perfume.description && (
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">About</h3>
                  <p className="text-slate-700 leading-relaxed text-lg">
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
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Similar Fragrances
            </h2>
            <p className="text-slate-600 text-lg">More scents that match your preferences</p>
          </div>
          
          {isLoading && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-primary-600" />
              <p className="text-slate-700 text-lg font-medium">Finding similar fragrances...</p>
            </div>
          )}

          {recommendationData && recommendationData.length > 0 && (
            <div className="space-y-4">
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
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
              <p className="text-slate-700 text-lg font-medium">No similar fragrances found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}