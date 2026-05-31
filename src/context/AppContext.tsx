import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Character, Spell, CharacterClass, SpellSlotOverride, CharacterInventoryItem, CharacterStats, Item, CharacterCurrency } from '../types';
import { DEFAULT_HOMEBREW_SETTINGS } from '../types';
import { loadCharacters, saveCharacters, createCharacter, toggleSpellSlot, resetSpellSlots, addKnownSpell, removeKnownSpell, updateCharacterClasses, toggleSpellPrepared, clearPreparedSpells, recalculateCharacterSpellSlots, addInventoryItem, removeInventoryItem, toggleEquipped, updateInventoryItemQuantity, updateInventoryItemNotes, updateCharacterStats, updateCharacterHP, updateCharacterCurrency, addCustomItem, removeCustomItem } from '../store/characterStore';
import { loadSpells } from '../data/spells';
import { setSpellSlotOverride, removeSpellSlotOverride, clearClassOverrides } from '../store/settingsStore';

interface AppState {
  characters: Character[];
  activeCharacterId: string | null;
  spells: Spell[];
  isLoading: boolean;
  currentView: 'characters' | 'slots' | 'spells' | 'spellbook' | 'manage' | 'addSpell' | 'settings' | 'dice' | 'inventory' | 'addItem';
}

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SPELLS'; payload: Spell[] }
  | { type: 'SET_CHARACTERS'; payload: Character[] }
  | { type: 'SET_ACTIVE_CHARACTER'; payload: string | null }
  | { type: 'ADD_CHARACTER'; payload: Character }
  | { type: 'UPDATE_CHARACTER'; payload: Character }
  | { type: 'DELETE_CHARACTER'; payload: string }
  | { type: 'SET_VIEW'; payload: AppState['currentView'] };

