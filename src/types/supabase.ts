// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      characters: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          data: CharacterData;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          data: CharacterData;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          data?: CharacterData;
          updated_at?: string;
        };
      };
    };
  };
}

// The character data stored as JSONB in Supabase
export interface CharacterData {
  classes: Array<{
    classId: string;
    classLevel: number;
    abilityModifier: number;
    advancedByClassId?: string;
  }>;
  spellSlots: Array<{
    classId: string;
    effectiveCasterLevel: number;
    slots: { [spellLevel: number]: { total: number; used: number } };
  }>;
  knownSpells: Array<{
    spellId: number;
    classId: string;
    isPrepared?: boolean;
  }>;
  homebrewSettings?: {
    spellSlotOverrides: Array<{
      classId: string;
      classLevel: number;
      spellLevel: number;
      slots: number;
    }>;
    allowedSources: string[];
  };
}

