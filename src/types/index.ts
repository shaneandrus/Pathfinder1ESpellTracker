// Pathfinder 1e Spell Tracker Types

export type CastingAbility = 'INT' | 'WIS' | 'CHA';
export type CasterType = 'prepared' | 'spontaneous' | 'none';

export interface SpellSlotProgression {
  [level: number]: number[]; // level -> [0th, 1st, 2nd, ..., 9th level slots]
}

export interface ClassDefinition {
  id: string;
  name: string;
  castingAbility: CastingAbility | null;
  casterType: CasterType;
  maxSpellLevel: number; // 0 = non-caster, 4, 6, or 9 for partial/full casters
  spellProgression: SpellSlotProgression;
  isPrestigeClass: boolean;
  advancesSpellcasting: boolean; // For prestige classes that advance existing casting
}

export interface CharacterClass {
  classId: string;
  classLevel: number;
  abilityModifier: number; // The modifier for this class's casting ability
  advancedByClassId?: string; // For prestige classes, which base class they advance
}

export interface SpellSlotState {
  total: number; // -1 means unlimited
  used: number;
}

export interface ClassSpellSlots {
  classId: string;
  effectiveCasterLevel: number;
  slots: { [spellLevel: number]: SpellSlotState };
}

export interface Spell {
  id: number;
  name: string;
  school: string;
  subschool?: string;
  descriptor?: string;
  castingTime: string;
  components: string;
  range: string;
  area?: string;
  effect?: string;
  targets?: string;
  duration: string;
  savingThrow: string;
  spellResistance: string;
  description: string;
  source: string;
  classLevels: { [classId: string]: number }; // class -> spell level for that class
  linkText: string;
}

export interface KnownSpell {
  spellId: number;
  classId: string; // Which class knows this spell
  isPrepared?: boolean; // For prepared casters
}

export interface Character {
  id: string;
  name: string;
  classes: CharacterClass[];
  spellSlots: ClassSpellSlots[];
  knownSpells: KnownSpell[];
  homebrewSettings?: HomebrewSettings; // Per-character homebrew customizations
  createdAt: number;
  updatedAt: number;
}

export interface AppState {
  characters: Character[];
  activeCharacterId: string | null;
}

// Homebrew Settings Types

// Override spell slots for a specific class at specific class levels
export interface SpellSlotOverride {
  classId: string;
  classLevel: number; // The class level (1-20)
  spellLevel: number; // Which spell level slot to override (0-9)
  slots: number; // The new number of base slots (-1 means unlimited)
}

export interface HomebrewSettings {
  spellSlotOverrides: SpellSlotOverride[];
  // Allowed spell sources (empty array = all sources allowed)
  allowedSources: string[];
}

export const DEFAULT_HOMEBREW_SETTINGS: HomebrewSettings = {
  spellSlotOverrides: [],
  allowedSources: [], // Empty means all sources are allowed
};

