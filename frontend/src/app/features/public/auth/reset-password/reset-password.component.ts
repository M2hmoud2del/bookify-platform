import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AuthLayoutComponent } from '../shared/auth-layout.component';
import { PasswordInputComponent } from '../shared/password-input.component';
import { PasswordStrengthComponent } from '../shared/password-strength.component';
import { validatePassword, validatePasswordConfirm } from '../shared/auth-validators';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ButtonComponent,
    AuthLayoutComponent,
    PasswordInputComponent,
    PasswordStrengthComponent,
  ],
  template: `
    <app-auth-layout
      title="Set new password"
      subtitle="Choose a strong password you haven't used before"
      imageUrl="https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1200"
      quote="Security matters. Bookify makes it simple to stay protected."
      quoteAuthor="James Brown, Freelance Consultant"
    >
      <!-- Success state -->
      @if (done()) {
        <div class="success-card">
          <div class="success-icon">
            <span class="material-icons-outlined">lock_reset</span>
          </div>
          <h2 class="success-title">Password updated!</h2>
          <p class="success-body">
            Your password has been changed successfully. You can now sign in with your new credentials.
          </p>
          <a routerLink="/login" class="back-btn">
            Go to Sign In
          </a>
        </div>

      } @else {
        @if (authService.error()) {
          <div class="auth-banner auth-banner-error">
            <span class="material-icons-outlined">error_outline</span>
            <span>{{ authService.error() }}</span>
          </div>
        }

        <form class="auth-form" (ngSubmit)="onSubmit()" novalidate>
          <div class="form-field-group">
            <app-password-input
              label="New Password"
              placeholder="Create a new password"
              [required]="true"
              [error]="passwordError() ?? undefined"
              autocomplete="new-password"
              [(ngModel)]="password"
              name="password"
              (blur)="passwordError.set(validatePassword(password))"
            />
            <app-password-strength [password]="password" />
          </div>

          <app-password-input
            label="Confirm New Password"
            placeholder="Repeat your new password"
            [required]="true"
            [error]="confirmError() ?? undefined"
            autocomplete="new-password"
            [(ngModel)]="confirmPassword"
            name="confirmPassword"
            (blur)="confirmError.set(validatePasswordConfirm(password, confirmPassword))"
          />

          <app-button
            type="submit"
            variant="primary"
            [fullWidth]="true"
            [loading]="authService.loading()"
          >
            Update Password
          </app-button>
        </form>
      }
    </app-auth-layout>
  `,
  styles: [`
    :host { display: block; }

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

    .auth-form { display: flex; flex-direction: column; gap: var(--space-4); }

    .form-field-group { display: flex; flex-direction: column; gap: var(--space-2); }

    /* Success */
    .success-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: var(--space-4);
      padding: var(--space-8) var(--space-4);
    }

    .success-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 64px;
      height: 64px;
      background: var(--success-100);
      border-radius: var(--radius-full);
      color: var(--success-600);
    }
    :host-context(.dark) .success-icon {
      background: rgba(34, 197, 94, 0.15);
      color: var(--success-400);
    }
    .success-icon .material-icons-outlined { font-size: 2rem; }

    .success-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0;
    }

    .success-body {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
      max-width: 340px;
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-3) var(--space-8);
      background: var(--primary-500);
      color: #fff;
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      text-decoration: none;
      margin-top: var(--space-2);
      transition: background var(--transition-fast), box-shadow var(--transition-fast);

      &:hover { background: var(--primary-600); box-shadow: var(--shadow-md); }
    }
  `],
})
export class ResetPasswordComponent {
  authService = inject(AuthService);
  router      = inject(Router);

  password        = '';
  confirmPassword = '';
  passwordError   = signal<string | null>(null);
  confirmError    = signal<string | null>(null);
  done            = signal(false);

  readonly validatePassword        = validatePassword;
  readonly validatePasswordConfirm = validatePasswordConfirm;

  private validateAll(): boolean {
    this.passwordError.set(validatePassword(this.password));
    this.confirmError.set(validatePasswordConfirm(this.password, this.confirmPassword));
    return !this.passwordError() && !this.confirmError();
  }

  async onSubmit(): Promise<void> {
    if (!this.validateAll()) return;
    const ok = await this.authService.resetPassword(this.password);
    if (ok) this.done.set(true);
  }
}