const initialState: AppState = {
  characters: [],
  activeCharacterId: null,
  spells: [],
  isLoading: true,
  currentView: 'characters',
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_SPELLS':
      return { ...state, spells: action.payload };
    case 'SET_CHARACTERS':
      return { ...state, characters: action.payload };
    case 'SET_ACTIVE_CHARACTER':
      return { ...state, activeCharacterId: action.payload };
    case 'ADD_CHARACTER':
      return { ...state, characters: [...state.characters, action.payload] };
    case 'UPDATE_CHARACTER':
      return {
        ...state,
        characters: state.characters.map(c =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE_CHARACTER':
      return {
        ...state,
        characters: state.characters.filter(c => c.id !== action.payload),
        activeCharacterId: state.activeCharacterId === action.payload ? null : state.activeCharacterId,
      };
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  activeCharacter: Character | null;
  createNewCharacter: (name: string, classes: CharacterClass[]) => void;
  selectCharacter: (id: string) => void;
  deleteCharacter: (id: string) => void;
  toggleSlot: (classId: string, spellLevel: number, slotIndex: number) => void;
  resetSlots: (classId?: string) => void;
  addSpell: (spellId: number, classId: string) => void;
  removeSpell: (spellId: number, classId: string) => void;
  togglePrepared: (spellId: number, classId: string) => void;
  clearPrepared: (classId?: string) => void;
  updateClasses: (classes: CharacterClass[]) => void;
  setView: (view: AppState['currentView']) => void;
  // Settings methods
  updateSpellSlotOverride: (override: SpellSlotOverride) => void;
  removeSpellSlotOverride: (classId: string, classLevel: number, spellLevel: number) => void;
  clearClassSpellSlotOverrides: (classId: string) => void;
  // Source filtering methods
  setAllowedSources: (sources: string[]) => void;
  // Inventory methods
  addItem: (item: CharacterInventoryItem) => void;
  removeItem: (entryId: string) => void;
  toggleItemEquipped: (entryId: string) => void;
  updateItemQuantity: (entryId: string, qty: number) => void;
  updateItemNotes: (entryId: string, notes: string) => void;
  updateStats: (stats: CharacterStats) => void;
  updateHP: (currentHP: number) => void;
  addCustomItemToCharacter: (item: Item) => void;
  removeCustomItemFromCharacter: (itemId: string) => void;
  updateCurrency: (currency: CharacterCurrency) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load initial data from localStorage
  useEffect(() => {
    async function init() {
      try {
        const [spells, localCharacters] = await Promise.all([
          loadSpells(),
          Promise.resolve(loadCharacters()),
        ]);
        dispatch({ type: 'SET_SPELLS', payload: spells });
        dispatch({ type: 'SET_CHARACTERS', payload: localCharacters });
        if (localCharacters.length > 0) {
          dispatch({ type: 'SET_ACTIVE_CHARACTER', payload: localCharacters[0].id });
        }
      } catch (e) {
        console.error('Failed to initialize:', e);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }
    init();
  }, []);

  // Save characters to localStorage whenever they change
  useEffect(() => {
    if (!state.isLoading) {
      saveCharacters(state.characters);
    }
  }, [state.characters, state.isLoading]);

  const activeCharacter = state.characters.find(c => c.id === state.activeCharacterId) || null;

  const value: AppContextValue = {
    state,
    activeCharacter,
    createNewCharacter: (name, classes) => {
      const char = createCharacter(name, classes);
      dispatch({ type: 'ADD_CHARACTER', payload: char });
      dispatch({ type: 'SET_ACTIVE_CHARACTER', payload: char.id });
      dispatch({ type: 'SET_VIEW', payload: 'slots' });
    },
    selectCharacter: (id) => {
      dispatch({ type: 'SET_ACTIVE_CHARACTER', payload: id });
      dispatch({ type: 'SET_VIEW', payload: 'slots' });
    },
    deleteCharacter: (id) => {
      dispatch({ type: 'DELETE_CHARACTER', payload: id });
    },
    toggleSlot: (classId, spellLevel, slotIndex) => {
      if (activeCharacter) {
        const updated = toggleSpellSlot(activeCharacter, classId, spellLevel, slotIndex);
        dispatch({ type: 'UPDATE_CHARACTER', payload: updated });
      }
    },
    resetSlots: (classId) => {
      if (activeCharacter) {
        const updated = resetSpellSlots(activeCharacter, classId);
        dispatch({ type: 'UPDATE_CHARACTER', payload: updated });
      }
    },
    addSpell: (spellId, classId) => {
      if (activeCharacter) {
        const updated = addKnownSpell(activeCharacter, spellId, classId);
        dispatch({ type: 'UPDATE_CHARACTER', payload: updated });
      }
    },
    removeSpell: (spellId, classId) => {
      if (activeCharacter) {
        const updated = removeKnownSpell(activeCharacter, spellId, classId);
        dispatch({ type: 'UPDATE_CHARACTER', payload: updated });
      }
    },
    togglePrepared: (spellId, classId) => {
      if (activeCharacter) {
        const updated = toggleSpellPrepared(activeCharacter, spellId, classId);
        dispatch({ type: 'UPDATE_CHARACTER', payload: updated });
      }
    },
    clearPrepared: (classId) => {
      if (activeCharacter) {
        const updated = clearPreparedSpells(activeCharacter, classId);
        dispatch({ type: 'UPDATE_CHARACTER', payload: updated });
      }
    },
    updateClasses: (classes) => {
      if (activeCharacter) {
        const updated = updateCharacterClasses(activeCharacter, classes);
        dispatch({ type: 'UPDATE_CHARACTER', payload: updated });
      }
    },
    setView: (view) => {
      dispatch({ type: 'SET_VIEW', payload: view });
    },
    // Settings methods (per-character) - also recalculate spell slots
    updateSpellSlotOverride: (override) => {
      if (activeCharacter) {
        const currentSettings = activeCharacter.homebrewSettings || DEFAULT_HOMEBREW_SETTINGS;
        const newSettings = setSpellSlotOverride(currentSettings, override);
        const withSettings = { ...activeCharacter, homebrewSettings: newSettings };
        const updated = recalculateCharacterSpellSlots(withSettings);
        dispatch({ type: 'UPDATE_CHARACTER', payload: updated });
      }
    },
    removeSpellSlotOverride: (classId, classLevel, spellLevel) => {
      if (activeCharacter) {
        const currentSettings = activeCharacter.homebrewSettings || DEFAULT_HOMEBREW_SETTINGS;
        const newSettings = removeSpellSlotOverride(currentSettings, classId, classLevel, spellLevel);
        const withSettings = { ...activeCharacter, homebrewSettings: newSettings };
        const updated = recalculateCharacterSpellSlots(withSettings);
        dispatch({ type: 'UPDATE_CHARACTER', payload: updated });
      }
    },
    clearClassSpellSlotOverrides: (classId) => {
      if (activeCharacter) {
        const currentSettings = activeCharacter.homebrewSettings || DEFAULT_HOMEBREW_SETTINGS;
        const newSettings = clearClassOverrides(currentSettings, classId);
        const withSettings = { ...activeCharacter, homebrewSettings: newSettings };
        const updated = recalculateCharacterSpellSlots(withSettings);
        dispatch({ type: 'UPDATE_CHARACTER', payload: updated });
      }
    },
    setAllowedSources: (sources) => {
      if (activeCharacter) {
        const currentSettings = activeCharacter.homebrewSettings || DEFAULT_HOMEBREW_SETTINGS;
        const newSettings = { ...currentSettings, allowedSources: sources };
        const updated = { ...activeCharacter, homebrewSettings: newSettings, updatedAt: Date.now() };
        dispatch({ type: 'UPDATE_CHARACTER', payload: updated });
      }
    },
    addItem: (item) => {
      if (activeCharacter) dispatch({ type: 'UPDATE_CHARACTER', payload: addInventoryItem(activeCharacter, item) });
    },
    removeItem: (entryId) => {
      if (activeCharacter) dispatch({ type: 'UPDATE_CHARACTER', payload: removeInventoryItem(activeCharacter, entryId) });
    },
    toggleItemEquipped: (entryId) => {
      if (activeCharacter) dispatch({ type: 'UPDATE_CHARACTER', payload: toggleEquipped(activeCharacter, entryId) });
    },
    updateItemQuantity: (entryId, qty) => {
      if (activeCharacter) dispatch({ type: 'UPDATE_CHARACTER', payload: updateInventoryItemQuantity(activeCharacter, entryId, qty) });
    },
    updateItemNotes: (entryId, notes) => {
      if (activeCharacter) dispatch({ type: 'UPDATE_CHARACTER', payload: updateInventoryItemNotes(activeCharacter, entryId, notes) });
    },
    updateStats: (stats) => {
      if (activeCharacter) dispatch({ type: 'UPDATE_CHARACTER', payload: updateCharacterStats(activeCharacter, stats) });
    },
    updateHP: (currentHP) => {
      if (activeCharacter) dispatch({ type: 'UPDATE_CHARACTER', payload: updateCharacterHP(activeCharacter, currentHP) });
    },
    addCustomItemToCharacter: (item) => {
      if (activeCharacter) dispatch({ type: 'UPDATE_CHARACTER', payload: addCustomItem(activeCharacter, item) });
    },
    removeCustomItemFromCharacter: (itemId) => {
      if (activeCharacter) dispatch({ type: 'UPDATE_CHARACTER', payload: removeCustomItem(activeCharacter, itemId) });
    },
    updateCurrency: (currency) => {
      if (activeCharacter) dispatch({ type: 'UPDATE_CHARACTER', payload: updateCharacterCurrency(activeCharacter, currency) });
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

