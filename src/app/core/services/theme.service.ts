import { Injectable, signal, effect } from '@angular/core';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../constants/app.constants';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeSignal = signal<ThemeMode>('light');
  public currentTheme = this.currentThemeSignal.asReadonly();
  public isDark = signal<boolean>(false);

  constructor(private storage: StorageService) {
    const savedTheme = this.storage.getLocal<ThemeMode>(STORAGE_KEYS.THEME_PREFERENCE, 'light');
    this.setTheme(savedTheme);

    // Watch for system color scheme changes if system is selected
    if (typeof window !== 'undefined' && window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (this.currentThemeSignal() === 'system') {
          this.applyThemeToDOM(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  setTheme(theme: ThemeMode): void {
    this.currentThemeSignal.set(theme);
    this.storage.setLocal(STORAGE_KEYS.THEME_PREFERENCE, theme);

    if (theme === 'system') {
      const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.applyThemeToDOM(prefersDark ? 'dark' : 'light');
    } else {
      this.applyThemeToDOM(theme);
    }
  }

  toggleTheme(): void {
    const nextTheme = this.currentThemeSignal() === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  private applyThemeToDOM(effectiveTheme: 'light' | 'dark'): void {
    this.isDark.set(effectiveTheme === 'dark');
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', effectiveTheme);
    }
  }
}
