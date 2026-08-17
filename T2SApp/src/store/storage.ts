import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from './types';

const STORAGE_KEY = '@t2s_state';

export async function loadState(): Promise<AppState | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AppState;
  } catch (e) {
    console.warn('Failed to load state from AsyncStorage:', e);
    return null;
  }
}

export async function saveState(state: AppState): Promise<void> {
  try {
    const serialized = JSON.stringify({ ...state, lastUpdated: new Date().toISOString() });
    await AsyncStorage.setItem(STORAGE_KEY, serialized);
  } catch (e) {
    console.warn('Failed to save state to AsyncStorage:', e);
  }
}

export async function clearState(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear state from AsyncStorage:', e);
  }
}
