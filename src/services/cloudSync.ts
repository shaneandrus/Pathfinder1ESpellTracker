import { supabase } from '../lib/supabase';
import type { Character } from '../types';
import type { CharacterData } from '../types/supabase';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseRecord = Record<string, any>;

// Convert local Character to cloud format
function toCloudFormat(character: Character): CharacterData {
  return {
    classes: character.classes,
    spellSlots: character.spellSlots,
    knownSpells: character.knownSpells,
    homebrewSettings: character.homebrewSettings,
  };
}

// Convert cloud format back to local Character
function fromCloudFormat(
  row: { id: string; name: string; data: CharacterData; created_at: string; updated_at: string }
): Character {
  return {
    id: row.id,
    name: row.name,
    classes: row.data.classes,
    spellSlots: row.data.spellSlots,
    knownSpells: row.data.knownSpells,
    homebrewSettings: row.data.homebrewSettings,
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
  };
}

// Fetch all characters for the current user
export async function fetchCloudCharacters(userId: string): Promise<Character[]> {
  if (!supabase) return [];
  
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch cloud characters:', error);
    throw error;
  }

  return (data || []).map(fromCloudFormat);
}

// Save a character to the cloud
export async function saveCharacterToCloud(userId: string, character: Character): Promise<void> {
  if (!supabase) return;

  const record: SupabaseRecord = {
    id: character.id,
    user_id: userId,
    name: character.name,
    data: toCloudFormat(character),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('characters')
    .upsert(record);

  if (error) {
    console.error('Failed to save character to cloud:', error);
    throw error;
  }
}

// Delete a character from the cloud
export async function deleteCharacterFromCloud(characterId: string): Promise<void> {
  if (!supabase) return;

  const { error } = await supabase
    .from('characters')
    .delete()
    .eq('id', characterId);

  if (error) {
    console.error('Failed to delete character from cloud:', error);
    throw error;
  }
}

// Sync local characters with cloud (merge strategy: cloud wins for conflicts based on updatedAt)
export async function syncCharacters(
  userId: string,
  localCharacters: Character[]
): Promise<Character[]> {
  if (!supabase) return localCharacters;

  try {
    const cloudCharacters = await fetchCloudCharacters(userId);
    const cloudMap = new Map(cloudCharacters.map(c => [c.id, c]));
    
    const merged: Character[] = [];
    const toUpload: Character[] = [];

    // Process all local characters
    for (const local of localCharacters) {
      const cloud = cloudMap.get(local.id);
      if (!cloud) {
        // Only exists locally - upload it
        toUpload.push(local);
        merged.push(local);
      } else if (local.updatedAt > cloud.updatedAt) {
        // Local is newer - upload it
        toUpload.push(local);
        merged.push(local);
      } else {
        // Cloud is newer or same - use cloud version
        merged.push(cloud);
      }
      cloudMap.delete(local.id);
    }

    // Add any characters only in cloud
    for (const cloud of cloudMap.values()) {
      merged.push(cloud);
    }

    // Upload local-only or updated characters
    for (const char of toUpload) {
      await saveCharacterToCloud(userId, char);
    }

    return merged;
  } catch (error) {
    console.error('Sync failed:', error);
    return localCharacters; // Fall back to local on error
  }
}

