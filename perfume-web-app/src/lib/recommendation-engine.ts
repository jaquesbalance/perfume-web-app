import type { Perfume, RecommendationReason } from '../types/perfume';

export class RecommendationEngine {
  // Generate recommendation reasoning from API data
  static generateRecommendationReasonFromData(
    data: any,
    index: number
  ): RecommendationReason {
    const perfume = data.perfume || data;
    const { similarityScore, sharedNotes, olfactiveProfile } = data; // Extract from data, not perfume!
    
    // Find the dominant olfactive family
    const dominantFamily = olfactiveProfile ? Object.entries(olfactiveProfile)
      .reduce((max, [family, score]) => {
        const numScore = typeof score === 'number' ? score : 0;
        return numScore > max.score ? { family, score: numScore } : max;
      }, { family: '', score: 0 }) : { family: '', score: 0 };
    
    if (sharedNotes > 6) {
      return {
        type: 'similar_notes',
        confidence: Math.min(0.95, similarityScore / 3),
        details: `🎯 Shares ${sharedNotes} fragrance notes with incredible similarity`,
        matchingElements: [`${sharedNotes} shared notes`]
      };
    }
    
    if (dominantFamily.score > 4) {
      return {
        type: 'similar_family',
        confidence: Math.min(0.9, similarityScore / 3),
        details: `✨ Similar ${dominantFamily.family.toLowerCase()} profile with ${dominantFamily.score} matching elements`,
        matchingElements: [dominantFamily.family]
      };
    }
    
    if (similarityScore > 2.5) {
      return {
        type: 'complementary',
        confidence: Math.min(0.85, similarityScore / 3),
        details: `🤝 High compatibility score of ${similarityScore.toFixed(1)} - perfect match!`,
        matchingElements: [`${similarityScore.toFixed(1)} similarity`]
      };
    }
    
    return {
      type: 'popular_choice',
      confidence: Math.max(0.6, 0.8 - (index * 0.1)),
      details: `💎 Curated recommendation based on advanced fragrance analysis`,
      matchingElements: []
    };
  }

  // Legacy method for backward compatibility
  static generateRecommendationReason(
    sourcePerfume: Perfume, 
    recommendedPerfume: Perfume,
    index: number
  ): RecommendationReason {
    const reasons: RecommendationReason[] = [];

    // Check for same brand
    if (sourcePerfume.brand.toLowerCase() === recommendedPerfume.brand.toLowerCase()) {
      reasons.push({
        type: 'same_brand',
        confidence: 0.85,
        details: `Both perfumes are from ${sourcePerfume.brand}, known for their consistent quality and style.`,
        matchingElements: [sourcePerfume.brand]
      });
    }

    // Check for similar notes
    const sourceNotes = this.extractAllNotes(sourcePerfume);
    const recommendedNotes = this.extractAllNotes(recommendedPerfume);
    const commonNotes = sourceNotes.filter(note => 
      recommendedNotes.some(rNote => 
        this.normalizeNote(note) === this.normalizeNote(rNote)
      )
    );

    if (commonNotes.length > 0) {
      const confidence = Math.min(0.95, 0.6 + (commonNotes.length * 0.1));
      reasons.push({
        type: 'similar_notes',
        confidence,
        details: `Shares ${commonNotes.length} key fragrance note${commonNotes.length > 1 ? 's' : ''}: ${commonNotes.slice(0, 3).join(', ')}.`,
        matchingElements: commonNotes
      });
    }

    // Check for complementary profiles
    if (this.areComplementaryProfiles(sourcePerfume, recommendedPerfume)) {
      reasons.push({
        type: 'complementary',
        confidence: 0.75,
        details: `This fragrance complements your choice with contrasting yet harmonious notes.`,
        matchingElements: []
      });
    }

    // Popular choice fallback
    if (reasons.length === 0) {
      const confidence = Math.max(0.5, 0.8 - (index * 0.1));
      reasons.push({
        type: 'popular_choice',
        confidence,
        details: `Highly rated fragrance that perfume enthusiasts often enjoy alongside similar scents.`,
        matchingElements: []
      });
    }

    // Return the best reason
    return reasons.reduce((best, current) => 
      current.confidence > best.confidence ? current : best
    );
  }

  // Extract all notes from a perfume
  private static extractAllNotes(perfume: Perfume): string[] {
    const notes: string[] = [];

    // From structured notes
    if (perfume.notes) {
      if (perfume.notes.top) notes.push(...perfume.notes.top);
      if (perfume.notes.middle) notes.push(...perfume.notes.middle);
      if (perfume.notes.base) notes.push(...perfume.notes.base);
    }

    // From string notes
    if (perfume.top_notes) {
      notes.push(...perfume.top_notes.split(',').map(n => n.trim()));
    }
    if (perfume.middle_notes) {
      notes.push(...perfume.middle_notes.split(',').map(n => n.trim()));
    }
    if (perfume.base_notes) {
      notes.push(...perfume.base_notes.split(',').map(n => n.trim()));
    }

    return notes.filter(note => note.length > 0);
  }

  // Normalize note names for comparison
  private static normalizeNote(note: string): string {
    return note.toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/^(white|black|pink|red|blue|green|yellow)\s+/, '') // Remove color prefixes
      .replace(/\s+(oil|extract|absolute)$/, ''); // Remove suffixes
  }

  // Check if two perfumes have complementary profiles
  private static areComplementaryProfiles(perfume1: Perfume, perfume2: Perfume): boolean {
    const notes1 = this.extractAllNotes(perfume1);
    const notes2 = this.extractAllNotes(perfume2);

    // Define complementary note families
    const complementaryPairs = [
      ['citrus', 'woody'],
      ['floral', 'spicy'],
      ['fresh', 'warm'],
      ['light', 'deep'],
      ['sweet', 'dry'],
      ['aquatic', 'oriental']
    ];

    for (const [family1, family2] of complementaryPairs) {
      const has1 = notes1.some(note => note.toLowerCase().includes(family1));
      const has2 = notes2.some(note => note.toLowerCase().includes(family2));
      
      if (has1 && has2) return true;
    }

    return false;
  }
}