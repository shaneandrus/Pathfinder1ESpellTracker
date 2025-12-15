import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getClassById, CLASSES } from '../data/classes';
import { calculateCharacterLevel } from '../store/characterStore';
import type { CharacterClass } from '../types';

export function CharacterListView() {
  const { state, selectCharacter, createNewCharacter, deleteCharacter } = useApp();
  const [showCreate, setShowCreate] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Characters</h1>
        <button onClick={() => setShowCreate(true)} className="btn btn-primary">
          + New Character
        </button>
      </div>
      
      {state.characters.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-400 mb-4">No characters yet</p>
          <button onClick={() => setShowCreate(true)} className="btn btn-primary">
            Create Your First Character
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {state.characters.map(char => {
            const level = calculateCharacterLevel(char.classes);
            const classNames = char.classes.map(c => {
              const def = getClassById(c.classId);
              return `${def?.name || c.classId} ${c.classLevel}`;
            }).join(' / ');
            
            return (
              <div key={char.id} className="card flex items-center justify-between">
                <div 
                  className="flex-1 cursor-pointer" 
                  onClick={() => selectCharacter(char.id)}
                >
                  <h3 className="font-semibold text-white">{char.name}</h3>
                  <p className="text-sm text-gray-400">Level {level} • {classNames}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => selectCharacter(char.id)}
                    className="btn btn-primary text-sm py-1 px-3"
                  >
                    Select
                  </button>
                  {deleteConfirmId === char.id ? (
                    <>
                      <button 
                        onClick={() => { deleteCharacter(char.id); setDeleteConfirmId(null); }}
                        className="btn btn-danger text-sm py-1 px-3"
                      >
                        Confirm
                      </button>
                      <button 
                        onClick={() => setDeleteConfirmId(null)}
                        className="btn btn-secondary text-sm py-1 px-3"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setDeleteConfirmId(char.id)}
                      className="btn btn-secondary text-sm py-1 px-3 text-red-400"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {showCreate && (
        <CreateCharacterModal onClose={() => setShowCreate(false)} onCreate={createNewCharacter} />
      )}
    </div>
  );
}

interface CreateModalProps {
  onClose: () => void;
  onCreate: (name: string, classes: CharacterClass[]) => void;
}

function CreateCharacterModal({ onClose, onCreate }: CreateModalProps) {
  const [name, setName] = useState('');
  const [selectedClasses, setSelectedClasses] = useState<CharacterClass[]>([
    { classId: 'wizard', classLevel: 1, abilityModifier: 3 }
  ]);
  
  const nonPrestigeClasses = CLASSES.filter(c => !c.isPrestigeClass);
  const prestigeClasses = CLASSES.filter(c => c.isPrestigeClass);
  
  const addClassSlot = () => {
    setSelectedClasses([...selectedClasses, { classId: 'fighter', classLevel: 1, abilityModifier: 0 }]);
  };
  
  const updateClass = (index: number, updates: Partial<CharacterClass>) => {
    const newClasses = [...selectedClasses];
    newClasses[index] = { ...newClasses[index], ...updates };
    setSelectedClasses(newClasses);
  };
  
  const removeClass = (index: number) => {
    setSelectedClasses(selectedClasses.filter((_, i) => i !== index));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && selectedClasses.length > 0) {
      onCreate(name.trim(), selectedClasses);
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-4">Create Character</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="label">Character Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="input"
              placeholder="Enter name..."
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="label">Classes</label>

            {/* Column headers */}
            <div className="flex gap-2 mb-2 text-xs text-gray-400">
              <div className="flex-1">Class</div>
              <div className="w-16 text-center">Level</div>
              <div className="w-16 text-center">Mod</div>
              {selectedClasses.length > 1 && <div className="w-10"></div>}
            </div>

            {selectedClasses.map((sc, index) => {
              const classDef = getClassById(sc.classId);
              return (
                <div key={index} className="flex gap-2 mb-2 items-start">
                  <select
                    value={sc.classId}
                    onChange={e => updateClass(index, { classId: e.target.value })}
                    className="input flex-1"
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
                  <input
                    type="number"
                    value={sc.classLevel}
                    onChange={e => updateClass(index, { classLevel: Math.max(1, Math.min(20, parseInt(e.target.value) || 1)) })}
                    className="input w-16 text-center"
                    min={1}
                    max={20}
                    title="Class Level"
                  />
                  {classDef?.castingAbility ? (
                    <input
                      type="number"
                      value={sc.abilityModifier}
                      onChange={e => updateClass(index, { abilityModifier: parseInt(e.target.value) || 0 })}
                      className="input w-16 text-center"
                      title={`${classDef.castingAbility} modifier for bonus spells`}
                    />
                  ) : (
                    <div className="w-16 flex items-center justify-center text-gray-500">—</div>
                  )}
                  {selectedClasses.length > 1 && (
                    <button type="button" onClick={() => removeClass(index)} className="btn btn-secondary py-2 px-3">
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
            <button type="button" onClick={addClassSlot} className="btn btn-secondary text-sm mt-2">
              + Add Class
            </button>
          </div>
          
          <div className="flex gap-2 justify-end mt-6">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Character
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

