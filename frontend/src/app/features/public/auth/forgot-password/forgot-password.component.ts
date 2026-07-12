import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { AuthLayoutComponent } from '../shared/auth-layout.component';
import { validateEmail } from '../shared/auth-validators';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ButtonComponent,
    InputComponent,
    AuthLayoutComponent,
  ],
  template: `
    <app-auth-layout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link"
      imageUrl="https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1200"
      quote="Bookify makes it easy to get back on track — no fuss, no downtime."
      quoteAuthor="Alex Rivera, Personal Trainer"
    >
      <!-- Success state -->
      @if (sent()) {
        <div class="success-card">
          <div class="success-icon">
            <span class="material-icons-outlined">mark_email_read</span>
          </div>
          <h2 class="success-title">Check your inbox</h2>
          <p class="success-body">
            We sent a password reset link to <strong>{{ email }}</strong>.
            Check your email and follow the instructions.
          </p>
          <p class="success-hint">
            Didn't receive it?
            <button type="button" class="resend-btn" (click)="onResend()">Resend email</button>
          </p>
          <a routerLink="/login" class="back-link">
            <span class="material-icons-outlined">arrow_back</span>
            Back to sign in
          </a>
        </div>

      } @else {
        <!-- Form -->
        @if (authService.error()) {
          <div class="auth-banner auth-banner-error">
            <span class="material-icons-outlined">error_outline</span>
            <span>{{ authService.error() }}</span>
          </div>
        }

        <form class="auth-form" (ngSubmit)="onSubmit()" novalidate>
          <app-input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            iconStart="email"
            [required]="true"
            [error]="emailError() ?? undefined"
            [(ngModel)]="email"
            name="email"
            (blur)="emailError.set(validateEmail(email))"
          />

          <app-button
            type="submit"
            variant="primary"
            [fullWidth]="true"
            [loading]="authService.loading()"
          >
            Send Reset Link
          </app-button>
        </form>

        <p class="auth-footer-text">
          Remembered your password?
          <a routerLink="/login" class="auth-link">Sign in</a>
        </p>
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

    /* Success card */
    .success-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: var(--space-4);
      padding: var(--space-6) var(--space-4);
      background: var(--success-50);
      border: 1px solid var(--success-200);
      border-radius: var(--radius-2xl);
    }

    :host-context(.dark) .success-card {
      background: rgba(34, 197, 94, 0.08);
      border-color: rgba(34, 197, 94, 0.2);
    }

    .success-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      background: var(--success-100);
      border-radius: var(--radius-full);
      color: var(--success-600);
    }
    :host-context(.dark) .success-icon {
      background: rgba(34, 197, 94, 0.15);
      color: var(--success-400);
    }
    .success-icon .material-icons-outlined { font-size: 1.75rem; }

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
    }

    .success-hint {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0;
    }

    .resend-btn {
      background: none;
      border: none;
      padding: 0;
      color: var(--primary-600);
      font-weight: var(--font-weight-medium);
      font-size: inherit;
      cursor: pointer;
      text-decoration: underline;
    }
    :host-context(.dark) .resend-btn { color: var(--primary-400); }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: var(--space-1);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--primary-600);
      text-decoration: none;
      margin-top: var(--space-2);
      transition: gap var(--transition-fast);

      &:hover { gap: var(--space-2); text-decoration: underline; }
    }
    :host-context(.dark) .back-link { color: var(--primary-400); }
    .back-link .material-icons-outlined { font-size: 1rem; }

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
      &:hover { text-decoration: underline; }
    }
    :host-context(.dark) .auth-link { color: var(--primary-400); }
  `],
})
export class ForgotPasswordComponent {
  authService = inject(AuthService);

  email      = '';
  emailError = signal<string | null>(null);
  sent       = signal(false);

  readonly validateEmail = validateEmail;

  async onSubmit(): Promise<void> {
    this.emailError.set(validateEmail(this.email));
    if (this.emailError()) return;

    const ok = await this.authService.forgotPassword(this.email);
    if (ok) this.sent.set(true);
  }

  async onResend(): Promise<void> {
    await this.authService.forgotPassword(this.email);
  }
}
