import type { Character, CharacterClass, ClassSpellSlots, KnownSpell, SpellSlotState } from '../types';
import { getClassById } from '../data/classes';
import { getSpellSlots as getHomebrewSpellSlots } from './settingsStore';

const STORAGE_KEY = 'pathfinder_spell_tracker';

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Calculate bonus spells per day based on ability modifier
export function calculateBonusSpells(abilityModifier: number, spellLevel: number): number {
  if (spellLevel === 0) return 0; // No bonus 0-level spells
  if (abilityModifier < spellLevel) return 0;
  return Math.floor((abilityModifier - spellLevel) / 4) + 1;
}

// Calculate effective caster level including prestige class advancement
export function calculateEffectiveCasterLevel(
  character: Character,
  baseClassId: string
): number {
  const baseClass = character.classes.find(c => c.classId === baseClassId);
  if (!baseClass) return 0;
  
  let effectiveLevel = baseClass.classLevel;
  
  // Add levels from prestige classes that advance this class
  for (const charClass of character.classes) {
    if (charClass.advancedByClassId === baseClassId) {
      effectiveLevel += charClass.classLevel;
    }
  }
  
  return Math.min(effectiveLevel, 20); // Cap at 20
}

// Calculate spell slots for a class (with homebrew overrides)
export function calculateSpellSlots(
  character: Character,
  charClass: CharacterClass
): ClassSpellSlots {
  const classDef = getClassById(charClass.classId);
  if (!classDef || classDef.casterType === 'none') {
    return {
      classId: charClass.classId,
      effectiveCasterLevel: 0,
      slots: {},
    };
  }

  const effectiveLevel = calculateEffectiveCasterLevel(character, charClass.classId);
  const progression = classDef.spellProgression[effectiveLevel] || [];
  const homebrewSettings = character.homebrewSettings || { spellSlotOverrides: [] };

  const slots: { [spellLevel: number]: SpellSlotState } = {};

  for (let level = 0; level <= classDef.maxSpellLevel; level++) {
    const defaultSlots = progression[level] || 0;
    // Check for homebrew override - uses the class level from charClass, not effective level
    const baseSlots = getHomebrewSpellSlots(
      homebrewSettings,
      charClass.classId,
      charClass.classLevel,
      level,
      defaultSlots
    );

    // -1 means unlimited slots
    if (baseSlots === -1) {
      slots[level] = { total: -1, used: 0 };
    } else {
      // Only get bonus spells for spell levels where you have at least 1 base slot
      // (you can't get bonus 4th level spells if you can't cast 4th level spells yet)
      const bonusSlots = baseSlots > 0 ? calculateBonusSpells(charClass.abilityModifier, level) : 0;
      const totalSlots = baseSlots + bonusSlots;

      if (totalSlots > 0 || level === 0) {
        slots[level] = { total: totalSlots, used: 0 };
      }
    }
  }

  return {
    classId: charClass.classId,
    effectiveCasterLevel: effectiveLevel,
    slots,
  };
}

// Calculate character level (highest class level)
export function calculateCharacterLevel(classes: CharacterClass[]): number {
  return Math.max(...classes.map(c => c.classLevel), 0);
}

// Create a new character
export function createCharacter(name: string, classes: CharacterClass[]): Character {
  const character: Character = {
    id: generateId(),
    name,
    classes,
    spellSlots: [],
    knownSpells: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  // Calculate initial spell slots
  character.spellSlots = classes
    .filter(c => {
      const classDef = getClassById(c.classId);
      return classDef && classDef.casterType !== 'none' && !classDef.isPrestigeClass;
    })
    .map(c => calculateSpellSlots(character, c));
  
  return character;
}

// Load characters from localStorage
export function loadCharacters(): Character[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load characters:', e);
  }
  return [];
}

// Save characters to localStorage
export function saveCharacters(characters: Character[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
  } catch (e) {
    console.error('Failed to save characters:', e);
  }
}

// Toggle a spell slot (mark as used or available)
export function toggleSpellSlot(
  character: Character,
  classId: string,
  spellLevel: number,
  slotIndex: number
): Character {
  const updatedSlots = character.spellSlots.map(cs => {
    if (cs.classId !== classId) return cs;
    const slot = cs.slots[spellLevel];
    if (!slot) return cs;

    // If clicking on an available slot (index >= used), use it
    // If clicking on a used slot (index < used), restore it
    const currentUsed = slot.used;
    const newUsed = slotIndex < currentUsed ? slotIndex : slotIndex + 1;

    return {
      ...cs,
      slots: {
        ...cs.slots,
        [spellLevel]: { ...slot, used: Math.min(Math.max(0, newUsed), slot.total) },
      },
    };
  });

  return { ...character, spellSlots: updatedSlots, updatedAt: Date.now() };
}

