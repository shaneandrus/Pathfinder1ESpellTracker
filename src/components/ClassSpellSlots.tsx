import { useState } from 'react';
import type { ClassSpellSlots as ClassSpellSlotsType, CharacterClass } from '../types';
import { getClassById } from '../data/classes';
import { SpellSlotRow } from './SpellSlotRow';
import { calculateSpellDC } from '../store/characterStore';

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

interface ClassSpellSlotsProps {
  charClass: CharacterClass;
  spellSlots: ClassSpellSlotsType;
  onToggleSlot: (spellLevel: number, slotIndex: number) => void;
  onResetSlots: () => void;
  classColor: string;
}

export function ClassSpellSlots({ 
  charClass, 
  spellSlots, 
  onToggleSlot, 
  onResetSlots,
  classColor 
}: ClassSpellSlotsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const classDef = getClassById(charClass.classId);
  if (!classDef) return null;

  // Check if any slots are unlimited (-1)
  const hasUnlimited = Object.values(spellSlots.slots).some(s => s.total === -1);
  const totalSlots = Object.values(spellSlots.slots).reduce((sum, s) => s.total === -1 ? sum : sum + s.total, 0);
  const usedSlots = Object.values(spellSlots.slots).reduce((sum, s) => s.total === -1 ? sum : sum + s.used, 0);
  
  const handleReset = () => {
    onResetSlots();
    setShowResetConfirm(false);
  };
  
  return (
    <div className="card mb-4" style={{ borderLeft: `4px solid ${classColor}` }}>
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold" style={{ color: classColor }}>
            {classDef.name}
          </h3>
          <span className="text-sm text-gray-400">
            Level {charClass.classLevel}
            {spellSlots.effectiveCasterLevel !== charClass.classLevel && 
              ` (CL ${spellSlots.effectiveCasterLevel})`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {hasUnlimited ? (
              <>∞ + {totalSlots - usedSlots}/{totalSlots} slots</>
            ) : (
              <>{totalSlots - usedSlots}/{totalSlots} slots</>
            )}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4">
          {/* Spell DCs */}
          <div className="mb-4 text-sm text-gray-400">
            <span className="font-medium">Spell DCs: </span>
            {Object.keys(spellSlots.slots)
              .filter(l => parseInt(l) > 0)
              .slice(0, 4)
              .map(l => `${getOrdinalSuffix(parseInt(l))}: ${calculateSpellDC(charClass.abilityModifier, parseInt(l))}`)
              .join(', ')}
            {Object.keys(spellSlots.slots).length > 5 && '...'}
          </div>
          
          {/* Spell Slots */}
          <div className="space-y-1">
            {Object.entries(spellSlots.slots)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([level, slot]) => (
                <SpellSlotRow
                  key={level}
                  level={parseInt(level)}
                  slot={slot}
                  onToggle={(index) => onToggleSlot(parseInt(level), index)}
                  classColor={classColor}
                />
              ))}
          </div>
          
          {/* Reset Button */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            {showResetConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">Reset all slots?</span>
                <button onClick={handleReset} className="btn btn-danger text-sm py-1 px-3">
                  Yes, Reset
                </button>
                <button onClick={() => setShowResetConfirm(false)} className="btn btn-secondary text-sm py-1 px-3">
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowResetConfirm(true)}
                className="btn btn-secondary text-sm"
              >
                Reset {classDef.name} Slots
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

