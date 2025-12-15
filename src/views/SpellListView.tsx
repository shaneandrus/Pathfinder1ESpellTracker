import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getClassById } from '../data/classes';
import { getSpellAonUrl, getSpellById } from '../data/spells';
import type { Spell, KnownSpell } from '../types';

export function SpellListView() {
  const { state, activeCharacter, removeSpell, setView } = useApp();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'level' | 'name' | 'school'>('level');
  
  if (!activeCharacter) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-300 mb-4">No Character Selected</h2>
        <button onClick={() => setView('characters')} className="btn btn-primary">
          Select Character
        </button>
      </div>
    );
  }
  
  const spellcastingClasses = activeCharacter.classes.filter(c => {
    const def = getClassById(c.classId);
    return def && def.casterType !== 'none' && !def.isPrestigeClass;
  });
  
  const activeClassId = selectedClassId || spellcastingClasses[0]?.classId;
  
  // Get known spells for selected class
  const knownSpells = useMemo(() => {
    if (!activeClassId) return [];
    return activeCharacter.knownSpells
      .filter(ks => ks.classId === activeClassId)
      .map(ks => {
        const spell = getSpellById(state.spells, ks.spellId);
        return spell ? { ...ks, spell } : null;
      })
      .filter((s): s is KnownSpell & { spell: Spell } => s !== null);
  }, [activeCharacter.knownSpells, activeClassId, state.spells]);
  
  // Filter and sort
  const filteredSpells = useMemo(() => {
    let spells = [...knownSpells];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      spells = spells.filter(s => 
        s.spell.name.toLowerCase().includes(query) ||
        s.spell.school.toLowerCase().includes(query)
      );
    }
    
    spells.sort((a, b) => {
      switch (sortBy) {
        case 'level':
          return (a.spell.classLevels[activeClassId!] || 0) - (b.spell.classLevels[activeClassId!] || 0);
        case 'name':
          return a.spell.name.localeCompare(b.spell.name);
        case 'school':
          return a.spell.school.localeCompare(b.spell.school);
        default:
          return 0;
      }
    });
    
    return spells;
  }, [knownSpells, searchQuery, sortBy, activeClassId]);
  
  // Group by level
  const groupedByLevel = useMemo(() => {
    const groups: { [level: number]: typeof filteredSpells } = {};
    for (const ks of filteredSpells) {
      const level = ks.spell.classLevels[activeClassId!] || 0;
      if (!groups[level]) groups[level] = [];
      groups[level].push(ks);
    }
    return groups;
  }, [filteredSpells, activeClassId]);
  
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">Known Spells</h1>
        <button onClick={() => setView('slots')} className="btn btn-secondary text-sm">
          ← Back to Slots
        </button>
      </div>
      
      {/* Class Tabs */}
      {spellcastingClasses.length > 1 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {spellcastingClasses.map(c => {
            const def = getClassById(c.classId);
            return (
              <button
                key={c.classId}
                onClick={() => setSelectedClassId(c.classId)}
                className={`btn text-sm whitespace-nowrap ${
                  activeClassId === c.classId ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                {def?.name}
              </button>
            );
          })}
        </div>
      )}
      
      {/* Search and Filter */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search spells..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="input flex-1"
        />
        <select value={sortBy} onChange={e => setSortBy(e.target.value as 'level' | 'name' | 'school')} className="input w-32">
          <option value="level">By Level</option>
          <option value="name">By Name</option>
          <option value="school">By School</option>
        </select>
      </div>
      
      {/* Add Spell Button */}
      <button onClick={() => setView('addSpell')} className="btn btn-primary w-full mb-4">
        + Add Spells
      </button>
      
      {/* Spell List */}
      {filteredSpells.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-gray-400">No spells known yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedByLevel)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([level, spells]) => (
              <div key={level}>
                <h3 className="text-sm font-medium text-gray-400 mb-2">
                  {level === '0' ? 'Cantrips/Orisons' : `Level ${level}`} ({spells.length})
                </h3>
                <div className="space-y-2">
                  {spells.map(ks => (
                    <SpellCard
                      key={ks.spellId}
                      spell={ks.spell}
                      classId={activeClassId!}
                      onRemove={() => removeSpell(ks.spellId, activeClassId!)}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

interface SpellCardProps {
  spell: Spell;
  classId: string;
  onRemove: () => void;
}

function SpellCard({ spell, classId, onRemove }: SpellCardProps) {
  const [expanded, setExpanded] = useState(false);
  const level = spell.classLevels[classId] || 0;
  
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex-1 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">{spell.name}</span>
            <a
              href={getSpellAonUrl(spell.name)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="text-indigo-400 hover:text-indigo-300"
              title="View on Archives of Nethys"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          <p className="text-sm text-gray-400">
            {spell.school} {level > 0 ? level : ''} • {spell.castingTime}
          </p>
        </div>
        <button onClick={onRemove} className="text-gray-500 hover:text-red-400 p-1">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-700 text-sm text-gray-300">
          <p><strong>Range:</strong> {spell.range}</p>
          <p><strong>Duration:</strong> {spell.duration}</p>
          <p><strong>Save:</strong> {spell.savingThrow} • <strong>SR:</strong> {spell.spellResistance}</p>
          <p className="mt-2">{spell.description}</p>
        </div>
      )}
    </div>
  );
}

