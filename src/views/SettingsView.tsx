import { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getClassById } from '../data/classes';
import { getAllSources } from '../data/spells';
import type { SpellSlotOverride } from '../types';
import { DEFAULT_HOMEBREW_SETTINGS } from '../types';

// Official Paizo hardback rulebooks only (no Player Companions, Campaign Setting, or third-party)
const PAIZO_HARDBACKS = [
  'PFRPG Core',
  'Advanced Class Guide',
  'Advanced Player\'s Guide',
  'Advanced Race Guide',
  'Bestiary 2',
  'Bestiary 3',
  'Bestiary 4',
  'Bestiary 5',
  'Bestiary 6',
  'Book of the Damned',
  'GameMastery Guide',
  'Horror Adventures',
  'Mythic Adventures',
  'Occult Adventures',
  'Planar Adventures',
  'Ultimate Campaign',
  'Ultimate Combat',
  'Ultimate Equipment',
  'Ultimate Intrigue',
  'Ultimate Magic',
  'Ultimate Wilderness',
  'Villain Codex',
  'Strategy Guide',
];

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return (s[(v - 20) % 10] || s[v] || s[0]);
}

export function SettingsView() {
  const { state, activeCharacter, setView, updateSpellSlotOverride, removeSpellSlotOverride, clearClassSpellSlotOverrides, setAllowedSources } = useApp();
  const [editingSlot, setEditingSlot] = useState<{ spellLevel: number; value: string } | null>(null);
  const [sourceSearch, setSourceSearch] = useState('');

  // Get all available sources from spells
  const allSources = useMemo(() => getAllSources(state.spells), [state.spells]);

  // Current allowed sources for this character
  const allowedSources = activeCharacter?.homebrewSettings?.allowedSources || DEFAULT_HOMEBREW_SETTINGS.allowedSources;

  // Filter sources by search
  const filteredSources = useMemo(() => {
    if (!sourceSearch) return allSources;
    const query = sourceSearch.toLowerCase();
    return allSources.filter(s => s.toLowerCase().includes(query));
  }, [allSources, sourceSearch]);

  // Get spellcasting classes that the character actually has
  const characterSpellcastingClasses = (activeCharacter?.classes || [])
    .map(c => ({ charClass: c, def: getClassById(c.classId) }))
    .filter(x => x.def && x.def.casterType !== 'none' && !x.def.isPrestigeClass);

  const [selectedClassId, setSelectedClassId] = useState<string>(
    characterSpellcastingClasses[0]?.charClass.classId || ''
  );

  // Update selected class if character changes
  useEffect(() => {
    if (characterSpellcastingClasses.length > 0 && !characterSpellcastingClasses.find(x => x.charClass.classId === selectedClassId)) {
      setSelectedClassId(characterSpellcastingClasses[0].charClass.classId);
    }
  }, [activeCharacter?.id]);

  // Toggle a source on/off
  const toggleSource = (source: string) => {
    if (allowedSources.includes(source)) {
      setAllowedSources(allowedSources.filter(s => s !== source));
    } else {
      setAllowedSources([...allowedSources, source]);
    }
  };

  // Select all / clear all sources
  const selectAllSources = () => setAllowedSources([]);
  const clearAllSources = () => setAllowedSources(['_none_']); // Set to impossible value to block all
  const selectPaizoHardbacksOnly = () => {
    // Only include hardbacks that exist in our spell database
    const availableHardbacks = PAIZO_HARDBACKS.filter(hb => allSources.includes(hb));
    setAllowedSources(availableHardbacks);
  };

  // Get the current class level for the selected class
  const selectedCharClass = activeCharacter?.classes.find(c => c.classId === selectedClassId);
  const selectedClassLevel = selectedCharClass?.classLevel || 1;
  const classDef = getClassById(selectedClassId);

  const homebrewSettings = activeCharacter?.homebrewSettings || { spellSlotOverrides: [] };
  const classOverrides = homebrewSettings.spellSlotOverrides.filter(o => o.classId === selectedClassId);

  const getDefaultSlots = (spellLevel: number): number => {
    if (!classDef) return 0;
    const progression = classDef.spellProgression[selectedClassLevel];
    return progression ? progression[spellLevel] ?? 0 : 0;
  };

  const getEffectiveSlots = (spellLevel: number): number => {
    const override = classOverrides.find(o => o.classLevel === selectedClassLevel && o.spellLevel === spellLevel);
    return override ? override.slots : getDefaultSlots(spellLevel);
  };

  const hasOverride = (spellLevel: number): boolean => {
    return classOverrides.some(o => o.classLevel === selectedClassLevel && o.spellLevel === spellLevel);
  };

  const handleSaveOverride = (spellLevel: number, value: string) => {
    const slots = parseInt(value);
    if (!isNaN(slots) && slots >= 0) {
      const override: SpellSlotOverride = { classId: selectedClassId, classLevel: selectedClassLevel, spellLevel, slots };
      updateSpellSlotOverride(override);
    }
    setEditingSlot(null);
  };

  const handleSetUnlimited = (spellLevel: number) => {
    const override: SpellSlotOverride = { classId: selectedClassId, classLevel: selectedClassLevel, spellLevel, slots: -1 };
    updateSpellSlotOverride(override);
  };

  const isUnlimited = (spellLevel: number): boolean => {
    return getEffectiveSlots(spellLevel) === -1;
  };

  if (!activeCharacter) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-400">Please select a character first.</p>
        <button onClick={() => setView('characters')} className="btn btn-primary mt-4">Go to Characters</button>
      </div>
    );
  }

  if (characterSpellcastingClasses.length === 0) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Homebrew Settings</h1>
            <p className="text-gray-400">Customize settings for {activeCharacter.name}</p>
          </div>
          <button onClick={() => setView('slots')} className="btn btn-secondary">← Back</button>
        </div>
        <div className="card text-center py-8">
          <p className="text-gray-400">This character has no spellcasting classes.</p>
          <button onClick={() => setView('manage')} className="btn btn-primary mt-4">Add a Spellcasting Class</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Homebrew Settings</h1>
          <p className="text-gray-400">Customize settings for {activeCharacter.name}</p>
        </div>
        <button onClick={() => setView('slots')} className="btn btn-secondary">← Back</button>
      </div>

      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-purple-400 mb-4">Spell Slot Overrides</h2>
        <p className="text-sm text-gray-400 mb-4">
          Override the default number of base spell slots for your current level.
          These overrides apply to your current class level and will update automatically when you level up.
        </p>

        {characterSpellcastingClasses.length > 1 && (
          <div className="mb-4">
            <label className="label">Class</label>
            <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)} className="input w-full max-w-xs">
              {characterSpellcastingClasses.map(x => (
                <option key={x.charClass.classId} value={x.charClass.classId}>
                  {x.def!.name} (Level {x.charClass.classLevel})
                </option>
              ))}
            </select>
          </div>
        )}

        {classDef && (
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <span className="text-white font-medium">{classDef.name}</span>
            <span className="text-gray-400 ml-2">Level {selectedClassLevel}</span>
          </div>
        )}

        {classDef && classDef.maxSpellLevel > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 px-3 text-gray-400">Spell Level</th>
                  <th className="text-center py-2 px-3 text-gray-400">Default</th>
                  <th className="text-center py-2 px-3 text-gray-400">Override</th>
                  <th className="text-center py-2 px-3 text-gray-400">Unlimited</th>
                  <th className="text-center py-2 px-3 text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: classDef.maxSpellLevel + 1 }, (_, i) => i).map(spellLevel => {
                  const defaultSlots = getDefaultSlots(spellLevel);
                  const effectiveSlots = getEffectiveSlots(spellLevel);
                  const isOverridden = hasOverride(spellLevel);
                  const isEditing = editingSlot?.spellLevel === spellLevel;
                  const unlimited = isUnlimited(spellLevel);
                  return (
                    <tr key={spellLevel} className="border-b border-gray-800">
                      <td className="py-2 px-3 text-gray-300">
                        {spellLevel === 0 ? 'Cantrips (0)' : `${spellLevel}${getOrdinalSuffix(spellLevel)} Level`}
                      </td>
                      <td className="text-center py-2 px-3 text-gray-500">{defaultSlots}</td>
                      <td className="text-center py-2 px-3">
                        {unlimited ? (
                          <span className="text-yellow-400 font-medium">∞</span>
                        ) : isEditing ? (
                          <input type="number" min="0" max="20" value={editingSlot.value}
                            onChange={e => setEditingSlot({ spellLevel, value: e.target.value })}
                            onBlur={() => handleSaveOverride(spellLevel, editingSlot.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSaveOverride(spellLevel, editingSlot.value)}
                            className="input w-16 text-center py-1" autoFocus />
                        ) : (
                          <span className={isOverridden ? 'text-purple-400 font-medium' : 'text-gray-500'}>
                            {isOverridden ? effectiveSlots : '—'}
                          </span>
                        )}
                      </td>
                      <td className="text-center py-2 px-3">
                        <input
                          type="checkbox"
                          checked={unlimited}
                          onChange={e => e.target.checked ? handleSetUnlimited(spellLevel) : removeSpellSlotOverride(selectedClassId, selectedClassLevel, spellLevel)}
                          className="w-4 h-4 accent-yellow-500"
                        />
                      </td>
                      <td className="text-center py-2 px-3">
                        <div className="flex justify-center gap-2">
                          {!unlimited && (
                            <button onClick={() => setEditingSlot({ spellLevel, value: (effectiveSlots >= 0 ? effectiveSlots : defaultSlots).toString() })}
                              className="text-indigo-400 hover:text-indigo-300 text-xs">Edit</button>
                          )}
                          {isOverridden && (
                            <button onClick={() => removeSpellSlotOverride(selectedClassId, selectedClassLevel, spellLevel)}
                              className="text-red-400 hover:text-red-300 text-xs">Reset</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {classOverrides.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <button onClick={() => confirm(`Clear all ${classDef?.name} overrides?`) && clearClassSpellSlotOverrides(selectedClassId)}
              className="btn btn-danger text-sm">Clear All {classDef?.name} Overrides ({classOverrides.length})</button>
          </div>
        )}
      </div>

      {/* Allowed Source Books */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-purple-400 mb-4">Allowed Source Books</h2>
        <p className="text-sm text-gray-400 mb-4">
          Filter which source books spells can be added from. If none are selected, all sources are allowed.
        </p>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="Search sources..."
            value={sourceSearch}
            onChange={e => setSourceSearch(e.target.value)}
            className="input flex-1 min-w-[150px]"
          />
          <button onClick={selectAllSources} className="btn btn-secondary text-sm">Allow All</button>
          <button onClick={selectPaizoHardbacksOnly} className="btn btn-primary text-sm">Paizo Hardbacks Only</button>
          <button onClick={clearAllSources} className="btn btn-secondary text-sm">Block All</button>
        </div>

        <div className="mb-2 text-sm text-gray-400">
          {allowedSources.length === 0 ? (
            <span className="text-green-400">✓ All sources allowed ({allSources.length} total)</span>
          ) : allowedSources[0] === '_none_' ? (
            <span className="text-red-400">✗ All sources blocked</span>
          ) : (
            <span>{allowedSources.length} of {allSources.length} sources selected</span>
          )}
        </div>

        <div className="max-h-64 overflow-y-auto border border-gray-700 rounded-lg">
          {filteredSources.map(source => {
            const isAllowed = allowedSources.length === 0 || allowedSources.includes(source);
            const isBlocked = allowedSources[0] === '_none_';
            return (
              <label
                key={source}
                className={`flex items-center gap-3 px-3 py-2 hover:bg-gray-700/50 cursor-pointer border-b border-gray-800 last:border-b-0 ${
                  isAllowed && !isBlocked ? 'text-gray-200' : 'text-gray-500'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isAllowed && !isBlocked}
                  onChange={() => {
                    if (allowedSources.length === 0) {
                      // Currently allowing all - switching to whitelist mode with just this source removed
                      setAllowedSources(allSources.filter(s => s !== source));
                    } else if (isBlocked) {
                      // Currently blocking all - switch to only this source
                      setAllowedSources([source]);
                    } else {
                      toggleSource(source);
                    }
                  }}
                  className="w-4 h-4 accent-purple-500"
                />
                <span className="text-sm">{source}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

