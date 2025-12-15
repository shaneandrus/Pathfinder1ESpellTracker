import type { HomebrewSettings, SpellSlotOverride } from '../types';
import { DEFAULT_HOMEBREW_SETTINGS } from '../types';

const SETTINGS_STORAGE_KEY = 'pf1e-spell-tracker-settings';

export function loadSettings(): HomebrewSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_HOMEBREW_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return { ...DEFAULT_HOMEBREW_SETTINGS };
}

export function saveSettings(settings: HomebrewSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

// Add or update a spell slot override
export function setSpellSlotOverride(
  settings: HomebrewSettings,
  override: SpellSlotOverride
): HomebrewSettings {
  const existingIndex = settings.spellSlotOverrides.findIndex(
    o => o.classId === override.classId && 
         o.classLevel === override.classLevel && 
         o.spellLevel === override.spellLevel
  );
  
  const newOverrides = [...settings.spellSlotOverrides];
  if (existingIndex >= 0) {
    newOverrides[existingIndex] = override;
  } else {
    newOverrides.push(override);
  }
  
  return { ...settings, spellSlotOverrides: newOverrides };
}

// Remove a spell slot override
export function removeSpellSlotOverride(
  settings: HomebrewSettings,
  classId: string,
  classLevel: number,
  spellLevel: number
): HomebrewSettings {
  return {
    ...settings,
    spellSlotOverrides: settings.spellSlotOverrides.filter(
      o => !(o.classId === classId && o.classLevel === classLevel && o.spellLevel === spellLevel)
    ),
  };
}

// Clear all overrides for a class
export function clearClassOverrides(
  settings: HomebrewSettings,
  classId: string
): HomebrewSettings {
  return {
    ...settings,
    spellSlotOverrides: settings.spellSlotOverrides.filter(o => o.classId !== classId),
  };
}

// Get the spell slot count for a class/level, applying homebrew overrides
export function getSpellSlots(
  settings: HomebrewSettings,
  classId: string,
  classLevel: number,
  spellLevel: number,
  defaultSlots: number
): number {
  const override = settings.spellSlotOverrides.find(
    o => o.classId === classId && o.classLevel === classLevel && o.spellLevel === spellLevel
  );
  return override ? override.slots : defaultSlots;
}

// Check if there's an override for a specific slot
export function hasOverride(
  settings: HomebrewSettings,
  classId: string,
  classLevel: number,
  spellLevel: number
): boolean {
  return settings.spellSlotOverrides.some(
    o => o.classId === classId && o.classLevel === classLevel && o.spellLevel === spellLevel
  );
}

