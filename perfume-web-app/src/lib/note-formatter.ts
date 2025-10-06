// Known compound notes that should never be split
const COMPOUND_NOTES = new Set([
  'iso e super',
  'pink pepper',
  'black pepper',
  'white pepper',
  'green pepper',
  'red pepper',
  'white musk',
  'black currant',
  'red berries',
  'black tea',
  'green tea',
  'white tea',
  'sea notes',
  'woody notes',
  'aquatic notes',
  'citrus notes',
  'spicy notes',
  'floral notes',
  'oriental notes',
  'ambergris accord',
  'oud wood',
  'sea salt',
  'tonka bean',
  'vanilla bean',
  'cocoa bean',
  'coffee bean',
  'ambroxan super',
  'hedione hc',
  'cashmeran wood',
  'cedar wood',
  'sandalwood accord',
  'patchouli leaf',
  'orange blossom',
  'lily of the valley',
  'apple blossom',
]);

// Special capitalization rules for note names
const CAPITALIZATION_RULES: Record<string, string> = {
  'ylang-ylang': 'Ylang-Ylang',
  'iso e super': 'Iso E Super',
  'hedione hc': 'Hedione HC',
  'ambroxan': 'Ambroxan',
  'cashmeran': 'Cashmeran',
  'tonka bean': 'Tonka Bean',
  'oud': 'Oud',
  'patchouli': 'Patchouli',
};

/**
 * Format and capitalize a fragrance note name
 * @param note The raw note name from the API
 * @returns Properly formatted and capitalized note name
 */
export function formatNote(note: string): string {
  if (!note) return '';

  const normalized = note.toLowerCase().trim();

  // Check for special capitalization rules
  if (CAPITALIZATION_RULES[normalized]) {
    return CAPITALIZATION_RULES[normalized];
  }

  // Default: capitalize first letter of each word
  return normalized
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Parse and format an array of note strings
 * @param notes Array of note strings from the API
 * @returns Formatted and deduplicated array of notes
 */
export function formatNotes(notes: string[]): string[] {
  if (!Array.isArray(notes)) return [];

  // Remove duplicates (case-insensitive) and format
  const seen = new Set<string>();
  const formatted: string[] = [];

  for (const note of notes) {
    const normalized = note.toLowerCase().trim();
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      formatted.push(formatNote(note));
    }
  }

  return formatted;
}

/**
 * Check if a note is a known compound note
 * @param note The note to check
 * @returns True if the note is a known compound note
 */
export function isCompoundNote(note: string): boolean {
  return COMPOUND_NOTES.has(note.toLowerCase().trim());
}
