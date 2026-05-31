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

// Inventory & Stats Types

export type BonusType =
  | 'enhancement' | 'competence' | 'luck' | 'sacred' | 'profane'
  | 'resistance' | 'deflection' | 'natural' | 'armor' | 'shield'
  | 'dodge' | 'morale' | 'insight' | 'circumstance' | 'alchemical' | 'untyped';

export type StatKey = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA'
                    | 'HP' | 'AC' | 'FORT' | 'REF' | 'WILL' | 'INIT' | 'SPEED' | 'BAB';

export interface StatBonus {
  stat: StatKey;
  value: number;
  type: BonusType;
}

export type ItemCategory =
  | 'weapon' | 'armor' | 'shield' | 'ring' | 'wondrous'
  | 'potion' | 'scroll' | 'wand' | 'rod' | 'staff' | 'gear' | 'consumable' | 'custom';

export type ItemSlot =
  | 'head' | 'neck' | 'shoulders' | 'chest' | 'body' | 'belt'
  | 'wrists' | 'hands' | 'ring' | 'feet' | 'main-hand' | 'off-hand' | 'none';

export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  slot: ItemSlot;
  weight?: number;
  cost?: string;
  description: string;
  bonuses?: StatBonus[];
  casterLevel?: number;
  aura?: string;
}

export interface CharacterInventoryItem {
  id: string;
  itemId: string;
  quantity: number;
  equipped: boolean;
  notes?: string;
  customName?: string;
  customBonuses?: StatBonus[];
  customDescription?: string;
}

export interface CharacterStats {
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
  maxHP: number;
  currentHP: number;
  baseFort: number;
  baseRef: number;
  baseWill: number;
  bab: number;
  speed: number;
}

export interface EffectiveStats extends CharacterStats {
  effectiveAC: number;
  bonusByType: Partial<Record<BonusType, Partial<Record<StatKey, number>>>>;
}

export const DEFAULT_CHARACTER_STATS: CharacterStats = {
  STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10,
  maxHP: 1, currentHP: 1,
  baseFort: 0, baseRef: 0, baseWill: 0,
  bab: 0, speed: 30,
};

export interface Character {
  id: string;
  name: string;
  classes: CharacterClass[];
  spellSlots: ClassSpellSlots[];
  knownSpells: KnownSpell[];
  homebrewSettings?: HomebrewSettings;
  stats?: CharacterStats;
  inventory?: CharacterInventoryItem[];
  customItems?: Item[];
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

