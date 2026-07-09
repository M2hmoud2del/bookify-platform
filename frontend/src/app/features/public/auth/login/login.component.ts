import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ButtonComponent, InputComponent],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-header">
          <a routerLink="/" class="auth-logo">
            <span class="logo-icon">
              <span class="material-icons-outlined">calendar_month</span>
            </span>
            <span class="logo-text">Bookify</span>
          </a>
          <h1 class="auth-title">Welcome back</h1>
          <p class="auth-subtitle">Enter your credentials to access your account</p>
        </div>

        @if (message()) {
          <div class="auth-message">
            <span class="material-icons-outlined">check_circle</span>
            <span>Please check your email to verify your account</span>
          </div>
        }

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

          <app-input
            label="Password"
            type="password"
            placeholder="Enter your password"
            iconStart="lock"
            iconEnd="visibility_off"
            [error]="passwordError() ?? undefined"
            [(ngModel)]="password"
            name="password"
            [required]="true"
          />

          @if (authService.error()) {
            <p class="auth-error">{{ authService.error() }}</p>
          }

          <div class="auth-options">
            <label class="remember-me">
              <input type="checkbox" [(ngModel)]="rememberMe" name="remember" />
              <span>Remember me</span>
            </label>
            <a routerLink="/forgot-password" class="forgot-link">Forgot password?</a>
          </div>

          <app-button type="submit" variant="primary" [fullWidth]="true" [loading]="authService.loading()">
            Sign In
          </app-button>
        </form>

        <div class="auth-divider">
          <span>or continue with</span>
        </div>

        <div class="social-buttons">
          <button type="button" class="social-btn" (click)="onSocialLogin('google')">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Google</span>
          </button>
        </div>

        <p class="auth-footer">
          Don't have an account?
          <a routerLink="/register">Create account</a>
        </p>
      </div>

      <div class="auth-image">
        <img
          src="https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Sign in illustration"
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

    .auth-message {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-4);
      background: var(--success-100);
      color: var(--success-700);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-6);
      font-size: var(--font-size-sm);
    }

    :host-context(.dark) .auth-message {
      background: rgba(34, 197, 94, 0.2);
      color: var(--success-500);
    }

    .auth-message .material-icons-outlined {
      font-size: 1.25rem;
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

    .auth-options {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-4);
    }

    .remember-me {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      cursor: pointer;
    }

    .remember-me input {
      width: 16px;
      height: 16px;
      border-radius: var(--radius-sm);
    }

    .forgot-link {
      font-size: var(--font-size-sm);
      color: var(--primary-500);
      text-decoration: none;
    }

    .forgot-link:hover {
      text-decoration: underline;
    }

    .auth-divider {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      margin: var(--space-6) 0;
    }

    .auth-divider::before,
    .auth-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border);
    }

    :host-context(.dark) .auth-divider::before,
    :host-context(.dark) .auth-divider::after {
      background: var(--gray-700);
    }

    .auth-divider span {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .social-buttons {
      display: flex;
      gap: var(--space-3);
    }

    .social-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      padding: var(--space-3);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    :host-context(.dark) .social-btn {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .social-btn:hover {
      background: var(--gray-50);
      border-color: var(--gray-300);
    }

    :host-context(.dark) .social-btn:hover {
      background: var(--gray-700);
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
      font-weight: var(--font-weight-medium);
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }

    .auth-image {
      display: none;
      position: relative;
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
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  email = '';
  password = '';
  rememberMe = false;

  emailError = signal<string | null>(null);
  passwordError = signal<string | null>(null);

  message = signal<string | null>(null);

  constructor() {
    this.route.queryParams.subscribe((params) => {
      if (params['message'] === 'check-email') {
        this.message.set('Please check your email to verify your account');
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (!this.validate()) return;

    await this.authService.login(this.email, this.password);
  }

  onSocialLogin(provider: string): void {
    console.log('Social login with', provider);
  }

  private validate(): boolean {
    this.emailError.set(null);
    this.passwordError.set(null);

    if (!this.email) {
      this.emailError.set('Email is required');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.emailError.set('Please enter a valid email');
      return false;
    }

    if (!this.password) {
      this.passwordError.set('Password is required');
      return false;
    }

    if (this.password.length < 6) {
      this.passwordError.set('Password must be at least 6 characters');
      return false;
    }

    return true;
  }
}
