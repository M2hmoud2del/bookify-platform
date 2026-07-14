import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
}

export function measurePasswordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, label: '', color: '' };

  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password))   score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  // cap at 4
  const capped = Math.min(score, 4) as 0 | 1 | 2 | 3 | 4;

  const map: Record<number, Omit<PasswordStrength, 'score'>> = {
    0: { label: '',         color: '' },
    1: { label: 'Weak',     color: 'var(--danger-500)' },
    2: { label: 'Fair',     color: 'var(--warning-500)' },
    3: { label: 'Good',     color: 'var(--accent-500)' },
    4: { label: 'Strong',   color: 'var(--success-500)' },
  };

  return { score: capped, ...map[capped] };
}

@Component({
  selector: 'app-password-strength',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './password-strength.component.html',
  styleUrl: './password-strength.component.css',
})
export class PasswordStrengthComponent {
  password = input('');

  strength = computed(() => measurePasswordStrength(this.password()));

  bars = computed(() => {
    const s = this.strength().score;
    return [1, 2, 3, 4].map((i) => ({ filled: i <= s }));
  });

  rules = computed(() => {
    const p = this.password();
    return [
      { text: 'At least 8 characters', pass: p.length >= 8 },
      { text: 'Uppercase letter',       pass: /[A-Z]/.test(p) },
      { text: 'Lowercase letter',       pass: /[a-z]/.test(p) },
      { text: 'Number',                 pass: /\d/.test(p) },
      { text: 'Special character',      pass: /[^A-Za-z0-9]/.test(p) },
    ];
  });
}
