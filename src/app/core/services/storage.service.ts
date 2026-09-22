import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  /**
   * Set item in LocalStorage
   */
  setLocal<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.warn(`[StorageService] Failed to set localStorage key: ${key}`, error);
      return false;
    }
  }

  /**
   * Get item from LocalStorage
   */
  getLocal<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`[StorageService] Failed to parse localStorage key: ${key}`, error);
      return defaultValue;
    }
  }

  /**
   * Remove item from LocalStorage
   */
  removeLocal(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`[StorageService] Failed to remove localStorage key: ${key}`, error);
    }
  }

  /**
   * Set item in SessionStorage
   */
  setSession<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      sessionStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.warn(`[StorageService] Failed to set sessionStorage key: ${key}`, error);
      return false;
    }
  }

  /**
   * Get item from SessionStorage
   */
  getSession<T>(key: string, defaultValue: T): T {
    try {
      const item = sessionStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.warn(`[StorageService] Failed to parse sessionStorage key: ${key}`, error);
      return defaultValue;
    }
  }

  /**
   * Remove item from SessionStorage
   */
  removeSession(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.warn(`[StorageService] Failed to remove sessionStorage key: ${key}`, error);
    }
  }

  /**
   * Clear all session storage
   */
  clearSession(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.warn('[StorageService] Failed to clear sessionStorage', error);
    }
  }
}
