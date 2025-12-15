import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getClassById } from '../data/classes';
import { getSpellById, getSpellAonUrl } from '../data/spells';
import type { Spell, KnownSpell } from '../types';

export function SpellbookView() {
  const { state, activeCharacter, togglePrepared, setView } = useApp();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [expandedSpellId, setExpandedSpellId] = useState<number | null>(null);
  
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
  const _activeClassDef = activeClassId ? getClassById(activeClassId) : null;
  void _activeClassDef; // Suppress unused variable warning
  
  // Get all known spells for the selected class
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
  
  // Group by level
  const groupedByLevel = useMemo(() => {
    const groups: { [level: number]: (KnownSpell & { spell: Spell })[] } = {};
    for (const ks of knownSpells) {
      const level = ks.spell.classLevels[activeClassId!] || 0;
      if (!groups[level]) groups[level] = [];
      groups[level].push(ks);
    }
    // Sort within each level
    Object.values(groups).forEach(spells => 
      spells.sort((a, b) => a.spell.name.localeCompare(b.spell.name))
    );
    return groups;
  }, [knownSpells, activeClassId]);
  
  const spellLevels = Object.keys(groupedByLevel).map(Number).sort((a, b) => a - b);
  
  // Count prepared spells per level
  const preparedCounts = useMemo(() => {
    const counts: { [level: number]: number } = {};
    for (const level of spellLevels) {
      counts[level] = groupedByLevel[level].filter(ks => ks.isPrepared).length;
    }
    return counts;
  }, [groupedByLevel, spellLevels]);

  // Get slot counts per level for the active class
  const slotCounts = useMemo(() => {
    const counts: { [level: number]: number } = {};
    if (!activeClassId) return counts;
    const classSlots = activeCharacter.spellSlots.find(s => s.classId === activeClassId);
    if (!classSlots) return counts;
    for (const [level, slot] of Object.entries(classSlots.slots)) {
      counts[parseInt(level)] = slot.total; // -1 means unlimited
    }
    return counts;
  }, [activeCharacter.spellSlots, activeClassId]);

  // Check if we can prepare more spells at a given level
  const canPrepareMore = (level: number): boolean => {
    const slots = slotCounts[level];
    if (slots === undefined) return false;
    if (slots === -1) return true; // Unlimited
    if (level === 0) return true; // Cantrips are always preparable
    return preparedCounts[level] < slots;
  };
  
  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Spellbook</h1>
          <p className="text-gray-400">{activeCharacter.name}'s known spells</p>
        </div>
        <button onClick={() => setView('slots')} className="btn btn-secondary">
          ← Back to Slots
        </button>
      </div>
      
      {/* Class selector for gestalt */}
      {spellcastingClasses.length > 1 && (
        <div className="mb-6">
          <label className="label">Spellcasting Class</label>
          <div className="flex gap-2 flex-wrap">
            {spellcastingClasses.map(c => {
              const def = getClassById(c.classId);
              const isActive = c.classId === activeClassId;
              return (
                <button
                  key={c.classId}
                  onClick={() => setSelectedClassId(c.classId)}
                  className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {def?.name || c.classId} {c.classLevel}
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Add spells button */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setView('addSpell')} className="btn btn-primary">
          + Add Spells
        </button>
        <button onClick={() => setView('spells')} className="btn btn-secondary">
          📋 Manage Known Spells
        </button>
      </div>
      
      {/* Spells grouped by level */}
      {spellLevels.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-gray-400 mb-4">No spells in your spellbook yet</p>
          <button onClick={() => setView('addSpell')} className="btn btn-primary">
            Add Your First Spell
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {spellLevels.map(level => {
            const spells = groupedByLevel[level];
            const preparedCount = preparedCounts[level];
            const totalSlots = slotCounts[level] ?? 0;
            const isUnlimited = totalSlots === -1;
            const atCapacity = !isUnlimited && level > 0 && preparedCount >= totalSlots;

            return (
              <div key={level} className="card">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-purple-400">
                    {level === 0 ? 'Cantrips' : `Level ${level}`}
                  </h2>
                  <span className={`text-sm ${atCapacity ? 'text-yellow-400' : 'text-gray-400'}`}>
                    {level === 0 ? (
                      `${preparedCount} prepared (at will)`
                    ) : isUnlimited ? (
                      `${preparedCount} prepared (∞ slots)`
                    ) : (
                      `${preparedCount} / ${totalSlots} slots`
                    )}
                  </span>
                </div>

                <div className="space-y-2">
                  {spells.map(ks => {
                    const isExpanded = expandedSpellId === ks.spellId;
                    const canToggle = ks.isPrepared || canPrepareMore(level);
                    return (
                      <div
                        key={ks.spellId}
                        className={`rounded-lg border transition-colors ${
                          ks.isPrepared
                            ? 'border-purple-500 bg-purple-900/20'
                            : 'border-gray-700 bg-gray-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-3 p-3">
                          {/* Prepare checkbox */}
                          <button
                            onClick={() => canToggle && togglePrepared(ks.spellId, activeClassId!)}
                            disabled={!canToggle}
                            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                              ks.isPrepared
                                ? 'bg-purple-600 border-purple-600 text-white'
                                : canToggle
                                  ? 'border-gray-500 hover:border-purple-400'
                                  : 'border-gray-700 bg-gray-800 cursor-not-allowed opacity-50'
                            }`}
                            title={ks.isPrepared ? 'Unprepare spell' : canToggle ? 'Prepare spell' : 'No slots available'}
                          >
                            {ks.isPrepared && '✓'}
                          </button>
                          
                          {/* Spell info */}
                          <div 
                            className="flex-1 cursor-pointer"
                            onClick={() => setExpandedSpellId(isExpanded ? null : ks.spellId)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white">{ks.spell.name}</span>
                              <span className="text-xs text-gray-500">{ks.spell.school}</span>
                            </div>
                          </div>
                          
                          {/* AoN link */}
                          <a
                            href={getSpellAonUrl(ks.spell.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:text-indigo-300 p-2"
                            title="View on Archives of Nethys"
                            onClick={e => e.stopPropagation()}
                          >
                            🔗
                          </a>
                        </div>
                        
                        {/* Expanded details */}
                        {isExpanded && (
                          <div className="px-3 pb-3 pt-0 text-sm text-gray-300 border-t border-gray-700">
                            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                              <div><span className="text-gray-500">Casting:</span> {ks.spell.castingTime}</div>
                              <div><span className="text-gray-500">Range:</span> {ks.spell.range}</div>
                              <div><span className="text-gray-500">Duration:</span> {ks.spell.duration}</div>
                              <div><span className="text-gray-500">Save:</span> {ks.spell.savingThrow}</div>
                            </div>
                            <p className="mt-2 text-gray-400 line-clamp-3">{ks.spell.description}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

