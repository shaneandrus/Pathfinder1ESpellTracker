import type { Character, CharacterClass, ClassSpellSlots, KnownSpell, SpellSlotState, CharacterInventoryItem, CharacterStats, EffectiveStats, Item, StatKey, BonusType, CharacterCurrency } from '../types';
import { DEFAULT_CHARACTER_STATS } from '../types'; // value import — not a type
import { getAllItems } from '../data/items';
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
  const homebrewSettings = character.homebrewSettings || { spellSlotOverrides: [], allowedSources: [] };

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

// ── INVENTORY ────────────────────────────────────────────────────────────────

export function addInventoryItem(
  character: Character,
  item: CharacterInventoryItem
): Character {
  return {
    ...character,
    inventory: [...(character.inventory ?? []), item],
    updatedAt: Date.now(),
  };
}

export function removeInventoryItem(character: Character, entryId: string): Character {
  return {
    ...character,
    inventory: (character.inventory ?? []).filter(i => i.id !== entryId),
    updatedAt: Date.now(),
  };
}

export function toggleEquipped(
  character: Character,
  entryId: string
): { character: Character; displaced: string | null } {
  const entry = (character.inventory ?? []).find(i => i.id === entryId);
  if (!entry) return { character, displaced: null };

  const isEquipping = !entry.equipped;
  const allItems = [...getAllItems(), ...(character.customItems ?? [])];
  const itemDef = allItems.find(i => i.id === entry.itemId);
  const slot = itemDef?.slot;

  let inventory = character.inventory ?? [];
  let displaced: string | null = null;

  if (isEquipping && slot && slot !== 'none') {
    // Ring allows 2 simultaneously, all other slots allow 1
    const maxPerSlot = slot === 'ring' ? 10 : 1;
    const occupants = inventory.filter(
      e => e.id !== entryId && e.equipped && allItems.find(i => i.id === e.itemId)?.slot === slot
    );
    if (occupants.length >= maxPerSlot) {
      const evicted = occupants[0];
      displaced = allItems.find(i => i.id === evicted.itemId)?.name ?? evicted.itemId;
      inventory = inventory.map(i => i.id === evicted.id ? { ...i, equipped: false } : i);
    }
  }

  return {
    character: {
      ...character,
      inventory: inventory.map(i => i.id === entryId ? { ...i, equipped: !entry.equipped } : i),
      updatedAt: Date.now(),
    },
    displaced,
  };
}

export function updateInventoryItemQuantity(
  character: Character,
  entryId: string,
  qty: number
): Character {
  return {
    ...character,
    inventory: (character.inventory ?? []).map(i =>
      i.id === entryId ? { ...i, quantity: Math.max(1, qty) } : i
    ),
    updatedAt: Date.now(),
  };
}

export function updateInventoryItemNotes(
  character: Character,
  entryId: string,
  notes: string
): Character {
  return {
    ...character,
    inventory: (character.inventory ?? []).map(i =>
      i.id === entryId ? { ...i, notes } : i
    ),
    updatedAt: Date.now(),
  };
}

export function updateCharacterStats(
  character: Character,
  stats: CharacterStats
): Character {
  return { ...character, stats, updatedAt: Date.now() };
}

export function updateCharacterCurrency(
  character: Character,
  currency: CharacterCurrency
): Character {
  return { ...character, currency, updatedAt: Date.now() };
}

export function updateCharacterHP(
  character: Character,
  currentHP: number
): Character {
  const stats = character.stats ?? { ...DEFAULT_CHARACTER_STATS };
  return {
    ...character,
    stats: { ...stats, currentHP: Math.max(0, Math.min(currentHP, stats.maxHP)) },
    updatedAt: Date.now(),
  };
}

export function addCustomItem(character: Character, item: Item): Character {
  return {
    ...character,
    customItems: [...(character.customItems ?? []), item],
    updatedAt: Date.now(),
  };
}

export function removeCustomItem(character: Character, itemId: string): Character {
  return {
    ...character,
    customItems: (character.customItems ?? []).filter(i => i.id !== itemId),
    inventory: (character.inventory ?? []).filter(i => i.itemId !== itemId),
    updatedAt: Date.now(),
  };
}

export const STACKABLE_BONUS_TYPES: BonusType[] = ['dodge', 'untyped'];

