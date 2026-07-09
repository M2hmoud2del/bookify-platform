import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ButtonComponent, InputComponent],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        @if (!success()) {
          <div class="auth-header">
            <a routerLink="/" class="auth-logo">
              <span class="logo-icon">
                <span class="material-icons-outlined">calendar_month</span>
              </span>
              <span class="logo-text">Bookify</span>
            </a>
            <h1 class="auth-title">Set new password</h1>
            <p class="auth-subtitle">Your new password must be different from previous passwords.</p>
          </div>

          <form class="auth-form" (ngSubmit)="onSubmit()">
            <app-input
              label="New Password"
              type="password"
              placeholder="Enter new password"
              iconStart="lock"
              [error]="passwordError() ?? undefined"
              [(ngModel)]="password"
              name="password"
              [required]="true"
            />

            <app-input
              label="Confirm Password"
              type="password"
              placeholder="Confirm new password"
              iconStart="lock"
              [error]="confirmPasswordError() ?? undefined"
              [(ngModel)]="confirmPassword"
              name="confirmPassword"
              [required]="true"
            />

            @if (authService.error()) {
              <p class="auth-error">{{ authService.error() }}</p>
            }

            <div class="password-requirements">
              <p class="requirements-title">Password must contain:</p>
              <ul class="requirements-list">
                <li [class.is-valid]="password.length >= 8">At least 8 characters</li>
                <li [class.is-valid]="/[A-Z]/.test(password)">One uppercase letter</li>
                <li [class.is-valid]="/[a-z]/.test(password)">One lowercase letter</li>
                <li [class.is-valid]="/[0-9]/.test(password)">One number</li>
              </ul>
            </div>

            <app-button type="submit" variant="primary" [fullWidth]="true" [loading]="authService.loading()">
              Reset Password
            </app-button>
          </form>
        } @else {
          <div class="success-state">
            <div class="success-icon">
              <span class="material-icons-outlined">check_circle</span>
            </div>
            <h1 class="auth-title">Password reset successful</h1>
            <p class="auth-subtitle">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            <app-button variant="primary" routerLink="/login">
              Continue to Sign In
            </app-button>
          </div>
        }
      </div>

      <div class="auth-image">
        <img
          src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Reset password illustration"
        />
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }

    .auth-page {
      display: grid;
      grid-template-columns: 1fr;
      min-height: 100vh;
    }

    @media (min-width: 1024px) {
      .auth-page {
        grid-template-columns: 1fr 1fr;
      }
    }

    .auth-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: var(--space-8);
      max-width: 480px;
      margin: 0 auto;
    }

    @media (min-width: 768px) {
      .auth-container {
        padding: var(--space-12);
      }
    }

    .auth-header {
      margin-bottom: var(--space-8);
    }

    .auth-logo {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      color: var(--text-primary);
      text-decoration: none;
      margin-bottom: var(--space-6);
    }

    .logo-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: var(--primary-500);
      border-radius: var(--radius-lg);
      color: white;
    }

    .logo-icon .material-icons-outlined {
      font-size: 1.5rem;
    }

    .logo-text {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
    }

    .auth-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--space-2);
    }

    .auth-subtitle {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      margin: 0;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .auth-error {
      font-size: var(--font-size-sm);
      color: var(--danger-500);
    }

    .password-requirements {
      background: var(--gray-50);
      border-radius: var(--radius-lg);
      padding: var(--space-4);
    }

    :host-context(.dark) .password-requirements {
      background: var(--gray-800);
    }

    .requirements-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      margin: 0 0 var(--space-2);
    }

    .requirements-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .requirements-list li {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      padding-left: var(--space-4);
      position: relative;
    }

    .requirements-list li::before {
      content: '•';
      position: absolute;
      left: 0;
    }

    .requirements-list li.is-valid {
      color: var(--success-500);
    }

    .success-state {
      text-align: center;
    }

    .success-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      margin: 0 auto var(--space-6);
      background: var(--success-100);
      border-radius: var(--radius-full);
    }

    :host-context(.dark) .success-icon {
      background: rgba(34, 197, 94, 0.2);
    }

    .success-icon .material-icons-outlined {
      font-size: 2.5rem;
      color: var(--success-500);
    }

    .auth-image {
      display: none;
      overflow: hidden;
    }

    @media (min-width: 1024px) {
      .auth-image {
        display: block;
      }
    }

    .auth-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `],
})
export class ResetPasswordComponent {
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  password = '';
  confirmPassword = '';
  success = signal(false);

  passwordError = signal<string | null>(null);
  confirmPasswordError = signal<string | null>(null);

  async onSubmit(): Promise<void> {
    if (!this.validate()) return;

    const result = await this.authService.resetPassword(this.password);
    if (result) {
      this.success.set(true);
    }
  }

  private validate(): boolean {
    this.passwordError.set(null);
    this.confirmPasswordError.set(null);

    let valid = true;

    if (!this.password) {
      this.passwordError.set('Password is required');
      valid = false;
    } else if (this.password.length < 8) {
      this.passwordError.set('Password must be at least 8 characters');
      valid = false;
    }

    if (!this.confirmPassword) {
      this.confirmPasswordError.set('Please confirm your password');
      valid = false;
    } else if (this.password !== this.confirmPassword) {
      this.confirmPasswordError.set('Passwords do not match');
      valid = false;
    }

    return valid;
  }
}
