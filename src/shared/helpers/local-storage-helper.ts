export class LocalStorageHelper {
  
    static setItem<T>(key: string, value: T): void {
      try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
      } catch (error) {
        console.error(`Failed to set item in localStorage. Key: ${key}`, error);
      }
    }

    static getItem<T>(key: string): T | null {
      try {
        const serializedValue = localStorage.getItem(key);
        if (serializedValue === null) {
          return null;
        }
        return JSON.parse(serializedValue) as T;
      } catch (error) {
        console.error(`Failed to get item from localStorage. Key: ${key}`, error);
        return null;
      }
    }
  
    static removeItem(key: string): void {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Failed to remove item from localStorage. Key: ${key}`, error);
      }
    }

    static clear(): void {
      try {
        localStorage.clear();
      } catch (error) {
        console.error('Failed to clear localStorage.', error);
      }
    }
  
    static hasKey(key: string): boolean {
      return localStorage.getItem(key) !== null;
    }
  }
  
  