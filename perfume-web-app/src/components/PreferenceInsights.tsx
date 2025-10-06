import { Sparkles, Heart, ThumbsDown } from 'lucide-react';
import { useFeedback } from '../hooks/useFeedback';
import type { Perfume } from '../types/perfume';

interface PreferenceInsightsProps {
  allPerfumes: Perfume[];
}

export function PreferenceInsights({ allPerfumes }: PreferenceInsightsProps) {
  const { feedback, getTotalFeedbackCount, hasEnoughFeedback, analyzePreferences } = useFeedback();

  // Don't show if not enough feedback
  if (!hasEnoughFeedback()) {
    return null;
  }

  const analysis = analyzePreferences(allPerfumes);
  const totalCount = getTotalFeedbackCount();

  return (
    <div className="bg-gradient-to-br from-primary-50 to-blue-50 border-2 border-primary-200 rounded-xl p-6 mb-8 shadow-md">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            Your Fragrance Profile
          </h3>

          <p className="text-slate-700 mb-4">
            Based on your {totalCount} rating{totalCount > 1 ? 's' : ''}, here's what we've learned about your preferences:
          </p>

          {/* Stats */}
          <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-red-200">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span className="font-semibold text-slate-900">{feedback.loved.length} Loved</span>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 border border-slate-200">
              <ThumbsDown className="w-4 h-4 text-slate-500 fill-slate-500" />
              <span className="font-semibold text-slate-900">{feedback.rejected.length} Not For Me</span>
            </div>
          </div>

          {/* Top Notes */}
          {analysis.topNotes.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                You Love These Notes:
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.topNotes.map((noteData) => (
                  <div
                    key={noteData.note}
                    className="bg-white border-2 border-primary-300 rounded-full px-4 py-2 flex items-center gap-2"
                  >
                    <span className="font-semibold text-slate-900 capitalize">
                      {noteData.note}
                    </span>
                    <span className="text-xs bg-primary-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold">
                      {noteData.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Brands */}
          {analysis.topBrands.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                Your Favorite Brands:
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.topBrands.map((brandData) => (
                  <div
                    key={brandData.brand}
                    className="bg-white border border-slate-300 rounded-lg px-4 py-2"
                  >
                    <span className="font-semibold text-slate-900">
                      {brandData.brand}
                    </span>
                    {brandData.count > 1 && (
                      <span className="text-xs text-slate-600 ml-2">
                        ({brandData.count} perfumes)
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Year Range */}
          {analysis.preferredYearRange && (
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                Era Preference:
              </h4>
              <div className="bg-white border border-slate-300 rounded-lg px-4 py-2 inline-block">
                <span className="text-slate-900">
                  {analysis.preferredYearRange.min === analysis.preferredYearRange.max
                    ? `Released in ${analysis.preferredYearRange.min}`
                    : `${analysis.preferredYearRange.min} - ${analysis.preferredYearRange.max}`
                  }
                </span>
              </div>
            </div>
          )}

          {/* Insight Message */}
          {feedback.loved.length >= 3 && analysis.topNotes.length > 0 && (
            <div className="mt-4 p-4 bg-white/80 rounded-lg border-l-4 border-primary-500">
              <p className="text-slate-700 text-sm">
                💡 <strong>Insight:</strong> You seem to enjoy{' '}
                {analysis.topNotes.length === 1 ? (
                  <>fragrances with <strong>{analysis.topNotes[0].note}</strong> notes</>
                ) : (
                  <>
                    <strong>{analysis.topNotes[0].note}</strong> and{' '}
                    <strong>{analysis.topNotes[1].note}</strong> notes
                  </>
                )}
                . We'll prioritize similar scents in your recommendations!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
