import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { AuthLayoutComponent } from '../shared/auth-layout.component';
import { PasswordInputComponent } from '../shared/password-input.component';
import { validateEmail, validatePassword } from '../shared/auth-validators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ButtonComponent,
    InputComponent,
    AuthLayoutComponent,
    PasswordInputComponent,
  ],
  template: `
    <app-auth-layout
      title="Welcome back"
      subtitle="Sign in to your account to manage appointments"
      imageUrl="https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=1200"
      quote="Bookify saves me hours every week. My booking rate went up 40% in the first month alone."
      quoteAuthor="Dr. Michael Chen, Family Physician"
    >
      <!-- Verification / info banner -->
      @if (infoBanner()) {
        <div class="auth-banner auth-banner-info">
          <span class="material-icons-outlined">mark_email_read</span>
          <span>{{ infoBanner() }}</span>
        </div>
      }

      <!-- Global auth error -->
      @if (authService.error()) {
        <div class="auth-banner auth-banner-error">
          <span class="material-icons-outlined">error_outline</span>
          <span>{{ authService.error() }}</span>
        </div>
      }

      <!-- Form -->
      <form class="auth-form" (ngSubmit)="onSubmit()" novalidate>

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

        <!-- Password -->
        <div class="form-field-group">
          <app-password-input
            label="Password"
            placeholder="Enter your password"
            [required]="true"
            [error]="passwordError() ?? undefined"
            autocomplete="current-password"
            [(ngModel)]="password"
            name="password"
            (blur)="touchField('password')"
          />

          <div class="field-aux">
            <label class="remember-label">
              <input
                class="checkbox"
                type="checkbox"
                [(ngModel)]="rememberMe"
                name="rememberMe"
              />
              <span>Remember me</span>
            </label>
            <a routerLink="/forgot-password" class="forgot-link">Forgot password?</a>
          </div>
        </div>

        <!-- Submit -->
        <app-button
          type="submit"
          variant="primary"
          [fullWidth]="true"
          [loading]="authService.loading()"
          [disabled]="authService.loading()"
        >
          Sign In
        </app-button>
      </form>

      <!-- Divider -->
      <div class="auth-divider">
        <span class="divider-line"></span>
        <span class="divider-text">or continue with</span>
        <span class="divider-line"></span>
      </div>

      <!-- Social buttons -->
      <div class="social-row">
        <button type="button" class="social-btn" (click)="onSocialLogin('google')">
          <svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Google</span>
        </button>

        <button type="button" class="social-btn" (click)="onSocialLogin('github')">
          <svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
          <span>GitHub</span>
        </button>
      </div>

      <!-- Footer -->
      <p class="auth-footer-text">
        Don't have an account?
        <a routerLink="/register" class="auth-link">Create account</a>
      </p>

    </app-auth-layout>
  `,
  styles: [`
    :host { display: block; }

    /* Banners */
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

    .auth-banner-info {
      background: var(--primary-50);
      color: var(--primary-700);
      border: 1px solid var(--primary-200);
    }

    .auth-banner-error {
      background: var(--danger-50);
      color: var(--danger-700);
      border: 1px solid var(--danger-200);
    }

    :host-context(.dark) .auth-banner-info {
      background: rgba(79, 70, 229, 0.12);
      color: var(--primary-300);
      border-color: rgba(79, 70, 229, 0.25);
    }

    :host-context(.dark) .auth-banner-error {
      background: rgba(239, 68, 68, 0.12);
      color: var(--danger-300);
      border-color: rgba(239, 68, 68, 0.25);
    }

    /* Form */
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .form-field-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .field-aux {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .remember-label {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      cursor: pointer;
      user-select: none;
    }

    .checkbox {
      width: 15px;
      height: 15px;
      accent-color: var(--primary-500);
      cursor: pointer;
    }

    .forgot-link {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--primary-600);
      text-decoration: none;
      transition: color var(--transition-fast);

      &:hover { color: var(--primary-700); text-decoration: underline; }
    }

    :host-context(.dark) .forgot-link { color: var(--primary-400); }
    :host-context(.dark) .forgot-link:hover { color: var(--primary-300); }

    /* Divider */
    .auth-divider {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin: var(--space-6) 0;
    }

    .divider-line {
      flex: 1;
      height: 1px;
      background: var(--border);
    }

    :host-context(.dark) .divider-line { background: var(--gray-700); }

    .divider-text {
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
      white-space: nowrap;
    }

    /* Social buttons */
    .social-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-3);
    }

    .social-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-4);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        background: var(--gray-50);
        border-color: var(--gray-300);
        box-shadow: var(--shadow-sm);
      }

      &:active { transform: translateY(1px); }
    }

    :host-context(.dark) .social-btn {
      background: var(--gray-800);
      border-color: var(--gray-700);

      &:hover {
        background: var(--gray-750, var(--gray-700));
        border-color: var(--gray-600);
      }
    }

    .social-icon { width: 18px; height: 18px; flex-shrink: 0; }

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
export class LoginComponent {
  authService = inject(AuthService);
  router      = inject(Router);
  route       = inject(ActivatedRoute);

  email      = '';
  password   = '';
  rememberMe = false;

  emailError    = signal<string | null>(null);
  passwordError = signal<string | null>(null);
  infoBanner    = signal<string | null>(null);

  private touched = { email: false, password: false };

  constructor() {
    this.route.queryParams.subscribe(params => {
      if (params['message'] === 'check-email') {
        this.infoBanner.set('Check your inbox to verify your email, then sign in.');
      }
    });
  }

  touchField(field: 'email' | 'password'): void {
    this.touched[field] = true;
    this.validateField(field);
  }

  private validateField(field: 'email' | 'password'): void {
    if (field === 'email')    this.emailError.set(validateEmail(this.email));
    if (field === 'password') this.passwordError.set(validatePassword(this.password));
  }

  private validateAll(): boolean {
    this.emailError.set(validateEmail(this.email));
    this.passwordError.set(validatePassword(this.password));
    return !this.emailError() && !this.passwordError();
  }

  async onSubmit(): Promise<void> {
    if (!this.validateAll()) return;
    await this.authService.login(this.email, this.password);
  }

  onSocialLogin(provider: string): void {
    console.log(`Social login with ${provider} — not yet connected`);
  }
}