export function computeEffectiveStats(
  character: Character,
  extraItems?: Item[]
): EffectiveStats {
  const base: CharacterStats = character.stats ?? { ...DEFAULT_CHARACTER_STATS };
  const allItems = [...getAllItems(), ...(character.customItems ?? []), ...(extraItems ?? [])];

  // Collect bonuses from equipped inventory entries
  const equippedBonuses: { stat: StatKey; value: number; type: BonusType }[] = [];
  for (const entry of character.inventory ?? []) {
    if (!entry.equipped) continue;
    const itemDef = allItems.find(i => i.id === entry.itemId);
    const bonuses = entry.customBonuses ?? itemDef?.bonuses ?? [];
    equippedBonuses.push(...bonuses);
  }

  // Compute effective value per stat respecting stacking rules
  const statKeys: StatKey[] = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA', 'FORT', 'REF', 'WILL', 'INIT', 'SPEED', 'BAB'];
  const acBonusByType: Partial<Record<BonusType, number>> = {};
  const statTotals: Partial<Record<StatKey, number>> = {};

  for (const stat of statKeys) {
    const relevant = equippedBonuses.filter(b => b.stat === stat);
    let total = 0;
    const seenTypes = new Map<BonusType, number>();
    for (const b of relevant) {
      if (STACKABLE_BONUS_TYPES.includes(b.type)) {
        total += b.value;
      } else {
        const prev = seenTypes.get(b.type) ?? 0;
        if (b.value > prev) seenTypes.set(b.type, b.value);
      }
    }
    for (const v of seenTypes.values()) total += v;
    statTotals[stat] = total;
  }

  // AC-specific bonuses
  for (const b of equippedBonuses.filter(b => b.stat === 'AC')) {
    if (STACKABLE_BONUS_TYPES.includes(b.type)) {
      acBonusByType[b.type] = (acBonusByType[b.type] ?? 0) + b.value;
    } else {
      const prev = acBonusByType[b.type] ?? 0;
      if (b.value > prev) acBonusByType[b.type] = b.value;
    }
  }

  const dexMod = Math.floor(((base.DEX + (statTotals['DEX'] ?? 0)) - 10) / 2);
  const effectiveAC = 10 + dexMod + Object.values(acBonusByType).reduce((a, v) => a + v, 0);

  // Build bonusByType index (for display purposes)
  const bonusByType: EffectiveStats['bonusByType'] = {};

  return {
    STR: base.STR + (statTotals['STR'] ?? 0),
    DEX: base.DEX + (statTotals['DEX'] ?? 0),
    CON: base.CON + (statTotals['CON'] ?? 0),
    INT: base.INT + (statTotals['INT'] ?? 0),
    WIS: base.WIS + (statTotals['WIS'] ?? 0),
    CHA: base.CHA + (statTotals['CHA'] ?? 0),
    maxHP: base.maxHP,
    currentHP: base.currentHP,
    baseFort: base.baseFort + (statTotals['FORT'] ?? 0),
    baseRef: base.baseRef + (statTotals['REF'] ?? 0),
    baseWill: base.baseWill + (statTotals['WILL'] ?? 0),
    bab: base.bab + (statTotals['BAB'] ?? 0),
    speed: base.speed + (statTotals['SPEED'] ?? 0),
    effectiveAC,
    bonusByType,
  };
}

// Returns a map of inventoryItemId -> Set of bonus indices that are shadowed
// (i.e., another equipped item already provides a higher bonus of the same type to the same stat)
export function getEquippedBonusConflicts(character: Character): Map<string, Set<number>> {
  const allItems = [...getAllItems(), ...(character.customItems ?? [])];
  const equipped = (character.inventory ?? []).filter(e => e.equipped);

  type BonusRecord = { entryId: string; bonusIdx: number; value: number; type: BonusType; stat: StatKey };
  const records: BonusRecord[] = [];

  for (const entry of equipped) {
    const itemDef = allItems.find(i => i.id === entry.itemId);
    const bonuses = entry.customBonuses ?? itemDef?.bonuses ?? [];
    bonuses.forEach((b, idx) => {
      records.push({ entryId: entry.id, bonusIdx: idx, value: b.value, type: b.type as BonusType, stat: b.stat as StatKey });
    });
  }

  const shadowed = new Map<string, Set<number>>();

  // Group by stat + type; stackable types never shadow each other
  const groups = new Map<string, BonusRecord[]>();
  for (const r of records) {
    if (STACKABLE_BONUS_TYPES.includes(r.type)) continue;
    const key = `${r.stat}:${r.type}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(r);
  }

  for (const group of groups.values()) {
    if (group.length <= 1) continue;
    const max = Math.max(...group.map(r => r.value));
    for (const r of group) {
      if (r.value < max) {
        if (!shadowed.has(r.entryId)) shadowed.set(r.entryId, new Set());
        shadowed.get(r.entryId)!.add(r.bonusIdx);
      }
    }
  }

  return shadowed;
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