// Reset all spell slots for a character (all classes or specific class)
export function resetSpellSlots(character: Character, classId?: string): Character {
  const updatedSlots = character.spellSlots.map(cs => {
    if (classId && cs.classId !== classId) return cs;

    const resetSlots: { [level: number]: SpellSlotState } = {};
    for (const [level, slot] of Object.entries(cs.slots)) {
      resetSlots[parseInt(level)] = { ...slot, used: 0 };
    }

    return { ...cs, slots: resetSlots };
  });

  return { ...character, spellSlots: updatedSlots, updatedAt: Date.now() };
}

// Add a known spell
export function addKnownSpell(
  character: Character,
  spellId: number,
  classId: string
): Character {
  // Check if already known for this class
  const exists = character.knownSpells.some(
    ks => ks.spellId === spellId && ks.classId === classId
  );
  if (exists) return character;

  const newSpell: KnownSpell = { spellId, classId };

  return {
    ...character,
    knownSpells: [...character.knownSpells, newSpell],
    updatedAt: Date.now(),
  };
}

// Remove a known spell
export function removeKnownSpell(
  character: Character,
  spellId: number,
  classId: string
): Character {
  return {
    ...character,
    knownSpells: character.knownSpells.filter(
      ks => !(ks.spellId === spellId && ks.classId === classId)
    ),
    updatedAt: Date.now(),
  };
}

// Toggle prepared status for a spell
export function toggleSpellPrepared(
  character: Character,
  spellId: number,
  classId: string
): Character {
  return {
    ...character,
    knownSpells: character.knownSpells.map(ks => {
      if (ks.spellId === spellId && ks.classId === classId) {
        return { ...ks, isPrepared: !ks.isPrepared };
      }
      return ks;
    }),
    updatedAt: Date.now(),
  };
}

// Clear all prepared spells (for a new day)
export function clearPreparedSpells(
  character: Character,
  classId?: string
): Character {
  return {
    ...character,
    knownSpells: character.knownSpells.map(ks => {
      if (classId === undefined || ks.classId === classId) {
        return { ...ks, isPrepared: false };
      }
      return ks;
    }),
    updatedAt: Date.now(),
  };
}

// Update character classes and recalculate slots
export function updateCharacterClasses(
  character: Character,
  classes: CharacterClass[]
): Character {
  const updatedCharacter = { ...character, classes, updatedAt: Date.now() };

  // Recalculate spell slots for spellcasting classes
  updatedCharacter.spellSlots = classes
    .filter(c => {
      const classDef = getClassById(c.classId);
      return classDef && classDef.casterType !== 'none' && !classDef.isPrestigeClass;
    })
    .map(c => {
      // Preserve used counts if possible
      const existing = character.spellSlots.find(s => s.classId === c.classId);
      const newSlots = calculateSpellSlots(updatedCharacter, c);

      if (existing) {
        for (const [level, slot] of Object.entries(newSlots.slots)) {
          const existingSlot = existing.slots[parseInt(level)];
          if (existingSlot) {
            slot.used = Math.min(existingSlot.used, slot.total);
          }
        }
      }

      return newSlots;
    });

  return updatedCharacter;
}

// Calculate spell DC for a class and spell level
export function calculateSpellDC(
  abilityModifier: number,
  spellLevel: number
): number {
  return 10 + spellLevel + abilityModifier;
}

// Recalculate spell slots for a character (e.g., after homebrew settings change)
export function recalculateCharacterSpellSlots(character: Character): Character {
  const updatedCharacter = { ...character, updatedAt: Date.now() };

  // Recalculate spell slots for spellcasting classes
  updatedCharacter.spellSlots = character.classes
    .filter(c => {
      const classDef = getClassById(c.classId);
      return classDef && classDef.casterType !== 'none' && !classDef.isPrestigeClass;
    })
    .map(c => {
      // Preserve used counts if possible
      const existing = character.spellSlots.find(s => s.classId === c.classId);
      const newSlots = calculateSpellSlots(updatedCharacter, c);

      if (existing) {
        for (const [level, slot] of Object.entries(newSlots.slots)) {
          const existingSlot = existing.slots[parseInt(level)];
          if (existingSlot) {
            slot.used = Math.min(existingSlot.used, slot.total);
          }
        }
      }

      return newSlots;
    });

  return updatedCharacter;
}

