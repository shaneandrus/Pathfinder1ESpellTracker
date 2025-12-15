import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getClassById, getPrestigeClasses, getNonPrestigeClasses } from '../data/classes';
import type { CharacterClass } from '../types';

export function ManageClassesView() {
  const { activeCharacter, updateClasses, setView } = useApp();
  const [classes, setClasses] = useState<CharacterClass[]>(activeCharacter?.classes || []);
  const [hasChanges, setHasChanges] = useState(false);
  
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
  
  const nonPrestigeClasses = getNonPrestigeClasses();
  const prestigeClasses = getPrestigeClasses();
  
  // Get spellcasting classes for prestige advancement
  const spellcastingClassIds = classes
    .filter(c => {
      const def = getClassById(c.classId);
      return def && def.casterType !== 'none' && !def.isPrestigeClass;
    })
    .map(c => c.classId);
  
  const updateClass = (index: number, updates: Partial<CharacterClass>) => {
    const newClasses = [...classes];
    newClasses[index] = { ...newClasses[index], ...updates };
    setClasses(newClasses);
    setHasChanges(true);
  };
  
  const addClass = (isPrestige: boolean) => {
    const defaultClass = isPrestige ? prestigeClasses[0] : nonPrestigeClasses[0];
    setClasses([...classes, { 
      classId: defaultClass.id, 
      classLevel: 1, 
      abilityModifier: 0 
    }]);
    setHasChanges(true);
  };
  
  const removeClass = (index: number) => {
    setClasses(classes.filter((_, i) => i !== index));
    setHasChanges(true);
  };
  
  const handleSave = () => {
    updateClasses(classes);
    setHasChanges(false);
    setView('slots');
  };
  
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Manage Classes</h1>
        <button onClick={() => setView('slots')} className="btn btn-secondary text-sm">
          ← Back
        </button>
      </div>
      
      <div className="space-y-4">
        {classes.map((charClass, index) => {
          const classDef = getClassById(charClass.classId);
          const advancesSpellcasting = classDef?.advancesSpellcasting || false;
          
          return (
            <div key={index} className="card">
              <div className="flex gap-2 items-start flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <label className="label text-xs">Class</label>
                  <select
                    value={charClass.classId}
                    onChange={e => updateClass(index, { classId: e.target.value, advancedByClassId: undefined })}
                    className="input w-full"
                  >
                    <optgroup label="Base Classes">
                      {nonPrestigeClasses.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Prestige Classes">
                      {prestigeClasses.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                
                <div className="w-20">
                  <label className="label text-xs">Level</label>
                  <input
                    type="number"
                    value={charClass.classLevel}
                    onChange={e => updateClass(index, { classLevel: Math.max(1, Math.min(20, parseInt(e.target.value) || 1)) })}
                    className="input w-full"
                    min={1}
                    max={20}
                  />
                </div>
                
                {classDef?.castingAbility && (
                  <div className="w-20">
                    <label className="label text-xs">{classDef.castingAbility} Mod</label>
                    <input
                      type="number"
                      value={charClass.abilityModifier}
                      onChange={e => updateClass(index, { abilityModifier: parseInt(e.target.value) || 0 })}
                      className="input w-full"
                    />
                  </div>
                )}
                
                <div className="pt-6">
                  <button onClick={() => removeClass(index)} className="btn btn-secondary py-2 px-3 text-red-400">
                    ✕
                  </button>
                </div>
              </div>
              
              {/* Prestige class advancement */}
              {advancesSpellcasting && spellcastingClassIds.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <label className="label text-xs">Advances Spellcasting Of</label>
                  <select
                    value={charClass.advancedByClassId || ''}
                    onChange={e => updateClass(index, { advancedByClassId: e.target.value || undefined })}
                    className="input"
                  >
                    <option value="">-- Select Class --</option>
                    {spellcastingClassIds.map(id => {
                      const def = getClassById(id);
                      return <option key={id} value={id}>{def?.name}</option>;
                    })}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="flex gap-2 mt-4">
        <button onClick={() => addClass(false)} className="btn btn-secondary">
          + Add Base Class
        </button>
        <button onClick={() => addClass(true)} className="btn btn-secondary">
          + Add Prestige Class
        </button>
      </div>
      
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900 border-t border-gray-700">
          <div className="max-w-2xl mx-auto flex gap-2">
            <button onClick={handleSave} className="btn btn-primary flex-1">
              Save Changes
            </button>
            <button onClick={() => { setClasses(activeCharacter.classes); setHasChanges(false); }} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

