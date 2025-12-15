import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getClassById } from '../data/classes';
import { getSpellsForClass, getSpellAonUrl } from '../data/spells';
import type { Spell } from '../types';
import { DEFAULT_HOMEBREW_SETTINGS } from '../types';

const SPELLS_PER_PAGE = 50;

export function AddSpellView() {
  const { state, activeCharacter, addSpell, setView } = useApp();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyMyClasses, setShowOnlyMyClasses] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Get allowed sources for this character
  const allowedSources = activeCharacter?.homebrewSettings?.allowedSources || DEFAULT_HOMEBREW_SETTINGS.allowedSources;
  
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
  const classDef = activeClassId ? getClassById(activeClassId) : null;

  // Get all filtered spells (before pagination)
  const allFilteredSpells = useMemo(() => {
    if (!activeClassId) return [];

    let spells: Spell[];

    if (showOnlyMyClasses) {
      // Only show spells that are on the selected class's spell list
      spells = getSpellsForClass(state.spells, activeClassId);
    } else {
      // Show ALL spells in the database - user can browse everything
      // Spells not on this class list will show "N/A" for level
      spells = [...state.spells];
    }

    // Filter by allowed sources (if any are set)
    if (allowedSources.length > 0) {
      spells = spells.filter(s => allowedSources.includes(s.source));
    }

    // Filter by level if selected (only works when showing class-specific spells)
    if (selectedLevel !== null && showOnlyMyClasses) {
      spells = spells.filter(s => s.classLevels[activeClassId] === selectedLevel);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      spells = spells.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.school.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query)
      );
    }

    // Sort by level then name
    spells.sort((a, b) => {
      const levelA = a.classLevels[activeClassId] ?? 99;
      const levelB = b.classLevels[activeClassId] ?? 99;
      const levelDiff = levelA - levelB;
      if (levelDiff !== 0) return levelDiff;
      return a.name.localeCompare(b.name);
    });

    return spells;
  }, [state.spells, activeClassId, selectedLevel, searchQuery, showOnlyMyClasses, allowedSources]);

  // Pagination calculations
  const totalSpells = allFilteredSpells.length;
  const totalPages = Math.ceil(totalSpells / SPELLS_PER_PAGE);
  const startIndex = (currentPage - 1) * SPELLS_PER_PAGE;
  const endIndex = Math.min(startIndex + SPELLS_PER_PAGE, totalSpells);
  const paginatedSpells = allFilteredSpells.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const resetPagination = () => setCurrentPage(1);
  
  // Check if spell is already known
  const isKnown = (spellId: number) => {
    return activeCharacter.knownSpells.some(
      ks => ks.spellId === spellId && ks.classId === activeClassId
    );
  };
  
  const handleAddSpell = (spell: Spell) => {
    if (activeClassId && !isKnown(spell.id)) {
      addSpell(spell.id, activeClassId);
    }
  };
  
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">Add Spells</h1>
        <button onClick={() => setView('spells')} className="btn btn-secondary text-sm">
          ← Back to Spell List
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
                onClick={() => { setSelectedClassId(c.classId); setSelectedLevel(null); resetPagination(); }}
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

      {/* Level Filter */}
      {classDef && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          <button
            onClick={() => { setSelectedLevel(null); resetPagination(); }}
            className={`btn text-sm ${selectedLevel === null ? 'btn-primary' : 'btn-secondary'}`}
          >
            All
          </button>
          {Array.from({ length: classDef.maxSpellLevel + 1 }, (_, i) => i).map(level => (
            <button
              key={level}
              onClick={() => { setSelectedLevel(level); resetPagination(); }}
              className={`btn text-sm ${selectedLevel === level ? 'btn-primary' : 'btn-secondary'}`}
            >
              {level === 0 ? '0' : level}
            </button>
          ))}
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex gap-4 items-center mb-4">
        <input
          type="text"
          placeholder="Search spells..."
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); resetPagination(); }}
          className="input flex-1"
        />
        <label className="flex items-center gap-2 text-sm text-gray-300 whitespace-nowrap cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlyMyClasses}
            onChange={e => { setShowOnlyMyClasses(e.target.checked); resetPagination(); }}
            className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-purple-600 focus:ring-purple-500"
          />
          {classDef?.name} only
        </label>
      </div>

      {/* Results count and pagination info */}
      <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
        <span>
          Showing {startIndex + 1}-{endIndex} of {totalSpells} {showOnlyMyClasses ? `${classDef?.name} ` : ''}spells
        </span>
        {totalPages > 1 && (
          <span>Page {currentPage} of {totalPages}</span>
        )}
      </div>

      <div className="space-y-2">
        {paginatedSpells.map(spell => {
          const known = isKnown(spell.id);
          const level = spell.classLevels[activeClassId!];
          const isOnClassList = level !== undefined;
          const canAdd = isOnClassList && !known;

          return (
            <div key={spell.id} className={`card flex items-center justify-between ${known || !isOnClassList ? 'opacity-50' : ''}`}>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{spell.name}</span>
                  <a
                    href={getSpellAonUrl(spell.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                <p className="text-sm text-gray-400">
                  {spell.school} {isOnClassList ? `Lvl ${level}` : 'Not on list'} • {spell.castingTime}
                </p>
              </div>
              <button
                onClick={() => handleAddSpell(spell)}
                disabled={!canAdd}
                className={`btn text-sm py-1 px-3 ${
                  known ? 'btn-secondary' :
                  !isOnClassList ? 'btn-secondary cursor-not-allowed' :
                  'btn-primary'
                }`}
                title={!isOnClassList ? `Not on ${classDef?.name} spell list` : undefined}
              >
                {known ? '✓ Added' : !isOnClassList ? 'N/A' : '+ Add'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6 pb-4">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="btn btn-secondary text-sm px-3 py-1 disabled:opacity-50"
          >
            ««
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn btn-secondary text-sm px-3 py-1 disabled:opacity-50"
          >
            ‹ Prev
          </button>

          {/* Page numbers */}
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                // Show first, last, and pages around current
                return page === 1 ||
                       page === totalPages ||
                       Math.abs(page - currentPage) <= 2;
              })
              .map((page, idx, arr) => {
                // Add ellipsis where there are gaps
                const showEllipsisBefore = idx > 0 && page - arr[idx - 1] > 1;
                return (
                  <span key={page} className="flex items-center">
                    {showEllipsisBefore && <span className="text-gray-500 px-1">...</span>}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded text-sm ${
                        page === currentPage
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  </span>
                );
              })}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="btn btn-secondary text-sm px-3 py-1 disabled:opacity-50"
          >
            Next ›
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="btn btn-secondary text-sm px-3 py-1 disabled:opacity-50"
          >
            »»
          </button>
        </div>
      )}
    </div>
  );
}

