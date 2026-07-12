import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { AuthLayoutComponent } from '../shared/auth-layout.component';
import { PasswordInputComponent } from '../shared/password-input.component';
import { PasswordStrengthComponent } from '../shared/password-strength.component';
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  validateRequired,
} from '../shared/auth-validators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ButtonComponent,
    InputComponent,
    AuthLayoutComponent,
    PasswordInputComponent,
    PasswordStrengthComponent,
  ],
  template: `
    <app-auth-layout
      title="Create your account"
      subtitle="Start managing appointments like a pro — free for 14 days"
      imageUrl="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200"
      quote="Bookify transformed my salon. I went from juggling a paper calendar to having a fully automated booking system in one afternoon."
      quoteAuthor="Sarah Johnson, Blossom Beauty Salon"
    >
      <!-- Global error -->
      @if (authService.error()) {
        <div class="auth-banner auth-banner-error">
          <span class="material-icons-outlined">error_outline</span>
          <span>{{ authService.error() }}</span>
        </div>
      }

      <!-- Role selector -->
      <div class="role-selector" role="group" aria-label="Account type">
        <button
          type="button"
          class="role-btn"
          [class.is-active]="role === 'customer'"
          (click)="role = 'customer'"
        >
          <span class="role-icon material-icons-outlined">person</span>
          <span class="role-label">I'm a Customer</span>
          <span class="role-desc">Book appointments</span>
        </button>

        <button
          type="button"
          class="role-btn"
          [class.is-active]="role === 'provider'"
          (click)="role = 'provider'"
        >
          <span class="role-icon material-icons-outlined">business_center</span>
          <span class="role-label">I'm a Provider</span>
          <span class="role-desc">Manage bookings</span>
        </button>
      </div>

      <!-- Form -->
      <form class="auth-form" (ngSubmit)="onSubmit()" novalidate>

        <!-- Name -->
        <app-input
          label="Full Name"
          type="text"
          placeholder="Your full name"
          iconStart="person"
          [required]="true"
          [error]="nameError() ?? undefined"
          [(ngModel)]="name"
          name="name"
          (blur)="touchField('name')"
        />

        <!-- Email -->
        <app-input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          iconStart="email"
          [required]="true"
          [error]="emailError() ?? undefined"
          [(ngModel)]="email"
          name="email"
          (blur)="touchField('email')"
        />

        <!-- Password + strength -->
        <div class="form-field-group">
          <app-password-input
            label="Password"
            placeholder="Create a password"
            [required]="true"
            [error]="passwordError() ?? undefined"
            autocomplete="new-password"
            [(ngModel)]="password"
            name="password"
            (blur)="touchField('password')"
          />
          <app-password-strength [password]="password" />
        </div>

        <!-- Confirm password -->
        <app-password-input
          label="Confirm Password"
          placeholder="Repeat your password"
          [required]="true"
          [error]="confirmPasswordError() ?? undefined"
          autocomplete="new-password"
          [(ngModel)]="confirmPassword"
          name="confirmPassword"
          (blur)="touchField('confirmPassword')"
        />

        <!-- Terms -->
        <label class="terms-label" [class.terms-error]="termsError()">
          <input
            class="checkbox"
            type="checkbox"
            [(ngModel)]="acceptTerms"
            name="acceptTerms"
            (change)="termsError.set(false)"
          />
          <span>
            I agree to the
            <a href="#" class="terms-link" target="_blank" rel="noopener">Terms of Service</a>
            and
            <a href="#" class="terms-link" target="_blank" rel="noopener">Privacy Policy</a>
          </span>
        </label>
        @if (termsError()) {
          <p class="field-error">You must accept the terms to continue.</p>
        }

        <!-- Submit -->
        <app-button
          type="submit"
          variant="primary"
          [fullWidth]="true"
          [loading]="authService.loading()"
          [disabled]="authService.loading()"
        >
          Create Account
        </app-button>
      </form>

      <!-- Footer -->
      <p class="auth-footer-text">
        Already have an account?
        <a routerLink="/login" class="auth-link">Sign in</a>
      </p>

    </app-auth-layout>
  `,
  styles: [`
    :host { display: block; }

    /* Banner */
    .auth-banner {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      margin-bottom: var(--space-5);
    }

    .auth-banner .material-icons-outlined { font-size: 1.125rem; flex-shrink: 0; }

    .auth-banner-error {
      background: var(--danger-50);
      color: var(--danger-700);
      border: 1px solid var(--danger-200);
    }

    :host-context(.dark) .auth-banner-error {
      background: rgba(239, 68, 68, 0.12);
      color: var(--danger-300);
      border-color: rgba(239, 68, 68, 0.25);
    }

    /* Role selector */
    .role-selector {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-3);
      margin-bottom: var(--space-5);
    }

    .role-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-1);
      padding: var(--space-4) var(--space-3);
      background: var(--surface);
      border: 2px solid var(--border);
      border-radius: var(--radius-xl);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);
      text-align: center;

      &:hover {
        border-color: var(--gray-300);
        background: var(--gray-50);
      }

      &.is-active {
        border-color: var(--primary-500);
        background: var(--primary-50);
        color: var(--primary-700);
        box-shadow: 0 0 0 3px var(--primary-100);
      }
    }

    :host-context(.dark) .role-btn {
      background: var(--gray-800);
      border-color: var(--gray-700);

      &:hover { border-color: var(--gray-600); background: var(--gray-750, var(--gray-700)); }

      &.is-active {
        border-color: var(--primary-500);
        background: rgba(79, 70, 229, 0.15);
        color: var(--primary-400);
        box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
      }
    }

    .role-icon { font-size: 1.5rem; }

    .role-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
    }

    .role-desc {
      font-size: var(--font-size-xs);
      opacity: 0.75;
    }

    /* Form */
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-4);
    }

    @media (min-width: 480px) {
      .form-row { grid-template-columns: 1fr 1fr; }
    }

    .form-field-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    /* Terms */
    .terms-label {
      display: flex;
      align-items: flex-start;
      gap: var(--space-2);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      cursor: pointer;
      user-select: none;
      line-height: 1.5;
    }

    .terms-label.terms-error { color: var(--danger-600); }

    .checkbox {
      width: 15px;
      height: 15px;
      margin-top: 2px;
      flex-shrink: 0;
      accent-color: var(--primary-500);
      cursor: pointer;
    }

    .terms-link {
      color: var(--primary-600);
      text-decoration: none;
      font-weight: var(--font-weight-medium);

      &:hover { text-decoration: underline; }
    }

    :host-context(.dark) .terms-link { color: var(--primary-400); }

    .field-error {
      font-size: var(--font-size-xs);
      color: var(--danger-600);
      margin: calc(-1 * var(--space-2)) 0 0;
    }

    /* Footer */
    .auth-footer-text {
      margin-top: var(--space-6);
      text-align: center;
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .auth-link {
      color: var(--primary-600);
      font-weight: var(--font-weight-medium);
      text-decoration: none;
      margin-left: var(--space-1);
      transition: color var(--transition-fast);

      &:hover { color: var(--primary-700); text-decoration: underline; }
    }

    :host-context(.dark) .auth-link { color: var(--primary-400); }
    :host-context(.dark) .auth-link:hover { color: var(--primary-300); }
  `],
})
export class RegisterComponent {
  authService = inject(AuthService);
  router      = inject(Router);

