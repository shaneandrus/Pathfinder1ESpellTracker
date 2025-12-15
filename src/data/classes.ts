import type { ClassDefinition, SpellSlotProgression } from '../types';

// 9-level caster progression (Wizard, Cleric, Druid, etc.)
const fullCasterProgression: SpellSlotProgression = {
  1: [3, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  2: [4, 2, 0, 0, 0, 0, 0, 0, 0, 0],
  3: [4, 2, 1, 0, 0, 0, 0, 0, 0, 0],
  4: [4, 3, 2, 0, 0, 0, 0, 0, 0, 0],
  5: [4, 3, 2, 1, 0, 0, 0, 0, 0, 0],
  6: [4, 3, 3, 2, 0, 0, 0, 0, 0, 0],
  7: [4, 4, 3, 2, 1, 0, 0, 0, 0, 0],
  8: [4, 4, 3, 3, 2, 0, 0, 0, 0, 0],
  9: [4, 4, 4, 3, 2, 1, 0, 0, 0, 0],
  10: [4, 4, 4, 3, 3, 2, 0, 0, 0, 0],
  11: [4, 4, 4, 4, 3, 2, 1, 0, 0, 0],
  12: [4, 4, 4, 4, 3, 3, 2, 0, 0, 0],
  13: [4, 4, 4, 4, 4, 3, 2, 1, 0, 0],
  14: [4, 4, 4, 4, 4, 3, 3, 2, 0, 0],
  15: [4, 4, 4, 4, 4, 4, 3, 2, 1, 0],
  16: [4, 4, 4, 4, 4, 4, 3, 3, 2, 0],
  17: [4, 4, 4, 4, 4, 4, 4, 3, 2, 1],
  18: [4, 4, 4, 4, 4, 4, 4, 3, 3, 2],
  19: [4, 4, 4, 4, 4, 4, 4, 4, 3, 3],
  20: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
};

// Sorcerer/Oracle progression (spontaneous full caster)
const spontaneousFullCasterProgression: SpellSlotProgression = {
  1: [4, 2, 0, 0, 0, 0, 0, 0, 0, 0],
  2: [5, 3, 0, 0, 0, 0, 0, 0, 0, 0],
  3: [5, 4, 0, 0, 0, 0, 0, 0, 0, 0],
  4: [6, 5, 2, 0, 0, 0, 0, 0, 0, 0],
  5: [6, 5, 3, 0, 0, 0, 0, 0, 0, 0],
  6: [6, 5, 4, 2, 0, 0, 0, 0, 0, 0],
  7: [6, 5, 5, 3, 0, 0, 0, 0, 0, 0],
  8: [6, 5, 5, 4, 2, 0, 0, 0, 0, 0],
  9: [6, 5, 5, 5, 3, 0, 0, 0, 0, 0],
  10: [6, 5, 5, 5, 4, 2, 0, 0, 0, 0],
  11: [6, 5, 5, 5, 5, 3, 0, 0, 0, 0],
  12: [6, 5, 5, 5, 5, 4, 2, 0, 0, 0],
  13: [6, 5, 5, 5, 5, 5, 3, 0, 0, 0],
  14: [6, 5, 5, 5, 5, 5, 4, 2, 0, 0],
  15: [6, 5, 5, 5, 5, 5, 5, 3, 0, 0],
  16: [6, 5, 5, 5, 5, 5, 5, 4, 2, 0],
  17: [6, 5, 5, 5, 5, 5, 5, 5, 3, 0],
  18: [6, 5, 5, 5, 5, 5, 5, 5, 4, 2],
  19: [6, 5, 5, 5, 5, 5, 5, 5, 5, 3],
  20: [6, 5, 5, 5, 5, 5, 5, 5, 5, 4],
};

// Bard progression (6-level spontaneous caster)
const bardProgression: SpellSlotProgression = {
  1: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  2: [0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
  3: [0, 3, 0, 0, 0, 0, 0, 0, 0, 0],
  4: [0, 3, 1, 0, 0, 0, 0, 0, 0, 0],
  5: [0, 4, 2, 0, 0, 0, 0, 0, 0, 0],
  6: [0, 4, 3, 0, 0, 0, 0, 0, 0, 0],
  7: [0, 4, 3, 1, 0, 0, 0, 0, 0, 0],
  8: [0, 4, 4, 2, 0, 0, 0, 0, 0, 0],
  9: [0, 5, 4, 3, 0, 0, 0, 0, 0, 0],
  10: [0, 5, 4, 3, 1, 0, 0, 0, 0, 0],
  11: [0, 5, 4, 4, 2, 0, 0, 0, 0, 0],
  12: [0, 5, 5, 4, 3, 0, 0, 0, 0, 0],
  13: [0, 5, 5, 4, 3, 1, 0, 0, 0, 0],
  14: [0, 5, 5, 4, 4, 2, 0, 0, 0, 0],
  15: [0, 5, 5, 5, 4, 3, 0, 0, 0, 0],
  16: [0, 5, 5, 5, 4, 3, 1, 0, 0, 0],
  17: [0, 5, 5, 5, 4, 4, 2, 0, 0, 0],
  18: [0, 5, 5, 5, 5, 4, 3, 0, 0, 0],
  19: [0, 5, 5, 5, 5, 5, 4, 0, 0, 0],
  20: [0, 5, 5, 5, 5, 5, 5, 0, 0, 0],
};

// Paladin/Ranger progression (4-level caster, starts at level 4)
const paladinRangerProgression: SpellSlotProgression = {
  1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  5: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  6: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  7: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  8: [0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  9: [0, 2, 1, 0, 0, 0, 0, 0, 0, 0],
  10: [0, 2, 1, 0, 0, 0, 0, 0, 0, 0],
  11: [0, 2, 1, 1, 0, 0, 0, 0, 0, 0],
  12: [0, 2, 2, 1, 0, 0, 0, 0, 0, 0],
  13: [0, 3, 2, 1, 0, 0, 0, 0, 0, 0],
  14: [0, 3, 2, 1, 1, 0, 0, 0, 0, 0],
  15: [0, 3, 2, 2, 1, 0, 0, 0, 0, 0],
  16: [0, 3, 3, 2, 1, 0, 0, 0, 0, 0],
  17: [0, 4, 3, 2, 1, 0, 0, 0, 0, 0],
  18: [0, 4, 3, 2, 2, 0, 0, 0, 0, 0],
  19: [0, 4, 3, 3, 2, 0, 0, 0, 0, 0],
  20: [0, 4, 4, 3, 3, 0, 0, 0, 0, 0],
};

// Magus/Inquisitor/Alchemist progression (6-level prepared caster)
const sixLevelPreparedProgression: SpellSlotProgression = {
  1: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  2: [0, 2, 0, 0, 0, 0, 0, 0, 0, 0],
  3: [0, 3, 0, 0, 0, 0, 0, 0, 0, 0],
  4: [0, 3, 1, 0, 0, 0, 0, 0, 0, 0],
  5: [0, 4, 2, 0, 0, 0, 0, 0, 0, 0],
  6: [0, 4, 3, 0, 0, 0, 0, 0, 0, 0],
  7: [0, 4, 3, 1, 0, 0, 0, 0, 0, 0],
  8: [0, 4, 4, 2, 0, 0, 0, 0, 0, 0],
  9: [0, 5, 4, 3, 0, 0, 0, 0, 0, 0],
  10: [0, 5, 4, 3, 1, 0, 0, 0, 0, 0],
  11: [0, 5, 4, 4, 2, 0, 0, 0, 0, 0],
  12: [0, 5, 5, 4, 3, 0, 0, 0, 0, 0],
  13: [0, 5, 5, 4, 3, 1, 0, 0, 0, 0],
  14: [0, 5, 5, 4, 4, 2, 0, 0, 0, 0],
  15: [0, 5, 5, 5, 4, 3, 0, 0, 0, 0],
  16: [0, 5, 5, 5, 4, 3, 1, 0, 0, 0],
  17: [0, 5, 5, 5, 4, 4, 2, 0, 0, 0],
  18: [0, 5, 5, 5, 5, 4, 3, 0, 0, 0],
  19: [0, 5, 5, 5, 5, 5, 4, 0, 0, 0],
  20: [0, 5, 5, 5, 5, 5, 5, 0, 0, 0],
};

// Empty progression for non-casters
const nonCasterProgression: SpellSlotProgression = {};
for (let i = 1; i <= 20; i++) {
  nonCasterProgression[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

// Empty progression for prestige classes (they advance other classes)
const prestigeAdvancementProgression: SpellSlotProgression = {};
for (let i = 1; i <= 10; i++) {
  prestigeAdvancementProgression[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
}

export const CLASSES: ClassDefinition[] = [
  // Core Classes - Full Casters (9th level spells)
  { id: 'wizard', name: 'Wizard', castingAbility: 'INT', casterType: 'prepared', maxSpellLevel: 9, spellProgression: fullCasterProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'sorcerer', name: 'Sorcerer', castingAbility: 'CHA', casterType: 'spontaneous', maxSpellLevel: 9, spellProgression: spontaneousFullCasterProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'cleric', name: 'Cleric', castingAbility: 'WIS', casterType: 'prepared', maxSpellLevel: 9, spellProgression: fullCasterProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'druid', name: 'Druid', castingAbility: 'WIS', casterType: 'prepared', maxSpellLevel: 9, spellProgression: fullCasterProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'witch', name: 'Witch', castingAbility: 'INT', casterType: 'prepared', maxSpellLevel: 9, spellProgression: fullCasterProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'oracle', name: 'Oracle', castingAbility: 'CHA', casterType: 'spontaneous', maxSpellLevel: 9, spellProgression: spontaneousFullCasterProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'arcanist', name: 'Arcanist', castingAbility: 'INT', casterType: 'prepared', maxSpellLevel: 9, spellProgression: fullCasterProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'shaman', name: 'Shaman', castingAbility: 'WIS', casterType: 'prepared', maxSpellLevel: 9, spellProgression: fullCasterProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'psychic', name: 'Psychic', castingAbility: 'INT', casterType: 'spontaneous', maxSpellLevel: 9, spellProgression: spontaneousFullCasterProgression, isPrestigeClass: false, advancesSpellcasting: false },

  // 6-level Casters
  { id: 'bard', name: 'Bard', castingAbility: 'CHA', casterType: 'spontaneous', maxSpellLevel: 6, spellProgression: bardProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'inquisitor', name: 'Inquisitor', castingAbility: 'WIS', casterType: 'spontaneous', maxSpellLevel: 6, spellProgression: sixLevelPreparedProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'magus', name: 'Magus', castingAbility: 'INT', casterType: 'prepared', maxSpellLevel: 6, spellProgression: sixLevelPreparedProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'alchemist', name: 'Alchemist', castingAbility: 'INT', casterType: 'prepared', maxSpellLevel: 6, spellProgression: sixLevelPreparedProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'summoner', name: 'Summoner', castingAbility: 'CHA', casterType: 'spontaneous', maxSpellLevel: 6, spellProgression: bardProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'skald', name: 'Skald', castingAbility: 'CHA', casterType: 'spontaneous', maxSpellLevel: 6, spellProgression: bardProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'warpriest', name: 'Warpriest', castingAbility: 'WIS', casterType: 'prepared', maxSpellLevel: 6, spellProgression: sixLevelPreparedProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'bloodrager', name: 'Bloodrager', castingAbility: 'CHA', casterType: 'spontaneous', maxSpellLevel: 4, spellProgression: paladinRangerProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'hunter', name: 'Hunter', castingAbility: 'WIS', casterType: 'spontaneous', maxSpellLevel: 6, spellProgression: sixLevelPreparedProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'investigator', name: 'Investigator', castingAbility: 'INT', casterType: 'prepared', maxSpellLevel: 6, spellProgression: sixLevelPreparedProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'mesmerist', name: 'Mesmerist', castingAbility: 'CHA', casterType: 'spontaneous', maxSpellLevel: 6, spellProgression: bardProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'occultist', name: 'Occultist', castingAbility: 'INT', casterType: 'spontaneous', maxSpellLevel: 6, spellProgression: sixLevelPreparedProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'spiritualist', name: 'Spiritualist', castingAbility: 'WIS', casterType: 'spontaneous', maxSpellLevel: 6, spellProgression: sixLevelPreparedProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'medium', name: 'Medium', castingAbility: 'CHA', casterType: 'spontaneous', maxSpellLevel: 4, spellProgression: paladinRangerProgression, isPrestigeClass: false, advancesSpellcasting: false },

  // 4-level Casters
  { id: 'paladin', name: 'Paladin', castingAbility: 'CHA', casterType: 'prepared', maxSpellLevel: 4, spellProgression: paladinRangerProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'ranger', name: 'Ranger', castingAbility: 'WIS', casterType: 'prepared', maxSpellLevel: 4, spellProgression: paladinRangerProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'antipaladin', name: 'Antipaladin', castingAbility: 'CHA', casterType: 'prepared', maxSpellLevel: 4, spellProgression: paladinRangerProgression, isPrestigeClass: false, advancesSpellcasting: false },

  // Non-Caster Classes
  { id: 'fighter', name: 'Fighter', castingAbility: null, casterType: 'none', maxSpellLevel: 0, spellProgression: nonCasterProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'rogue', name: 'Rogue', castingAbility: null, casterType: 'none', maxSpellLevel: 0, spellProgression: nonCasterProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'barbarian', name: 'Barbarian', castingAbility: null, casterType: 'none', maxSpellLevel: 0, spellProgression: nonCasterProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'monk', name: 'Monk', castingAbility: null, casterType: 'none', maxSpellLevel: 0, spellProgression: nonCasterProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'cavalier', name: 'Cavalier', castingAbility: null, casterType: 'none', maxSpellLevel: 0, spellProgression: nonCasterProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'gunslinger', name: 'Gunslinger', castingAbility: null, casterType: 'none', maxSpellLevel: 0, spellProgression: nonCasterProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'ninja', name: 'Ninja', castingAbility: null, casterType: 'none', maxSpellLevel: 0, spellProgression: nonCasterProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'samurai', name: 'Samurai', castingAbility: null, casterType: 'none', maxSpellLevel: 0, spellProgression: nonCasterProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'brawler', name: 'Brawler', castingAbility: null, casterType: 'none', maxSpellLevel: 0, spellProgression: nonCasterProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'slayer', name: 'Slayer', castingAbility: null, casterType: 'none', maxSpellLevel: 0, spellProgression: nonCasterProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'swashbuckler', name: 'Swashbuckler', castingAbility: null, casterType: 'none', maxSpellLevel: 0, spellProgression: nonCasterProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'vigilante', name: 'Vigilante', castingAbility: null, casterType: 'none', maxSpellLevel: 0, spellProgression: nonCasterProgression, isPrestigeClass: false, advancesSpellcasting: false },
  { id: 'kineticist', name: 'Kineticist', castingAbility: null, casterType: 'none', maxSpellLevel: 0, spellProgression: nonCasterProgression, isPrestigeClass: false, advancesSpellcasting: false },

  // Prestige Classes (that advance spellcasting)
  { id: 'arcane_trickster', name: 'Arcane Trickster', castingAbility: null, casterType: 'none', maxSpellLevel: 0, spellProgression: prestigeAdvancementProgression, isPrestigeClass: true, advancesSpellcasting: true },
  { id: 'mystic_theurge', name: 'Mystic Theurge', castingAbility: null, casterType: 'none', maxSpellLevel: 0, spellProgression: prestigeAdvancementProgression, isPrestigeClass: true, advancesSpellcasting: true },
  { id: 'eldritch_knight', name: 'Eldritch Knight', castingAbility: null, casterType: 'none', maxSpellLevel: 0, spellProgression: prestigeAdvancementProgression, isPrestigeClass: true, advancesSpellcasting: true },
  { id: 'dragon_disciple', name: 'Dragon Disciple', castingAbility: null, casterType: 'none', maxSpellLevel: 0, spellProgression: prestigeAdvancementProgression, isPrestigeClass: true, advancesSpellcasting: true },
  { id: 'archmage', name: 'Archmage', castingAbility: null, casterType: 'none', maxSpellLevel: 0, spellProgression: prestigeAdvancementProgression, isPrestigeClass: true, advancesSpellcasting: true },
  { id: 'loremaster', name: 'Loremaster', castingAbility: null, casterType: 'none', maxSpellLevel: 0, spellProgression: prestigeAdvancementProgression, isPrestigeClass: true, advancesSpellcasting: true },
  { id: 'pathfinder_chronicler', name: 'Pathfinder Chronicler', castingAbility: null, casterType: 'none', maxSpellLevel: 0, spellProgression: nonCasterProgression, isPrestigeClass: true, advancesSpellcasting: false },
  { id: 'shadowdancer', name: 'Shadowdancer', castingAbility: null, casterType: 'none', maxSpellLevel: 0, spellProgression: nonCasterProgression, isPrestigeClass: true, advancesSpellcasting: false },
  { id: 'assassin', name: 'Assassin', castingAbility: null, casterType: 'none', maxSpellLevel: 0, spellProgression: nonCasterProgression, isPrestigeClass: true, advancesSpellcasting: false },
  { id: 'hellknight', name: 'Hellknight', castingAbility: null, casterType: 'none', maxSpellLevel: 0, spellProgression: nonCasterProgression, isPrestigeClass: true, advancesSpellcasting: false },
];

export function getClassById(id: string): ClassDefinition | undefined {
  return CLASSES.find(c => c.id === id);
}

export function getSpellcastingClasses(): ClassDefinition[] {
  return CLASSES.filter(c => c.maxSpellLevel > 0);
}

export function getNonPrestigeClasses(): ClassDefinition[] {
  return CLASSES.filter(c => !c.isPrestigeClass);
}

export function getPrestigeClasses(): ClassDefinition[] {
  return CLASSES.filter(c => c.isPrestigeClass);
}

