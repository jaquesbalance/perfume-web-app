interface FragranceNotesProps {
  topNotes: string | string[];
  middleNotes: string | string[];
  baseNotes: string | string[];
}

export function FragranceNotes({ topNotes, middleNotes, baseNotes }: FragranceNotesProps) {
  const parseNotes = (notes: string | string[]): string[] => {
    if (!notes) return [];
    
    if (typeof notes === 'string') {
      return notes.split(',').map(note => note.trim()).filter(Boolean);
    }
    
    return Array.isArray(notes) ? notes : [];
  };

  const renderNoteCategory = (title: string, notes: string[], emoji: string, bgColor: string) => {
    if (notes.length === 0) return null;

    return (
      <div className={`${bgColor} backdrop-blur-sm rounded-2xl p-5 border border-white/20`}>
        <h4 className="font-bold text-white text-lg mb-3 flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          {title}
        </h4>
        <div className="flex flex-wrap gap-2">
          {notes.slice(0, 6).map((note, index) => (
            <span key={index} className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium border border-white/30">
              {note}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const topNotesData = parseNotes(topNotes);
  const middleNotesData = parseNotes(middleNotes);
  const baseNotesData = parseNotes(baseNotes);

  return (
    <div className="glass-card p-6">
      <h3 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
        <span className="text-4xl">🌿</span>
        Scent Profile
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderNoteCategory('Top Notes', topNotesData, '✨', 'bg-amber-500/30')}
        {renderNoteCategory('Heart Notes', middleNotesData, '🌸', 'bg-rose-500/30')}
        {renderNoteCategory('Base Notes', baseNotesData, '🌲', 'bg-emerald-500/30')}
      </div>
    </div>
  );
}