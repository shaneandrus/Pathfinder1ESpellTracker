import Papa from 'papaparse';
import type { Spell } from '../types';

// Map CSV column names to our class IDs
const CLASS_COLUMN_MAP: { [column: string]: string } = {
  'sor': 'sorcerer',
  'wiz': 'wizard',
  'cleric': 'cleric',
  'druid': 'druid',
  'ranger': 'ranger',
  'bard': 'bard',
  'paladin': 'paladin',
  'alchemist': 'alchemist',
  'summoner': 'summoner',
  'witch': 'witch',
  'inquisitor': 'inquisitor',
  'oracle': 'oracle',
  'antipaladin': 'antipaladin',
  'magus': 'magus',
  'bloodrager': 'bloodrager',
  'shaman': 'shaman',
  'psychic': 'psychic',
  'medium': 'medium',
  'mesmerist': 'mesmerist',
  'occultist': 'occultist',
  'spiritualist': 'spiritualist',
  'skald': 'skald',
  'investigator': 'investigator',
  'hunter': 'hunter',
  'summoner_unchained': 'summoner',
};

let spellsCache: Spell[] | null = null;

export async function loadSpells(): Promise<Spell[]> {
  if (spellsCache) return spellsCache;

  const response = await fetch('/spells.csv');
  const csvText = await response.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const spells: Spell[] = (results.data as Record<string, string>[]).map((row, index) => {
          const classLevels: { [classId: string]: number } = {};
          
          // Parse class levels from columns
          for (const [column, classId] of Object.entries(CLASS_COLUMN_MAP)) {
            const level = row[column];
            if (level && level !== 'NULL' && level !== '') {
              const parsedLevel = parseInt(level, 10);
              if (!isNaN(parsedLevel)) {
                classLevels[classId] = parsedLevel;
              }
            }
          }
          
          return {
            id: parseInt(row['id'] || String(index + 1), 10),
            name: row['name'] || '',
            school: row['school'] || '',
            subschool: row['subschool'] || undefined,
            descriptor: row['descriptor'] || undefined,
            castingTime: row['casting_time'] || '',
            components: row['components'] || '',
            range: row['range'] || '',
            area: row['area'] || undefined,
            effect: row['effect'] || undefined,
            targets: row['targets'] || undefined,
            duration: row['duration'] || '',
            savingThrow: row['saving_throw'] || 'none',
            spellResistance: row['spell_resistance'] || 'no',
            description: row['description'] || '',
            source: row['source'] || '',
            classLevels,
            linkText: row['linktext'] || row['name'] || '',
          };
        });
        
        spellsCache = spells;
        resolve(spells);
      },
      error: (error: Error) => {
        reject(error);
      }
    });
  });
}

export function getSpellsForClass(spells: Spell[], classId: string): Spell[] {
  return spells.filter(spell => spell.classLevels[classId] !== undefined);
}

export function getSpellsByLevel(spells: Spell[], classId: string, level: number): Spell[] {
  return spells.filter(spell => spell.classLevels[classId] === level);
}

export function searchSpells(spells: Spell[], query: string): Spell[] {
  const lowerQuery = query.toLowerCase();
  return spells.filter(spell => 
    spell.name.toLowerCase().includes(lowerQuery) ||
    spell.school.toLowerCase().includes(lowerQuery) ||
    spell.description.toLowerCase().includes(lowerQuery)
  );
}

export function getSpellAonUrl(spellName: string): string {
  const encodedName = encodeURIComponent(spellName);
  return `https://www.aonprd.com/SpellDisplay.aspx?ItemName=${encodedName}`;
}

export function getSpellById(spells: Spell[], id: number): Spell | undefined {
  return spells.find(spell => spell.id === id);
}

export function getAllSources(spells: Spell[]): string[] {
  const sources = new Set<string>();
  for (const spell of spells) {
    if (spell.source) {
      sources.add(spell.source);
    }
  }
  return Array.from(sources).sort();
}

