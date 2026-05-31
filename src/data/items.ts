import type { Item, ItemCategory } from '../types';

const ITEMS: Item[] = [
  // ── WEAPONS ──────────────────────────────────────────────────────────────
  { id: 'dagger', name: 'Dagger', category: 'weapon', slot: 'none', weight: 1, cost: '2 gp', description: 'A light blade suited to close-quarters fighting. Can be thrown.' },
  { id: 'handaxe', name: 'Handaxe', category: 'weapon', slot: 'none', weight: 3, cost: '6 gp', description: 'A one-handed axe. Can be used in melee or thrown.' },
  { id: 'shortsword', name: 'Shortsword', category: 'weapon', slot: 'none', weight: 2, cost: '10 gp', description: 'A light piercing blade, ideal for quick thrusts.' },
  { id: 'longsword', name: 'Longsword', category: 'weapon', slot: 'none', weight: 4, cost: '15 gp', description: 'Versatile one-handed sword, usable two-handed for extra damage.' },
  { id: 'rapier', name: 'Rapier', category: 'weapon', slot: 'none', weight: 2, cost: '20 gp', description: 'A finesse one-handed piercing weapon favored by duelists.' },
  { id: 'scimitar', name: 'Scimitar', category: 'weapon', slot: 'none', weight: 4, cost: '15 gp', description: 'A curved blade with a 18–20 critical threat range.' },
  { id: 'greatsword', name: 'Greatsword', category: 'weapon', slot: 'none', weight: 8, cost: '50 gp', description: 'Two-handed martial blade dealing 2d6 damage.' },
  { id: 'greataxe', name: 'Greataxe', category: 'weapon', slot: 'none', weight: 12, cost: '20 gp', description: 'Two-handed axe with a ×3 critical multiplier.' },
  { id: 'quarterstaff', name: 'Quarterstaff', category: 'weapon', slot: 'none', weight: 4, cost: '—', description: 'Simple two-handed bludgeoning weapon; double weapon.' },
  { id: 'shortbow', name: 'Shortbow', category: 'weapon', slot: 'none', weight: 2, cost: '30 gp', description: 'A light ranged weapon with 60 ft. range increment.' },
  { id: 'longbow', name: 'Longbow', category: 'weapon', slot: 'none', weight: 3, cost: '75 gp', description: 'A powerful ranged weapon with 100 ft. range increment.' },
  { id: 'light-crossbow', name: 'Light Crossbow', category: 'weapon', slot: 'none', weight: 4, cost: '35 gp', description: 'Simple ranged weapon; free action to reload with proper feat.' },
  { id: 'heavy-crossbow', name: 'Heavy Crossbow', category: 'weapon', slot: 'none', weight: 8, cost: '50 gp', description: 'Powerful simple crossbow; full-round action to reload.' },
  { id: 'morningstar', name: 'Morningstar', category: 'weapon', slot: 'none', weight: 6, cost: '8 gp', description: 'One-handed weapon combining piercing and bludgeoning damage.' },
  { id: 'flail', name: 'Flail', category: 'weapon', slot: 'none', weight: 5, cost: '8 gp', description: 'Martial weapon that can disarm opponents; ignores shield bonus.' },
  { id: 'warhammer', name: 'Warhammer', category: 'weapon', slot: 'none', weight: 5, cost: '12 gp', description: 'One-handed bludgeoning weapon with a ×3 critical multiplier.' },
  { id: 'trident', name: 'Trident', category: 'weapon', slot: 'none', weight: 4, cost: '15 gp', description: 'Martial weapon that can be thrown; brace against a charge.' },
  // Magic weapons
  { id: 'longsword-plus1', name: 'Longsword +1', category: 'weapon', slot: 'main-hand', weight: 4, cost: '2,315 gp', description: 'A masterwork longsword enchanted with a +1 enhancement bonus to attack and damage rolls.', bonuses: [{ stat: 'AC', value: 0, type: 'enhancement' }], casterLevel: 3, aura: 'Faint Evocation' },
  { id: 'longsword-plus2', name: 'Longsword +2', category: 'weapon', slot: 'main-hand', weight: 4, cost: '8,315 gp', description: 'A masterwork longsword enchanted with a +2 enhancement bonus to attack and damage rolls.', casterLevel: 6, aura: 'Moderate Evocation' },
  { id: 'shortsword-plus1', name: 'Shortsword +1', category: 'weapon', slot: 'main-hand', weight: 2, cost: '2,310 gp', description: 'A masterwork shortsword with a +1 enhancement bonus.', casterLevel: 3, aura: 'Faint Evocation' },
  { id: 'dagger-plus1', name: 'Dagger +1', category: 'weapon', slot: 'none', weight: 1, cost: '2,302 gp', description: 'A masterwork dagger with a +1 enhancement bonus.', casterLevel: 3, aura: 'Faint Evocation' },
  { id: 'greataxe-plus1', name: 'Greataxe +1', category: 'weapon', slot: 'main-hand', weight: 12, cost: '2,320 gp', description: 'A masterwork greataxe with a +1 enhancement bonus.', casterLevel: 3, aura: 'Faint Evocation' },

  // ── ARMOR ────────────────────────────────────────────────────────────────
  { id: 'padded', name: 'Padded Armor', category: 'armor', slot: 'chest', weight: 10, cost: '5 gp', description: 'Light armor. AC +1, max Dex +8, ACP 0.', bonuses: [{ stat: 'AC', value: 1, type: 'armor' }] },
  { id: 'leather', name: 'Leather Armor', category: 'armor', slot: 'chest', weight: 15, cost: '10 gp', description: 'Light armor. AC +2, max Dex +6, ACP 0.', bonuses: [{ stat: 'AC', value: 2, type: 'armor' }] },
  { id: 'studded-leather', name: 'Studded Leather', category: 'armor', slot: 'chest', weight: 20, cost: '25 gp', description: 'Light armor. AC +3, max Dex +5, ACP –1.', bonuses: [{ stat: 'AC', value: 3, type: 'armor' }] },
  { id: 'chain-shirt', name: 'Chain Shirt', category: 'armor', slot: 'chest', weight: 25, cost: '100 gp', description: 'Light armor. AC +4, max Dex +4, ACP –2.', bonuses: [{ stat: 'AC', value: 4, type: 'armor' }] },
  { id: 'hide', name: 'Hide Armor', category: 'armor', slot: 'chest', weight: 25, cost: '15 gp', description: 'Medium armor. AC +4, max Dex +4, ACP –3.', bonuses: [{ stat: 'AC', value: 4, type: 'armor' }] },
  { id: 'scale-mail', name: 'Scale Mail', category: 'armor', slot: 'chest', weight: 30, cost: '50 gp', description: 'Medium armor. AC +5, max Dex +3, ACP –4.', bonuses: [{ stat: 'AC', value: 5, type: 'armor' }] },
  { id: 'chainmail', name: 'Chainmail', category: 'armor', slot: 'chest', weight: 40, cost: '150 gp', description: 'Medium armor. AC +6, max Dex +2, ACP –5.', bonuses: [{ stat: 'AC', value: 6, type: 'armor' }] },
  { id: 'breastplate', name: 'Breastplate', category: 'armor', slot: 'chest', weight: 30, cost: '200 gp', description: 'Medium armor. AC +6, max Dex +3, ACP –4.', bonuses: [{ stat: 'AC', value: 6, type: 'armor' }] },
  { id: 'splint-mail', name: 'Splint Mail', category: 'armor', slot: 'chest', weight: 45, cost: '200 gp', description: 'Heavy armor. AC +7, max Dex +0, ACP –7.', bonuses: [{ stat: 'AC', value: 7, type: 'armor' }] },
  { id: 'banded-mail', name: 'Banded Mail', category: 'armor', slot: 'chest', weight: 35, cost: '250 gp', description: 'Heavy armor. AC +7, max Dex +1, ACP –6.', bonuses: [{ stat: 'AC', value: 7, type: 'armor' }] },
  { id: 'half-plate', name: 'Half-Plate', category: 'armor', slot: 'chest', weight: 50, cost: '600 gp', description: 'Heavy armor. AC +8, max Dex +0, ACP –7.', bonuses: [{ stat: 'AC', value: 8, type: 'armor' }] },
  { id: 'full-plate', name: 'Full Plate', category: 'armor', slot: 'chest', weight: 50, cost: '1,500 gp', description: 'Heavy armor. AC +9, max Dex +1, ACP –6.', bonuses: [{ stat: 'AC', value: 9, type: 'armor' }] },
  // Magic armor
  { id: 'chain-shirt-plus1', name: 'Chain Shirt +1', category: 'armor', slot: 'chest', weight: 25, cost: '1,250 gp', description: 'A masterwork chain shirt with a +1 enhancement bonus to AC.', bonuses: [{ stat: 'AC', value: 5, type: 'armor' }], casterLevel: 3, aura: 'Faint Transmutation' },
  { id: 'chainmail-plus1', name: 'Chainmail +1', category: 'armor', slot: 'chest', weight: 40, cost: '1,300 gp', description: 'Masterwork chainmail with a +1 enhancement bonus to AC.', bonuses: [{ stat: 'AC', value: 7, type: 'armor' }], casterLevel: 3, aura: 'Faint Transmutation' },
  { id: 'breastplate-plus1', name: 'Breastplate +1', category: 'armor', slot: 'chest', weight: 30, cost: '1,350 gp', description: 'Masterwork breastplate with a +1 enhancement bonus to AC.', bonuses: [{ stat: 'AC', value: 7, type: 'armor' }], casterLevel: 3, aura: 'Faint Transmutation' },
  { id: 'full-plate-plus1', name: 'Full Plate +1', category: 'armor', slot: 'chest', weight: 50, cost: '2,650 gp', description: 'Masterwork full plate with a +1 enhancement bonus to AC.', bonuses: [{ stat: 'AC', value: 10, type: 'armor' }], casterLevel: 3, aura: 'Faint Transmutation' },

  // ── SHIELDS ──────────────────────────────────────────────────────────────
  { id: 'buckler', name: 'Buckler', category: 'shield', slot: 'off-hand', weight: 5, cost: '5 gp', description: 'Shield bonus +1 to AC. Strapped to forearm; –1 ACP to attacks.', bonuses: [{ stat: 'AC', value: 1, type: 'shield' }] },
  { id: 'light-shield-wood', name: 'Light Wooden Shield', category: 'shield', slot: 'off-hand', weight: 5, cost: '3 gp', description: 'Shield bonus +1 to AC. Requires a free hand.', bonuses: [{ stat: 'AC', value: 1, type: 'shield' }] },
  { id: 'light-shield-steel', name: 'Light Steel Shield', category: 'shield', slot: 'off-hand', weight: 6, cost: '9 gp', description: 'Shield bonus +1 to AC. More durable than wood.', bonuses: [{ stat: 'AC', value: 1, type: 'shield' }] },
  { id: 'heavy-shield-wood', name: 'Heavy Wooden Shield', category: 'shield', slot: 'off-hand', weight: 10, cost: '7 gp', description: 'Shield bonus +2 to AC.', bonuses: [{ stat: 'AC', value: 2, type: 'shield' }] },
  { id: 'heavy-shield-steel', name: 'Heavy Steel Shield', category: 'shield', slot: 'off-hand', weight: 15, cost: '20 gp', description: 'Shield bonus +2 to AC. Standard adventurer\'s shield.', bonuses: [{ stat: 'AC', value: 2, type: 'shield' }] },
  { id: 'tower-shield', name: 'Tower Shield', category: 'shield', slot: 'off-hand', weight: 45, cost: '30 gp', description: 'Shield bonus +4 to AC; max Dex +2; ACP –10. Can provide total cover.', bonuses: [{ stat: 'AC', value: 4, type: 'shield' }] },
  { id: 'heavy-shield-plus1', name: 'Heavy Steel Shield +1', category: 'shield', slot: 'off-hand', weight: 15, cost: '1,170 gp', description: 'A masterwork heavy steel shield with a +1 enhancement bonus.', bonuses: [{ stat: 'AC', value: 3, type: 'shield' }], casterLevel: 3, aura: 'Faint Transmutation' },

  // ── ADVENTURING GEAR ─────────────────────────────────────────────────────
  { id: 'backpack', name: 'Backpack', category: 'gear', slot: 'none', weight: 2, cost: '2 gp', description: 'Can hold 2 cubic feet / 20 lbs of gear. Counts as a masterwork backpack for encumbrance.' },
  { id: 'rope-hemp', name: 'Hemp Rope (50 ft.)', category: 'gear', slot: 'none', weight: 10, cost: '1 gp', description: 'Has 2 hit points and can be burst with a DC 23 Strength check.' },
  { id: 'rope-silk', name: 'Silk Rope (50 ft.)', category: 'gear', slot: 'none', weight: 5, cost: '10 gp', description: '+2 to Use Rope checks. Has 4 hit points and can be burst with a DC 24 Strength check.' },
  { id: 'torch', name: 'Torch', category: 'gear', slot: 'none', weight: 1, cost: '1 cp', description: 'Burns for 1 hour, shedding normal light in a 20-foot radius.' },
  { id: 'lantern-bullseye', name: 'Lantern, Bullseye', category: 'gear', slot: 'none', weight: 3, cost: '12 gp', description: 'Creates a 60-foot cone of bright light. Burns 6 hours per pint of oil.' },
  { id: 'oil-flask', name: 'Oil (flask)', category: 'gear', slot: 'none', weight: 1, cost: '1 sp', description: 'One flask of oil fuels a lantern for 6 hours. Can be used as a splash weapon.' },
  { id: 'rations', name: 'Trail Rations (1 day)', category: 'gear', slot: 'none', weight: 1, cost: '5 sp', description: 'Enough food and water for one day of travel.' },
  { id: 'waterskin', name: 'Waterskin', category: 'gear', slot: 'none', weight: 4, cost: '1 gp', description: 'Holds 1 gallon of water.' },
  { id: 'bedroll', name: 'Bedroll', category: 'gear', slot: 'none', weight: 5, cost: '1 sp', description: 'Light sleeping roll.' },
  { id: 'grappling-hook', name: 'Grappling Hook', category: 'gear', slot: 'none', weight: 4, cost: '1 gp', description: 'Iron hook for throwing to catch on ledges; used with rope.' },
  { id: 'healers-kit', name: "Healer's Kit", category: 'gear', slot: 'none', weight: 1, cost: '50 gp', description: '10 uses. +2 competence bonus on Heal checks.', bonuses: [{ stat: 'AC', value: 0, type: 'competence' }] },
  { id: 'thieves-tools', name: "Thieves' Tools", category: 'gear', slot: 'none', weight: 1, cost: '30 gp', description: 'Required for Disable Device checks on lock mechanisms.' },
  { id: 'thieves-tools-mw', name: "Thieves' Tools, Masterwork", category: 'gear', slot: 'none', weight: 2, cost: '100 gp', description: '+2 circumstance bonus on Disable Device checks.' },
  { id: 'caltrops', name: 'Caltrops (bag)', category: 'gear', slot: 'none', weight: 2, cost: '1 gp', description: 'Scatter to cover a 5-foot square; creatures entering must save or take damage.' },
  { id: 'mirror-small-steel', name: 'Mirror, Small Steel', category: 'gear', slot: 'none', weight: 0.5, cost: '10 gp', description: 'Pocket-sized steel mirror.' },
  { id: 'spellbook-blank', name: 'Spellbook (blank)', category: 'gear', slot: 'none', weight: 3, cost: '15 gp', description: '100-page book for recording wizard spells; holds up to 100 spell-levels of spells.' },
  { id: 'component-pouch', name: 'Component Pouch', category: 'gear', slot: 'belt', weight: 2, cost: '5 gp', description: 'Contains all non-costly material components for spellcasting.' },
  { id: 'holy-symbol-silver', name: 'Holy Symbol, Silver', category: 'gear', slot: 'neck', weight: 1, cost: '25 gp', description: 'Required for divine spellcasters as a divine focus.' },
  { id: 'holy-symbol-wooden', name: 'Holy Symbol, Wooden', category: 'gear', slot: 'neck', weight: 0, cost: '1 gp', description: 'Wooden holy symbol usable as divine focus.' },

  // ── POTIONS ──────────────────────────────────────────────────────────────
  { id: 'potion-clw', name: 'Potion of Cure Light Wounds', category: 'potion', slot: 'none', weight: 0.1, cost: '50 gp', description: 'Cures 1d8+1 hit points when consumed.', casterLevel: 1, aura: 'Faint Conjuration' },
  { id: 'potion-cmw', name: 'Potion of Cure Moderate Wounds', category: 'potion', slot: 'none', weight: 0.1, cost: '300 gp', description: 'Cures 2d8+3 hit points when consumed.', casterLevel: 3, aura: 'Faint Conjuration' },
  { id: 'potion-csw', name: 'Potion of Cure Serious Wounds', category: 'potion', slot: 'none', weight: 0.1, cost: '750 gp', description: 'Cures 3d8+5 hit points when consumed.', casterLevel: 5, aura: 'Faint Conjuration' },
  { id: 'potion-ccw', name: 'Potion of Cure Critical Wounds', category: 'potion', slot: 'none', weight: 0.1, cost: '1,400 gp', description: 'Cures 4d8+7 hit points when consumed.', casterLevel: 7, aura: 'Moderate Conjuration' },
  { id: 'potion-bull-str', name: "Potion of Bull's Strength", category: 'potion', slot: 'none', weight: 0.1, cost: '300 gp', description: '+4 enhancement bonus to Strength for 1 minute.', casterLevel: 3, aura: 'Faint Transmutation' },
  { id: 'potion-cats-grace', name: "Potion of Cat's Grace", category: 'potion', slot: 'none', weight: 0.1, cost: '300 gp', description: '+4 enhancement bonus to Dexterity for 1 minute.', casterLevel: 3, aura: 'Faint Transmutation' },
  { id: 'potion-bears-end', name: "Potion of Bear's Endurance", category: 'potion', slot: 'none', weight: 0.1, cost: '300 gp', description: '+4 enhancement bonus to Constitution for 1 minute.', casterLevel: 3, aura: 'Faint Transmutation' },
  { id: 'potion-owls-wis', name: "Potion of Owl's Wisdom", category: 'potion', slot: 'none', weight: 0.1, cost: '300 gp', description: '+4 enhancement bonus to Wisdom for 1 minute.', casterLevel: 3, aura: 'Faint Transmutation' },
  { id: 'potion-fox-cunning', name: "Potion of Fox's Cunning", category: 'potion', slot: 'none', weight: 0.1, cost: '300 gp', description: '+4 enhancement bonus to Intelligence for 1 minute.', casterLevel: 3, aura: 'Faint Transmutation' },
  { id: 'potion-eagle-spl', name: "Potion of Eagle's Splendor", category: 'potion', slot: 'none', weight: 0.1, cost: '300 gp', description: '+4 enhancement bonus to Charisma for 1 minute.', casterLevel: 3, aura: 'Faint Transmutation' },
  { id: 'potion-invis', name: 'Potion of Invisibility', category: 'potion', slot: 'none', weight: 0.1, cost: '300 gp', description: 'Grants invisibility for 1 minute or until an attack is made.', casterLevel: 3, aura: 'Faint Illusion' },
  { id: 'potion-prot-evil', name: 'Potion of Protection from Evil', category: 'potion', slot: 'none', weight: 0.1, cost: '50 gp', description: '+2 deflection bonus to AC, +2 resistance bonus to saves vs. evil for 1 minute.', casterLevel: 1, aura: 'Faint Abjuration' },
  { id: 'potion-enlarge', name: 'Potion of Enlarge Person', category: 'potion', slot: 'none', weight: 0.1, cost: '250 gp', description: 'Doubles the size of a humanoid for 1 minute, gaining +2 STR and other size benefits.', casterLevel: 1, aura: 'Faint Transmutation' },
  { id: 'potion-haste', name: 'Potion of Haste', category: 'potion', slot: 'none', weight: 0.1, cost: '750 gp', description: 'Grants haste (extra attack, +1 AC, +1 Reflex, +30 ft. speed) for 3 rounds.', casterLevel: 5, aura: 'Faint Transmutation' },

  // ── WANDS ────────────────────────────────────────────────────────────────
  { id: 'wand-clw', name: 'Wand of Cure Light Wounds', category: 'wand', slot: 'none', weight: 0, cost: '750 gp', description: '50 charges. Cures 1d8+1 hp per charge (CL 1).', casterLevel: 1, aura: 'Faint Conjuration' },
  { id: 'wand-magic-missile', name: 'Wand of Magic Missile', category: 'wand', slot: 'none', weight: 0, cost: '750 gp', description: '50 charges. Deals 1d4+1 force damage, never misses (CL 1).', casterLevel: 1, aura: 'Faint Evocation' },
  { id: 'wand-magic-missile-3', name: 'Wand of Magic Missile (CL 3)', category: 'wand', slot: 'none', weight: 0, cost: '2,250 gp', description: '50 charges. Fires 2 missiles dealing 1d4+1 each (CL 3).', casterLevel: 3, aura: 'Faint Evocation' },
  { id: 'wand-fireball', name: 'Wand of Fireball', category: 'wand', slot: 'none', weight: 0, cost: '11,250 gp', description: '50 charges. Deals 5d6 fire damage (Reflex DC 14 half) per charge (CL 5).', casterLevel: 5, aura: 'Moderate Evocation' },
  { id: 'wand-enlarge', name: 'Wand of Enlarge Person', category: 'wand', slot: 'none', weight: 0, cost: '750 gp', description: '50 charges. Enlarges a humanoid (CL 1).', casterLevel: 1, aura: 'Faint Transmutation' },
  { id: 'wand-invisibility', name: 'Wand of Invisibility', category: 'wand', slot: 'none', weight: 0, cost: '4,500 gp', description: '50 charges. Grants invisibility (CL 3).', casterLevel: 3, aura: 'Faint Illusion' },
  { id: 'wand-lightning-bolt', name: 'Wand of Lightning Bolt', category: 'wand', slot: 'none', weight: 0, cost: '11,250 gp', description: '50 charges. 5d6 electricity (Reflex DC 14 half) per charge (CL 5).', casterLevel: 5, aura: 'Moderate Evocation' },

  // ── SCROLLS ──────────────────────────────────────────────────────────────
  { id: 'scroll-clw', name: 'Scroll of Cure Light Wounds', category: 'scroll', slot: 'none', weight: 0, cost: '25 gp', description: 'Single-use scroll (CL 1). Cures 1d8+1 hp.', casterLevel: 1, aura: 'Faint Conjuration' },
  { id: 'scroll-identify', name: 'Scroll of Identify', category: 'scroll', slot: 'none', weight: 0, cost: '25 gp', description: 'Single-use scroll (CL 1). Identifies one magic item.', casterLevel: 1, aura: 'Faint Divination' },
  { id: 'scroll-mage-armor', name: 'Scroll of Mage Armor', category: 'scroll', slot: 'none', weight: 0, cost: '25 gp', description: 'Single-use scroll (CL 1). Grants +4 armor bonus to AC for 1 hour.', casterLevel: 1, aura: 'Faint Conjuration' },
  { id: 'scroll-magic-missile', name: 'Scroll of Magic Missile', category: 'scroll', slot: 'none', weight: 0, cost: '25 gp', description: 'Single-use scroll (CL 1). Fires one missile for 1d4+1 force damage.', casterLevel: 1, aura: 'Faint Evocation' },
  { id: 'scroll-fireball', name: 'Scroll of Fireball', category: 'scroll', slot: 'none', weight: 0, cost: '375 gp', description: 'Single-use scroll (CL 5). 5d6 fire damage.', casterLevel: 5, aura: 'Moderate Evocation' },
  { id: 'scroll-fly', name: 'Scroll of Fly', category: 'scroll', slot: 'none', weight: 0, cost: '375 gp', description: 'Single-use scroll (CL 5). Grants a fly speed of 60 ft. for 5 minutes.', casterLevel: 5, aura: 'Moderate Transmutation' },
  { id: 'scroll-haste', name: 'Scroll of Haste', category: 'scroll', slot: 'none', weight: 0, cost: '375 gp', description: 'Single-use scroll (CL 5). Grants haste to one creature.', casterLevel: 5, aura: 'Moderate Transmutation' },
  { id: 'scroll-dispel-magic', name: 'Scroll of Dispel Magic', category: 'scroll', slot: 'none', weight: 0, cost: '375 gp', description: 'Single-use scroll (CL 5). Dispels magical effects.', casterLevel: 5, aura: 'Moderate Abjuration' },
  { id: 'scroll-raise-dead', name: 'Scroll of Raise Dead', category: 'scroll', slot: 'none', weight: 0, cost: '6,125 gp', description: 'Single-use scroll (CL 9). Restores life to a recently slain creature.', casterLevel: 9, aura: 'Moderate Conjuration' },
  { id: 'scroll-teleport', name: 'Scroll of Teleport', category: 'scroll', slot: 'none', weight: 0, cost: '1,125 gp', description: 'Single-use scroll (CL 9). Instantly transports creatures to a known location.', casterLevel: 9, aura: 'Moderate Conjuration' },

  // ── MAGIC ITEMS ──────────────────────────────────────────────────────────

  // Cloak of Resistance
  { id: 'cloak-resistance-1', name: 'Cloak of Resistance +1', category: 'wondrous', slot: 'shoulders', weight: 1, cost: '1,000 gp', description: '+1 resistance bonus to all saving throws.', bonuses: [{ stat: 'FORT', value: 1, type: 'resistance' }, { stat: 'REF', value: 1, type: 'resistance' }, { stat: 'WILL', value: 1, type: 'resistance' }], casterLevel: 5, aura: 'Faint Abjuration' },
  { id: 'cloak-resistance-2', name: 'Cloak of Resistance +2', category: 'wondrous', slot: 'shoulders', weight: 1, cost: '4,000 gp', description: '+2 resistance bonus to all saving throws.', bonuses: [{ stat: 'FORT', value: 2, type: 'resistance' }, { stat: 'REF', value: 2, type: 'resistance' }, { stat: 'WILL', value: 2, type: 'resistance' }], casterLevel: 5, aura: 'Faint Abjuration' },
  { id: 'cloak-resistance-3', name: 'Cloak of Resistance +3', category: 'wondrous', slot: 'shoulders', weight: 1, cost: '9,000 gp', description: '+3 resistance bonus to all saving throws.', bonuses: [{ stat: 'FORT', value: 3, type: 'resistance' }, { stat: 'REF', value: 3, type: 'resistance' }, { stat: 'WILL', value: 3, type: 'resistance' }], casterLevel: 5, aura: 'Moderate Abjuration' },
  { id: 'cloak-resistance-4', name: 'Cloak of Resistance +4', category: 'wondrous', slot: 'shoulders', weight: 1, cost: '16,000 gp', description: '+4 resistance bonus to all saving throws.', bonuses: [{ stat: 'FORT', value: 4, type: 'resistance' }, { stat: 'REF', value: 4, type: 'resistance' }, { stat: 'WILL', value: 4, type: 'resistance' }], casterLevel: 5, aura: 'Moderate Abjuration' },
  { id: 'cloak-resistance-5', name: 'Cloak of Resistance +5', category: 'wondrous', slot: 'shoulders', weight: 1, cost: '25,000 gp', description: '+5 resistance bonus to all saving throws.', bonuses: [{ stat: 'FORT', value: 5, type: 'resistance' }, { stat: 'REF', value: 5, type: 'resistance' }, { stat: 'WILL', value: 5, type: 'resistance' }], casterLevel: 5, aura: 'Strong Abjuration' },

  // Amulet of Natural Armor
  { id: 'amulet-nat-armor-1', name: 'Amulet of Natural Armor +1', category: 'wondrous', slot: 'neck', weight: 0, cost: '2,000 gp', description: '+1 natural armor bonus to AC.', bonuses: [{ stat: 'AC', value: 1, type: 'natural' }], casterLevel: 5, aura: 'Faint Transmutation' },
  { id: 'amulet-nat-armor-2', name: 'Amulet of Natural Armor +2', category: 'wondrous', slot: 'neck', weight: 0, cost: '8,000 gp', description: '+2 natural armor bonus to AC.', bonuses: [{ stat: 'AC', value: 2, type: 'natural' }], casterLevel: 5, aura: 'Faint Transmutation' },
  { id: 'amulet-nat-armor-3', name: 'Amulet of Natural Armor +3', category: 'wondrous', slot: 'neck', weight: 0, cost: '18,000 gp', description: '+3 natural armor bonus to AC.', bonuses: [{ stat: 'AC', value: 3, type: 'natural' }], casterLevel: 5, aura: 'Moderate Transmutation' },
  { id: 'amulet-nat-armor-4', name: 'Amulet of Natural Armor +4', category: 'wondrous', slot: 'neck', weight: 0, cost: '32,000 gp', description: '+4 natural armor bonus to AC.', bonuses: [{ stat: 'AC', value: 4, type: 'natural' }], casterLevel: 5, aura: 'Moderate Transmutation' },
  { id: 'amulet-nat-armor-5', name: 'Amulet of Natural Armor +5', category: 'wondrous', slot: 'neck', weight: 0, cost: '50,000 gp', description: '+5 natural armor bonus to AC.', bonuses: [{ stat: 'AC', value: 5, type: 'natural' }], casterLevel: 5, aura: 'Strong Transmutation' },

  // Ring of Protection
  { id: 'ring-protection-1', name: 'Ring of Protection +1', category: 'ring', slot: 'ring', weight: 0, cost: '2,000 gp', description: '+1 deflection bonus to AC.', bonuses: [{ stat: 'AC', value: 1, type: 'deflection' }], casterLevel: 5, aura: 'Faint Abjuration' },
  { id: 'ring-protection-2', name: 'Ring of Protection +2', category: 'ring', slot: 'ring', weight: 0, cost: '8,000 gp', description: '+2 deflection bonus to AC.', bonuses: [{ stat: 'AC', value: 2, type: 'deflection' }], casterLevel: 5, aura: 'Moderate Abjuration' },
  { id: 'ring-protection-3', name: 'Ring of Protection +3', category: 'ring', slot: 'ring', weight: 0, cost: '18,000 gp', description: '+3 deflection bonus to AC.', bonuses: [{ stat: 'AC', value: 3, type: 'deflection' }], casterLevel: 8, aura: 'Moderate Abjuration' },
  { id: 'ring-protection-4', name: 'Ring of Protection +4', category: 'ring', slot: 'ring', weight: 0, cost: '32,000 gp', description: '+4 deflection bonus to AC.', bonuses: [{ stat: 'AC', value: 4, type: 'deflection' }], casterLevel: 11, aura: 'Moderate Abjuration' },
  { id: 'ring-protection-5', name: 'Ring of Protection +5', category: 'ring', slot: 'ring', weight: 0, cost: '50,000 gp', description: '+5 deflection bonus to AC.', bonuses: [{ stat: 'AC', value: 5, type: 'deflection' }], casterLevel: 15, aura: 'Strong Abjuration' },

  // Belt of Physical Might (STR/DEX/CON)
  { id: 'belt-giant-str-2', name: 'Belt of Giant Strength +2', category: 'wondrous', slot: 'belt', weight: 1, cost: '4,000 gp', description: '+2 enhancement bonus to Strength.', bonuses: [{ stat: 'STR', value: 2, type: 'enhancement' }], casterLevel: 8, aura: 'Moderate Transmutation' },
  { id: 'belt-giant-str-4', name: 'Belt of Giant Strength +4', category: 'wondrous', slot: 'belt', weight: 1, cost: '16,000 gp', description: '+4 enhancement bonus to Strength.', bonuses: [{ stat: 'STR', value: 4, type: 'enhancement' }], casterLevel: 8, aura: 'Moderate Transmutation' },
  { id: 'belt-giant-str-6', name: 'Belt of Giant Strength +6', category: 'wondrous', slot: 'belt', weight: 1, cost: '36,000 gp', description: '+6 enhancement bonus to Strength.', bonuses: [{ stat: 'STR', value: 6, type: 'enhancement' }], casterLevel: 8, aura: 'Strong Transmutation' },
  { id: 'belt-incredible-dex-2', name: 'Belt of Incredible Dexterity +2', category: 'wondrous', slot: 'belt', weight: 1, cost: '4,000 gp', description: '+2 enhancement bonus to Dexterity.', bonuses: [{ stat: 'DEX', value: 2, type: 'enhancement' }], casterLevel: 8, aura: 'Moderate Transmutation' },
  { id: 'belt-incredible-dex-4', name: 'Belt of Incredible Dexterity +4', category: 'wondrous', slot: 'belt', weight: 1, cost: '16,000 gp', description: '+4 enhancement bonus to Dexterity.', bonuses: [{ stat: 'DEX', value: 4, type: 'enhancement' }], casterLevel: 8, aura: 'Moderate Transmutation' },
  { id: 'belt-mighty-con-2', name: 'Belt of Mighty Constitution +2', category: 'wondrous', slot: 'belt', weight: 1, cost: '4,000 gp', description: '+2 enhancement bonus to Constitution.', bonuses: [{ stat: 'CON', value: 2, type: 'enhancement' }], casterLevel: 8, aura: 'Moderate Transmutation' },
  { id: 'belt-mighty-con-4', name: 'Belt of Mighty Constitution +4', category: 'wondrous', slot: 'belt', weight: 1, cost: '16,000 gp', description: '+4 enhancement bonus to Constitution.', bonuses: [{ stat: 'CON', value: 4, type: 'enhancement' }], casterLevel: 8, aura: 'Moderate Transmutation' },
  { id: 'belt-physical-2', name: 'Belt of Physical Might +2 (STR/DEX)', category: 'wondrous', slot: 'belt', weight: 1, cost: '10,000 gp', description: '+2 enhancement bonus to both Strength and Dexterity.', bonuses: [{ stat: 'STR', value: 2, type: 'enhancement' }, { stat: 'DEX', value: 2, type: 'enhancement' }], casterLevel: 8, aura: 'Moderate Transmutation' },
  { id: 'belt-physical-perfection-2', name: 'Belt of Physical Perfection +2', category: 'wondrous', slot: 'belt', weight: 1, cost: '16,000 gp', description: '+2 enhancement bonus to Strength, Dexterity, and Constitution.', bonuses: [{ stat: 'STR', value: 2, type: 'enhancement' }, { stat: 'DEX', value: 2, type: 'enhancement' }, { stat: 'CON', value: 2, type: 'enhancement' }], casterLevel: 8, aura: 'Moderate Transmutation' },

  // Headband (INT/WIS/CHA)
  { id: 'headband-vast-int-2', name: 'Headband of Vast Intelligence +2', category: 'wondrous', slot: 'head', weight: 1, cost: '4,000 gp', description: '+2 enhancement bonus to Intelligence.', bonuses: [{ stat: 'INT', value: 2, type: 'enhancement' }], casterLevel: 8, aura: 'Moderate Transmutation' },
  { id: 'headband-vast-int-4', name: 'Headband of Vast Intelligence +4', category: 'wondrous', slot: 'head', weight: 1, cost: '16,000 gp', description: '+4 enhancement bonus to Intelligence.', bonuses: [{ stat: 'INT', value: 4, type: 'enhancement' }], casterLevel: 8, aura: 'Moderate Transmutation' },
  { id: 'headband-vast-int-6', name: 'Headband of Vast Intelligence +6', category: 'wondrous', slot: 'head', weight: 1, cost: '36,000 gp', description: '+6 enhancement bonus to Intelligence.', bonuses: [{ stat: 'INT', value: 6, type: 'enhancement' }], casterLevel: 8, aura: 'Strong Transmutation' },
  { id: 'headband-inspired-wis-2', name: 'Headband of Inspired Wisdom +2', category: 'wondrous', slot: 'head', weight: 1, cost: '4,000 gp', description: '+2 enhancement bonus to Wisdom.', bonuses: [{ stat: 'WIS', value: 2, type: 'enhancement' }], casterLevel: 8, aura: 'Moderate Transmutation' },
  { id: 'headband-inspired-wis-4', name: 'Headband of Inspired Wisdom +4', category: 'wondrous', slot: 'head', weight: 1, cost: '16,000 gp', description: '+4 enhancement bonus to Wisdom.', bonuses: [{ stat: 'WIS', value: 4, type: 'enhancement' }], casterLevel: 8, aura: 'Moderate Transmutation' },
  { id: 'headband-inspired-wis-6', name: 'Headband of Inspired Wisdom +6', category: 'wondrous', slot: 'head', weight: 1, cost: '36,000 gp', description: '+6 enhancement bonus to Wisdom.', bonuses: [{ stat: 'WIS', value: 6, type: 'enhancement' }], casterLevel: 8, aura: 'Strong Transmutation' },
  { id: 'headband-alluring-cha-2', name: 'Headband of Alluring Charisma +2', category: 'wondrous', slot: 'head', weight: 1, cost: '4,000 gp', description: '+2 enhancement bonus to Charisma.', bonuses: [{ stat: 'CHA', value: 2, type: 'enhancement' }], casterLevel: 8, aura: 'Moderate Transmutation' },
  { id: 'headband-alluring-cha-4', name: 'Headband of Alluring Charisma +4', category: 'wondrous', slot: 'head', weight: 1, cost: '16,000 gp', description: '+4 enhancement bonus to Charisma.', bonuses: [{ stat: 'CHA', value: 4, type: 'enhancement' }], casterLevel: 8, aura: 'Moderate Transmutation' },
  { id: 'headband-alluring-cha-6', name: 'Headband of Alluring Charisma +6', category: 'wondrous', slot: 'head', weight: 1, cost: '36,000 gp', description: '+6 enhancement bonus to Charisma.', bonuses: [{ stat: 'CHA', value: 6, type: 'enhancement' }], casterLevel: 8, aura: 'Strong Transmutation' },
  { id: 'headband-mental-2', name: 'Headband of Mental Prowess +2 (INT/WIS)', category: 'wondrous', slot: 'head', weight: 1, cost: '10,000 gp', description: '+2 enhancement bonus to Intelligence and Wisdom.', bonuses: [{ stat: 'INT', value: 2, type: 'enhancement' }, { stat: 'WIS', value: 2, type: 'enhancement' }], casterLevel: 8, aura: 'Moderate Transmutation' },
  { id: 'headband-mental-sup-2', name: 'Headband of Mental Superiority +2', category: 'wondrous', slot: 'head', weight: 1, cost: '16,000 gp', description: '+2 enhancement bonus to Intelligence, Wisdom, and Charisma.', bonuses: [{ stat: 'INT', value: 2, type: 'enhancement' }, { stat: 'WIS', value: 2, type: 'enhancement' }, { stat: 'CHA', value: 2, type: 'enhancement' }], casterLevel: 8, aura: 'Moderate Transmutation' },

  // Boots / Feet
  { id: 'boots-speed', name: 'Boots of Speed', category: 'wondrous', slot: 'feet', weight: 1, cost: '12,000 gp', description: 'As a free action, gain haste for up to 10 rounds per day.', casterLevel: 10, aura: 'Moderate Transmutation' },
  { id: 'boots-striding', name: 'Boots of Striding and Springing', category: 'wondrous', slot: 'feet', weight: 1, cost: '5,500 gp', description: '+10 ft. to base speed; +5 competence bonus on Acrobatics (jump).', bonuses: [{ stat: 'SPEED', value: 10, type: 'enhancement' }], casterLevel: 3, aura: 'Faint Transmutation' },
  { id: 'boots-elven', name: 'Boots of Elvenkind', category: 'wondrous', slot: 'feet', weight: 1, cost: '2,500 gp', description: '+5 competence bonus on Stealth checks.', casterLevel: 5, aura: 'Faint Transmutation' },
  { id: 'winged-boots', name: 'Winged Boots', category: 'wondrous', slot: 'feet', weight: 1, cost: '16,000 gp', description: 'Fly at 60 ft. (good maneuverability) for up to 5 minutes per day, split into 1-minute increments.', casterLevel: 5, aura: 'Faint Transmutation' },

  // Gloves / Hands
  { id: 'gloves-dueling', name: 'Gloves of Dueling', category: 'wondrous', slot: 'hands', weight: 0, cost: '15,000 gp', description: '+4 bonus to CMD against disarm and sunder; +2 competence bonus to weapon training class feature.', casterLevel: 5, aura: 'Faint Transmutation' },
  { id: 'gauntlets-ogre-power', name: 'Gauntlets of Ogre Power', category: 'wondrous', slot: 'hands', weight: 4, cost: '4,000 gp', description: '+2 enhancement bonus to Strength.', bonuses: [{ stat: 'STR', value: 2, type: 'enhancement' }], casterLevel: 6, aura: 'Moderate Transmutation' },
  { id: 'gloves-arrow-snaring', name: 'Gloves of Arrow Snaring', category: 'wondrous', slot: 'hands', weight: 0, cost: '4,000 gp', description: 'Twice per day, snatch an arrow from the air (as Deflect Arrows feat).', casterLevel: 3, aura: 'Faint Abjuration' },

  // Rings (misc)
  { id: 'ring-feather-falling', name: 'Ring of Feather Falling', category: 'ring', slot: 'ring', weight: 0, cost: '2,200 gp', description: 'Feather fall activates immediately if you fall more than 5 feet.', casterLevel: 1, aura: 'Faint Transmutation' },
  { id: 'ring-sustenance', name: 'Ring of Sustenance', category: 'ring', slot: 'ring', weight: 0, cost: '2,500 gp', description: 'No need for food or water; need only 2 hours of sleep per night.', casterLevel: 5, aura: 'Faint Conjuration' },
  { id: 'ring-invisibility', name: 'Ring of Invisibility', category: 'ring', slot: 'ring', weight: 0, cost: '20,000 gp', description: 'Become invisible at will (standard action).', casterLevel: 3, aura: 'Faint Illusion' },
  { id: 'ring-evasion', name: 'Ring of Evasion', category: 'ring', slot: 'ring', weight: 0, cost: '25,000 gp', description: 'Grants the evasion class ability.', casterLevel: 7, aura: 'Moderate Abjuration' },
  { id: 'ring-blinking', name: 'Ring of Blinking', category: 'ring', slot: 'ring', weight: 0, cost: '27,000 gp', description: 'On command, blink (20% miss chance, partial etherealness).', casterLevel: 7, aura: 'Moderate Transmutation' },
  { id: 'ring-free-action', name: 'Ring of Freedom of Movement', category: 'ring', slot: 'ring', weight: 0, cost: '40,000 gp', description: 'Freedom of movement effect at all times.', casterLevel: 7, aura: 'Moderate Abjuration' },
  { id: 'ring-spell-storing', name: 'Ring of Spell Storing', category: 'ring', slot: 'ring', weight: 0, cost: '50,000 gp', description: 'Stores up to 5 levels of spells; cast stored spells as if the wearer cast them.', casterLevel: 9, aura: 'Moderate Evocation' },

  // Wondrous — Neck/Shoulders
  { id: 'necklace-fireballs-i', name: 'Necklace of Fireballs (Type I)', category: 'wondrous', slot: 'neck', weight: 0, cost: '1,650 gp', description: 'Contains 3 fire beads (2d6 each). Throw as grenades (Reflex DC 13 half).', casterLevel: 10, aura: 'Moderate Evocation' },
  { id: 'cloak-elvenkind', name: 'Cloak of Elvenkind', category: 'wondrous', slot: 'shoulders', weight: 1, cost: '2,500 gp', description: '+5 competence bonus on Stealth checks.', casterLevel: 5, aura: 'Faint Illusion' },
  { id: 'cloak-displacement', name: 'Cloak of Displacement (Minor)', category: 'wondrous', slot: 'shoulders', weight: 1, cost: '24,000 gp', description: 'Continuously displaces; 20% miss chance on all attacks against wearer.', casterLevel: 7, aura: 'Moderate Illusion' },
  { id: 'periapt-wisdom-2', name: 'Periapt of Wisdom +2', category: 'wondrous', slot: 'neck', weight: 0, cost: '4,000 gp', description: '+2 enhancement bonus to Wisdom.', bonuses: [{ stat: 'WIS', value: 2, type: 'enhancement' }], casterLevel: 8, aura: 'Moderate Transmutation' },
  { id: 'periapt-proof-poison', name: 'Periapt of Proof Against Poison', category: 'wondrous', slot: 'neck', weight: 0, cost: '27,000 gp', description: 'Immune to all poisons.', casterLevel: 9, aura: 'Moderate Conjuration' },
  { id: 'periapt-health', name: 'Periapt of Health', category: 'wondrous', slot: 'neck', weight: 0, cost: '7,500 gp', description: 'Immune to all diseases.', casterLevel: 5, aura: 'Faint Conjuration' },

  // Wondrous — Head
  { id: 'helm-comprehend', name: 'Helm of Comprehend Languages', category: 'wondrous', slot: 'head', weight: 3, cost: '5,200 gp', description: 'At will: comprehend languages as the spell.', casterLevel: 4, aura: 'Faint Divination' },
  { id: 'helm-telepathy', name: 'Helm of Telepathy', category: 'wondrous', slot: 'head', weight: 3, cost: '27,000 gp', description: 'At will: detect thoughts and telepathy (100 ft.).', casterLevel: 5, aura: 'Moderate Divination' },
  { id: 'circlet-persuasion', name: 'Circlet of Persuasion', category: 'wondrous', slot: 'head', weight: 0, cost: '4,500 gp', description: '+3 competence bonus on Charisma-based checks.', casterLevel: 5, aura: 'Faint Transmutation' },

  // Wondrous — Waist/Body/Chest
  { id: 'handy-haversack', name: 'Handy Haversack', category: 'wondrous', slot: 'none', weight: 5, cost: '2,000 gp', description: 'Backpack with three compartments (80 lbs each). Items are weightless inside. Desired item always appears at the top when reached for.', casterLevel: 9, aura: 'Moderate Conjuration' },
  { id: 'bag-holding-i', name: 'Bag of Holding (Type I)', category: 'wondrous', slot: 'none', weight: 15, cost: '2,500 gp', description: 'Holds up to 250 lbs / 30 cubic feet; weighs only 15 lbs.', casterLevel: 9, aura: 'Moderate Conjuration' },
  { id: 'bag-holding-ii', name: 'Bag of Holding (Type II)', category: 'wondrous', slot: 'none', weight: 25, cost: '5,000 gp', description: 'Holds up to 500 lbs / 70 cubic feet; weighs only 25 lbs.', casterLevel: 9, aura: 'Moderate Conjuration' },
  { id: 'bag-holding-iii', name: 'Bag of Holding (Type III)', category: 'wondrous', slot: 'none', weight: 35, cost: '7,400 gp', description: 'Holds up to 1,000 lbs / 150 cubic feet; weighs only 35 lbs.', casterLevel: 9, aura: 'Moderate Conjuration' },
  { id: 'bag-holding-iv', name: 'Bag of Holding (Type IV)', category: 'wondrous', slot: 'none', weight: 60, cost: '10,000 gp', description: 'Holds up to 1,500 lbs / 250 cubic feet; weighs only 60 lbs.', casterLevel: 9, aura: 'Moderate Conjuration' },
  { id: 'vest-escaping', name: 'Vest of Escape', category: 'wondrous', slot: 'chest', weight: 0, cost: '5,200 gp', description: '+4 competence bonus on Escape Artist; contains hidden lock picks (+4 Disable Device to escape restraints).', casterLevel: 4, aura: 'Faint Conjuration and Transmutation' },
  { id: 'barding-medium', name: 'Barding, Medium (Chain Shirt)', category: 'armor', slot: 'chest', weight: 50, cost: '200 gp', description: 'Chain shirt sized for a medium mount. AC +4, max Dex +4, ACP –2.', bonuses: [{ stat: 'AC', value: 4, type: 'armor' }] },

  // Miscellaneous
  { id: 'ioun-dusty-rose', name: 'Ioun Stone (Dusty Rose Prism)', category: 'wondrous', slot: 'none', weight: 0, cost: '5,000 gp', description: '+1 insight bonus to AC.', bonuses: [{ stat: 'AC', value: 1, type: 'insight' }], casterLevel: 12, aura: 'Strong Transmutation' },
  { id: 'ioun-pale-blue', name: 'Ioun Stone (Pale Blue Rhomboid)', category: 'wondrous', slot: 'none', weight: 0, cost: '8,000 gp', description: '+2 enhancement bonus to Strength.', bonuses: [{ stat: 'STR', value: 2, type: 'enhancement' }], casterLevel: 12, aura: 'Strong Transmutation' },
  { id: 'ioun-scarlet-blue', name: 'Ioun Stone (Scarlet & Blue Sphere)', category: 'wondrous', slot: 'none', weight: 0, cost: '8,000 gp', description: '+2 enhancement bonus to Intelligence.', bonuses: [{ stat: 'INT', value: 2, type: 'enhancement' }], casterLevel: 12, aura: 'Strong Transmutation' },
  { id: 'ioun-pink-green', name: 'Ioun Stone (Pink & Green Sphere)', category: 'wondrous', slot: 'none', weight: 0, cost: '8,000 gp', description: '+2 enhancement bonus to Charisma.', bonuses: [{ stat: 'CHA', value: 2, type: 'enhancement' }], casterLevel: 12, aura: 'Strong Transmutation' },
  { id: 'strand-prayer-beads', name: 'Strand of Prayer Beads', category: 'wondrous', slot: 'neck', weight: 0, cost: '9,600 gp', description: 'Four beads usable once per day each: bless, cure serious wounds, remove fear, and smite evil.', casterLevel: 17, aura: 'Strong Varied' },
  { id: 'pearl-power-1', name: 'Pearl of Power (1st)', category: 'wondrous', slot: 'none', weight: 0, cost: '1,000 gp', description: 'Once per day, recall a single 1st-level spell already cast that day.', casterLevel: 17, aura: 'Strong Transmutation' },
  { id: 'pearl-power-2', name: 'Pearl of Power (2nd)', category: 'wondrous', slot: 'none', weight: 0, cost: '4,000 gp', description: 'Once per day, recall a single 2nd-level spell already cast that day.', casterLevel: 17, aura: 'Strong Transmutation' },
  { id: 'pearl-power-3', name: 'Pearl of Power (3rd)', category: 'wondrous', slot: 'none', weight: 0, cost: '9,000 gp', description: 'Once per day, recall a single 3rd-level spell already cast that day.', casterLevel: 17, aura: 'Strong Transmutation' },
  { id: 'stone-good-luck', name: 'Stone of Good Luck (Luckstone)', category: 'wondrous', slot: 'none', weight: 0, cost: '20,000 gp', description: '+1 luck bonus to saves and skill checks.', bonuses: [{ stat: 'FORT', value: 1, type: 'luck' }, { stat: 'REF', value: 1, type: 'luck' }, { stat: 'WILL', value: 1, type: 'luck' }], casterLevel: 5, aura: 'Faint Evocation' },
  { id: 'phylactery-faithfulness', name: 'Phylactery of Faithfulness', category: 'wondrous', slot: 'head', weight: 0, cost: '1,000 gp', description: 'Wearer is always informed of all repercussions before taking any action that might affect their alignment.', casterLevel: 1, aura: 'Faint Divination' },
  { id: 'eyes-eagle', name: 'Eyes of the Eagle', category: 'wondrous', slot: 'head', weight: 0, cost: '2,500 gp', description: '+5 competence bonus on Perception checks.', casterLevel: 3, aura: 'Faint Divination' },
  { id: 'goggles-night', name: 'Goggles of Night', category: 'wondrous', slot: 'head', weight: 0, cost: '12,000 gp', description: 'Grants darkvision 60 ft.', casterLevel: 3, aura: 'Faint Transmutation' },
  { id: 'bracers-armor-1', name: 'Bracers of Armor +1', category: 'wondrous', slot: 'wrists', weight: 1, cost: '1,000 gp', description: '+1 armor bonus to AC (does not stack with worn armor).', bonuses: [{ stat: 'AC', value: 1, type: 'armor' }], casterLevel: 7, aura: 'Moderate Conjuration' },
  { id: 'bracers-armor-2', name: 'Bracers of Armor +2', category: 'wondrous', slot: 'wrists', weight: 1, cost: '4,000 gp', description: '+2 armor bonus to AC.', bonuses: [{ stat: 'AC', value: 2, type: 'armor' }], casterLevel: 7, aura: 'Moderate Conjuration' },
  { id: 'bracers-armor-4', name: 'Bracers of Armor +4', category: 'wondrous', slot: 'wrists', weight: 1, cost: '16,000 gp', description: '+4 armor bonus to AC.', bonuses: [{ stat: 'AC', value: 4, type: 'armor' }], casterLevel: 7, aura: 'Moderate Conjuration' },
  { id: 'bracers-archery-lesser', name: 'Bracers of Archery (Lesser)', category: 'wondrous', slot: 'wrists', weight: 1, cost: '5,000 gp', description: '+1 competence bonus on attack rolls with bows.', casterLevel: 4, aura: 'Faint Transmutation' },
  { id: 'boots-levitation', name: 'Boots of Levitation', category: 'wondrous', slot: 'feet', weight: 1, cost: '7,500 gp', description: 'At will: levitate (self only).', casterLevel: 3, aura: 'Faint Transmutation' },
  { id: 'horn-goodness', name: 'Horn of Goodness/Evil', category: 'wondrous', slot: 'none', weight: 1, cost: '6,600 gp', description: 'On sounding, casts protection from evil/good in a 20-foot burst.', casterLevel: 5, aura: 'Faint Abjuration' },
  { id: 'rod-metamagic-quicken-lesser', name: 'Rod of Metamagic, Quicken (Lesser)', category: 'rod', slot: 'none', weight: 5, cost: '35,000 gp', description: 'Apply Quicken Spell to up to 3 spells per day of 3rd level or lower.', casterLevel: 17, aura: 'Strong (No school)' },
  { id: 'rod-metamagic-extend-lesser', name: 'Rod of Metamagic, Extend (Lesser)', category: 'rod', slot: 'none', weight: 5, cost: '3,000 gp', description: 'Apply Extend Spell to up to 3 spells per day of 3rd level or lower.', casterLevel: 17, aura: 'Strong (No school)' },
  { id: 'rod-metamagic-empower-lesser', name: 'Rod of Metamagic, Empower (Lesser)', category: 'rod', slot: 'none', weight: 5, cost: '9,000 gp', description: 'Apply Empower Spell to up to 3 spells per day of 3rd level or lower.', casterLevel: 17, aura: 'Strong (No school)' },
  { id: 'staff-fire', name: 'Staff of Fire', category: 'staff', slot: 'none', weight: 5, cost: '18,950 gp', description: '10 charges. Produce flame (1 charge), burning hands (1 charge), fireball (2 charges).', casterLevel: 13, aura: 'Strong Evocation' },
  { id: 'staff-healing', name: 'Staff of Healing', category: 'staff', slot: 'none', weight: 5, cost: '29,600 gp', description: '10 charges. Cure serious wounds (1), lesser restoration (1), remove blindness/deafness (2), remove disease (3).', casterLevel: 11, aura: 'Moderate Conjuration' },
];

export function getAllItems(): Item[] {
  return ITEMS;
}

export function getItemById(id: string): Item | undefined {
  return ITEMS.find(i => i.id === id);
}

export function searchItems(query: string): Item[] {
  const q = query.toLowerCase();
  return ITEMS.filter(i =>
    i.name.toLowerCase().includes(q) ||
    i.description.toLowerCase().includes(q) ||
    i.category.toLowerCase().includes(q)
  );
}

export function getItemsByCategory(cat: ItemCategory): Item[] {
  return ITEMS.filter(i => i.category === cat);
}
