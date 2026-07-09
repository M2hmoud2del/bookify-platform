import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ButtonComponent, InputComponent],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        @if (!submitted()) {
          <div class="auth-header">
            <a routerLink="/" class="auth-logo">
              <span class="logo-icon">
                <span class="material-icons-outlined">calendar_month</span>
              </span>
              <span class="logo-text">Bookify</span>
            </a>
            <h1 class="auth-title">Forgot your password?</h1>
            <p class="auth-subtitle">Enter your email address and we'll send you a link to reset your password.</p>
          </div>

          <form class="auth-form" (ngSubmit)="onSubmit()">
            <app-input
              label="Email"
              type="email"
              placeholder="Enter your email"
              iconStart="email"
              [error]="emailError() ?? undefined"
              [(ngModel)]="email"
              name="email"
              [required]="true"
            />

            @if (authService.error()) {
              <p class="auth-error">{{ authService.error() }}</p>
            }

            <app-button type="submit" variant="primary" [fullWidth]="true" [loading]="authService.loading()">
              Send Reset Link
            </app-button>
          </form>

          <p class="auth-footer">
            Remember your password?
            <a routerLink="/login">Sign in</a>
          </p>
        } @else {
          <div class="success-state">
            <div class="success-icon">
              <span class="material-icons-outlined">mark_email_read</span>
            </div>
            <h1 class="auth-title">Check your email</h1>
            <p class="auth-subtitle">
              We've sent a password reset link to <strong>{{ email }}</strong>.
              Please check your inbox and follow the instructions.
            </p>
            <app-button variant="secondary" (onClick)="router.navigate(['/login'])">
              Back to Sign In
            </app-button>
            <p class="resend-text">
              Didn't receive the email?
              <button type="button" class="resend-btn" (click)="onResend()">Click to resend</button>
            </p>
          </div>
        }
      </div>

      <div class="auth-image">
        <img
          src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Forgot password illustration"
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
      line-height: var(--line-height-relaxed);
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

    .auth-footer {
      margin-top: var(--space-6);
      text-align: center;
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .auth-footer a {
      color: var(--primary-500);
      text-decoration: none;
    }

    .auth-footer a:hover {
      text-decoration: underline;
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
      background: var(--primary-100);
      border-radius: var(--radius-full);
    }

    :host-context(.dark) .success-icon {
      background: rgba(79, 70, 229, 0.2);
    }

    .success-icon .material-icons-outlined {
      font-size: 2.5rem;
      color: var(--primary-500);
    }

    .resend-text {
      margin-top: var(--space-6);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .resend-btn {
      color: var(--primary-500);
      background: none;
      border: none;
      cursor: pointer;
    }

    .resend-btn:hover {
      text-decoration: underline;
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
export class ForgotPasswordComponent {
  authService = inject(AuthService);
  router = inject(Router);

  email = '';
  submitted = signal(false);
  emailError = signal<string | null>(null);

  async onSubmit(): Promise<void> {
    if (!this.validate()) return;

    await this.authService.forgotPassword(this.email);
    this.submitted.set(true);
  }

  async onResend(): Promise<void> {
    if (this.email) {
      await this.authService.forgotPassword(this.email);
    }
  }

  private validate(): boolean {
    this.emailError.set(null);

    if (!this.email) {
      this.emailError.set('Email is required');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.emailError.set('Please enter a valid email');
      return false;
    }

    return true;
  }
}
