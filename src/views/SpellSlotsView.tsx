import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ClassSpellSlots } from '../components/ClassSpellSlots';
import { getClassById } from '../data/classes';
import { getSpellById, getSpellAonUrl } from '../data/spells';
import { calculateCharacterLevel } from '../store/characterStore';
import type { Spell, KnownSpell } from '../types';

// Class colors for visual distinction
const CLASS_COLORS: { [key: string]: string } = {
  wizard: '#8b5cf6',
  sorcerer: '#ef4444',
  cleric: '#f59e0b',
  druid: '#22c55e',
  witch: '#6366f1',
  oracle: '#ec4899',
  bard: '#14b8a6',
  paladin: '#fbbf24',
  ranger: '#84cc16',
  magus: '#3b82f6',
  alchemist: '#f97316',
  inquisitor: '#64748b',
  summoner: '#a855f7',
  shaman: '#10b981',
  antipaladin: '#991b1b',
  bloodrager: '#dc2626',
  psychic: '#7c3aed',
  default: '#6b7280',
};

export function SpellSlotsView() {
  const { state, activeCharacter, toggleSlot, resetSlots, setView } = useApp();
  const [showResetAllConfirm, setShowResetAllConfirm] = useState(false);
  const [selectedSpellClassId, setSelectedSpellClassId] = useState<string | null>(null);

  if (!activeCharacter) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-300 mb-4">No Character Selected</h2>
        <button onClick={() => setView('characters')} className="btn btn-primary">
          Select or Create Character
        </button>
      </div>
    );
  }

  const characterLevel = calculateCharacterLevel(activeCharacter.classes);
  const spellcastingClasses = activeCharacter.classes.filter(c => {
    const classDef = getClassById(c.classId);
    return classDef && classDef.casterType !== 'none' && !classDef.isPrestigeClass;
  });

  const activeSpellClassId = selectedSpellClassId || spellcastingClasses[0]?.classId;

  const handleResetAll = () => {
    resetSlots();
    setShowResetAllConfirm(false);
  };

  // Cast a spell by using a slot of the given level
  const castSpell = (classId: string, spellLevel: number) => {
    if (spellLevel === 0) return; // Cantrips don't use slots

    // Find the spell slots for this class
    const classSlots = activeCharacter.spellSlots.find(s => s.classId === classId);
    if (!classSlots) return;

    const levelSlots = classSlots.slots[spellLevel];
    if (!levelSlots) return;

    // Find the first available (unused) slot
    const availableSlotIndex = Array.from({ length: levelSlots.total })
      .findIndex((_, i) => i >= levelSlots.used);

    if (availableSlotIndex !== -1 && levelSlots.used < levelSlots.total) {
      toggleSlot(classId, spellLevel, levelSlots.used);
    }
  };

  // Check if there are available slots for a spell level
  const hasAvailableSlot = (classId: string, spellLevel: number): boolean => {
    if (spellLevel === 0) return true; // Cantrips are always available

    const classSlots = activeCharacter.spellSlots.find(s => s.classId === classId);
    if (!classSlots) return false;

    const levelSlots = classSlots.slots[spellLevel];
    if (!levelSlots) return false;

    // Unlimited slots (-1) are always available
    if (levelSlots.total === -1) return true;

    return levelSlots.used < levelSlots.total;
  };

  // Get PREPARED spells for the selected class, grouped by level
  const preparedSpellsByLevel = useMemo(() => {
    if (!activeSpellClassId) return {};

    const groups: { [level: number]: (KnownSpell & { spell: Spell })[] } = {};

    activeCharacter.knownSpells
      .filter(ks => ks.classId === activeSpellClassId && ks.isPrepared)
      .forEach(ks => {
        const spell = getSpellById(state.spells, ks.spellId);
        if (spell) {
          const level = spell.classLevels[activeSpellClassId] || 0;
          if (!groups[level]) groups[level] = [];
          groups[level].push({ ...ks, spell });
        }
      });

    // Sort spells within each level by name
    Object.values(groups).forEach(spells =>
      spells.sort((a, b) => a.spell.name.localeCompare(b.spell.name))
    );

    return groups;
  }, [activeCharacter.knownSpells, activeSpellClassId, state.spells]);

  const spellLevels = Object.keys(preparedSpellsByLevel).map(Number).sort((a, b) => a - b);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">{activeCharacter.name}</h1>
        <p className="text-gray-400">
          Character Level {characterLevel} •
          {activeCharacter.classes.map(c => {
            const classDef = getClassById(c.classId);
            return ` ${classDef?.name || c.classId} ${c.classLevel}`;
          }).join(' /')}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setView('spellbook')} className="btn btn-secondary text-sm">
          📖 Spellbook
        </button>
        <button onClick={() => setView('manage')} className="btn btn-secondary text-sm">
          ⚙️ Manage Classes
        </button>
        {showResetAllConfirm ? (
          <>
            <button onClick={handleResetAll} className="btn btn-danger text-sm">
              ✓ Confirm Reset All
            </button>
            <button onClick={() => setShowResetAllConfirm(false)} className="btn btn-secondary text-sm">
              ✕ Cancel
            </button>
          </>
        ) : (
          <button onClick={() => setShowResetAllConfirm(true)} className="btn btn-secondary text-sm">
            🔄 New Day (Reset All)
          </button>
        )}
      </div>

      {/* Two-column layout: Spell Slots (left) + Prepared Spells (right) */}
      {spellcastingClasses.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-gray-400">No spellcasting classes</p>
          <button onClick={() => setView('manage')} className="btn btn-primary mt-4">
            Add a Spellcasting Class
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Spell Slots */}
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Spell Slots</h2>
            {spellcastingClasses.map(charClass => {
              const slots = activeCharacter.spellSlots.find(s => s.classId === charClass.classId);
              if (!slots) return null;

              const color = CLASS_COLORS[charClass.classId] || CLASS_COLORS.default;

              return (
                <ClassSpellSlots
                  key={charClass.classId}
                  charClass={charClass}
                  spellSlots={slots}
                  onToggleSlot={(level, index) => toggleSlot(charClass.classId, level, index)}
                  onResetSlots={() => resetSlots(charClass.classId)}
                  classColor={color}
                />
              );
            })}
          </div>

          {/* Right Column: Prepared/Known Spells */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Prepared Spells</h2>
              {spellcastingClasses.length > 1 && (
                <select
                  value={activeSpellClassId || ''}
                  onChange={e => setSelectedSpellClassId(e.target.value)}
                  className="input text-sm py-1"
                >
                  {spellcastingClasses.map(c => {
                    const def = getClassById(c.classId);
                    return (
                      <option key={c.classId} value={c.classId}>
                        {def?.name || c.classId}
                      </option>
                    );
                  })}
                </select>
              )}
            </div>

            {spellLevels.length === 0 ? (
              <div className="card text-center py-6">
                <p className="text-gray-400 mb-3">No spells prepared yet</p>
                <button onClick={() => setView('spellbook')} className="btn btn-primary text-sm">
                  📖 Open Spellbook to Prepare
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {spellLevels.map(level => {
                  const classSlots = activeCharacter.spellSlots.find(s => s.classId === activeSpellClassId);
                  const levelSlots = classSlots?.slots[level];
                  const isUnlimitedSlots = levelSlots?.total === -1;
                  const slotsRemaining = levelSlots ? (isUnlimitedSlots ? Infinity : levelSlots.total - levelSlots.used) : 0;

                  return (
                    <div key={level} className="card py-3 px-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-purple-400">
                          {level === 0 ? 'Cantrips' : `Level ${level}`}
                        </h3>
                        {level > 0 && (
                          isUnlimitedSlots ? (
                            <span className="text-xs text-yellow-400">∞ unlimited</span>
                          ) : (
                            <span className={`text-xs ${slotsRemaining > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {slotsRemaining} slots left
                            </span>
                          )
                        )}
                      </div>
                      <div className="space-y-1">
                        {preparedSpellsByLevel[level].map(ks => {
                          const canCast = level === 0 || isUnlimitedSlots || hasAvailableSlot(activeSpellClassId!, level);
                          return (
                            <div
                              key={ks.spellId}
                              className="flex items-center gap-2 text-sm text-gray-200 hover:bg-gray-700/50 rounded px-2 py-1 transition-colors"
                            >
                              {level > 0 && !isUnlimitedSlots ? (
                                <button
                                  onClick={() => castSpell(activeSpellClassId!, level)}
                                  disabled={!canCast}
                                  className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                                    canCast
                                      ? 'bg-purple-600 hover:bg-purple-500 text-white'
                                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                  }`}
                                  title={canCast ? 'Cast this spell' : 'No slots remaining'}
                                >
                                  Cast
                                </button>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-700 text-yellow-200">
                                  ∞
                                </span>
                              )}
                              <a
                                href={getSpellAonUrl(ks.spell.name)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 hover:text-purple-300"
                              >
                                {ks.spell.name}
                                <span className="text-gray-500 text-xs ml-2">{ks.spell.school}</span>
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                <button
                  onClick={() => setView('spellbook')}
                  className="btn btn-secondary text-sm w-full"
                >
                  📖 Change Prepared Spells
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

