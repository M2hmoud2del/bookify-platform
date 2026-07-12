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
  template: `
    @if (password()) {
      <div class="strength-meter">
        <div class="strength-bars">
          @for (bar of bars(); track $index) {
            <div
              class="strength-bar"
              [style.background]="bar.filled ? strength().color : 'var(--gray-200)'"
            ></div>
          }
        </div>
        @if (strength().label) {
          <span class="strength-label" [style.color]="strength().color">
            {{ strength().label }}
          </span>
        }
      </div>

      <ul class="strength-rules">
        @for (rule of rules(); track rule.text) {
          <li class="rule" [class.rule-pass]="rule.pass">
            <span class="material-icons-outlined rule-icon">
              {{ rule.pass ? 'check_circle' : 'radio_button_unchecked' }}
            </span>
            <span>{{ rule.text }}</span>
          </li>
        }
      </ul>
    }
  `,
  styles: [`
    :host { display: block; }

    .strength-meter {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-top: var(--space-2);
    }

    .strength-bars {
      display: flex;
      gap: var(--space-1);
      flex: 1;
    }

    .strength-bar {
      height: 4px;
      flex: 1;
      border-radius: var(--radius-full);
      transition: background var(--transition-normal);
    }

    :host-context(.dark) .strength-bar {
      /* unfilled default */
    }

    .strength-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      white-space: nowrap;
      min-width: 3rem;
      text-align: right;
      transition: color var(--transition-normal);
    }

    .strength-rules {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-1) var(--space-4);
      list-style: none;
      margin: var(--space-3) 0 0;
      padding: 0;
    }

    .rule {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      transition: color var(--transition-fast);
    }

    .rule-pass { color: var(--success-600); }
    :host-context(.dark) .rule-pass { color: var(--success-400); }

    .rule-icon {
      font-size: 0.875rem;
    }

    .rule:not(.rule-pass) .rule-icon { color: var(--gray-300); }
    :host-context(.dark) .rule:not(.rule-pass) .rule-icon { color: var(--gray-600); }
    .rule-pass .rule-icon { color: var(--success-500); }
  `],
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
