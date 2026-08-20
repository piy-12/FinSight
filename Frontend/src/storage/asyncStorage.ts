import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      // Value was stored as a plain string (e.g. the raw token).
      return raw as unknown as T;
    }
  } catch (error) {
    console.warn(`[storage] Failed to read "${key}"`, error);
    return null;
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    const raw = typeof value === 'string' ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, raw);
  } catch (error) {
    console.warn(`[storage] Failed to write "${key}"`, error);
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn(`[storage] Failed to remove "${key}"`, error);
  }
}

export async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.warn('[storage] Failed to clear storage', error);
  }
}
