import { Injectable, signal, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private document = inject(DOCUMENT);

  isDarkMode = signal(false);

  constructor() {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)').matches ?? false;

    this.isDarkMode.set(storedTheme === 'dark' || (!storedTheme && prefersDark));

    effect(() => {
      const isDark = this.isDarkMode();
      this.document.body.classList.toggle('dark', isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  toggleTheme(): void {
    this.isDarkMode.update((v) => !v);
  }

  setDarkMode(value: boolean): void {
    this.isDarkMode.set(value);
  }
}