  role            : 'customer' | 'provider' = 'customer';
  name            = '';
  email           = '';
  password        = '';
  confirmPassword = '';
  acceptTerms     = false;

  nameError            = signal<string | null>(null);
  emailError           = signal<string | null>(null);
  passwordError        = signal<string | null>(null);
  confirmPasswordError = signal<string | null>(null);
  termsError           = signal(false);

  touchField(field: string): void {
    switch (field) {
      case 'name':             this.nameError.set(validateRequired(this.name, 'Full name')); break;
      case 'email':           this.emailError.set(validateEmail(this.email)); break;
      case 'password':        this.passwordError.set(validatePassword(this.password)); break;
      case 'confirmPassword': this.confirmPasswordError.set(validatePasswordConfirm(this.password, this.confirmPassword)); break;
    }
  }

  private validateAll(): boolean {
    this.nameError.set(validateRequired(this.name, 'Full name'));
    this.emailError.set(validateEmail(this.email));
    this.passwordError.set(validatePassword(this.password));
    this.confirmPasswordError.set(validatePasswordConfirm(this.password, this.confirmPassword));
    this.termsError.set(!this.acceptTerms);

    return (
      !this.nameError() &&
      !this.emailError() &&
      !this.passwordError() &&
      !this.confirmPasswordError() &&
      !this.termsError()
    );
  }

  async onSubmit(): Promise<void> {
    if (!this.validateAll()) return;
    await this.authService.register(
      this.email,
      this.password,
      this.name,
      this.role,
    );
  }
}
