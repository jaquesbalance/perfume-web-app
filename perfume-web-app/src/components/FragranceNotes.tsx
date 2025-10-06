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

  const renderNoteCategory = (title: string, notes: string[], bgColor: string, textColor: string) => {
    if (notes.length === 0) return null;

    return (
      <div className={`${bgColor} rounded-xl p-5 border border-slate-200`}>
        <h4 className={`font-bold ${textColor} text-lg mb-3`}>
          {title}
        </h4>
        <div className="flex flex-wrap gap-2">
          {notes.slice(0, 6).map((note, index) => (
            <span key={index} className="bg-white text-slate-700 px-3 py-1 rounded-full text-sm font-medium border border-slate-200 shadow-sm">
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-3xl font-bold text-slate-900 mb-6">
        Fragrance Notes
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderNoteCategory('Top Notes', topNotesData, 'bg-amber-50', 'text-amber-800')}
        {renderNoteCategory('Heart Notes', middleNotesData, 'bg-rose-50', 'text-rose-800')}
        {renderNoteCategory('Base Notes', baseNotesData, 'bg-emerald-50', 'text-emerald-800')}
      </div>
    </div>
  );
}