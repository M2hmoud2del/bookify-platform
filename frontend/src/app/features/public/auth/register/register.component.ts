import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';

@Component({
  selector: 'app-register',
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
          <h1 class="auth-title">Create your account</h1>
          <p class="auth-subtitle">Start managing appointments like a pro</p>
        </div>

        <form class="auth-form" (ngSubmit)="onSubmit()">
          <div class="role-selector">
            <button
              type="button"
              class="role-btn"
              [ngClass]="{ 'is-active': role === 'customer' }"
              (click)="role = 'customer'"
            >
              <span class="material-icons-outlined">person</span>
              <span>I'm a Customer</span>
            </button>
            <button
              type="button"
              class="role-btn"
              [ngClass]="{ 'is-active': role === 'provider' }"
              (click)="role = 'provider'"
            >
              <span class="material-icons-outlined">business_center</span>
              <span>I'm a Provider</span>
            </button>
          </div>

          <div class="form-row">
            <app-input
              label="First Name"
              type="text"
              placeholder="First name"
              iconStart="badge"
              [error]="firstNameError() ?? undefined"
              [(ngModel)]="firstName"
              name="firstName"
              [required]="true"
            />
            <app-input
              label="Last Name"
              type="text"
              placeholder="Last name"
              [error]="lastNameError() ?? undefined"
              [(ngModel)]="lastName"
              name="lastName"
              [required]="true"
            />
          </div>

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
            placeholder="Create a password"
            iconStart="lock"
            [error]="passwordError() ?? undefined"
            [(ngModel)]="password"
            name="password"
            [required]="true"
          />

          <app-input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            iconStart="lock"
            [error]="confirmPasswordError() ?? undefined"
            [(ngModel)]="confirmPassword"
            name="confirmPassword"
            [required]="true"
          />

          @if (authService.error()) {
            <p class="auth-error">{{ authService.error() }}</p>
          }

          <label class="terms-checkbox">
            <input type="checkbox" [(ngModel)]="acceptTerms" name="acceptTerms" />
            <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
          </label>

          <app-button type="submit" variant="primary" [fullWidth]="true" [loading]="authService.loading()">
            Create Account
          </app-button>
        </form>

        <p class="auth-footer">
          Already have an account?
          <a routerLink="/login">Sign in</a>
        </p>
      </div>

      <div class="auth-image">
        <img
          src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
          alt="Create account illustration"
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
      max-width: 520px;
      margin: 0 auto;
    }

    @media (min-width: 768px) {
      .auth-container {
        padding: var(--space-12);
      }
    }

    .auth-header {
      margin-bottom: var(--space-6);
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

    .role-selector {
      display: flex;
      gap: var(--space-3);
      margin-bottom: var(--space-2);
    }

    .role-btn {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-4);
      background: var(--surface);
      border: 2px solid var(--border);
      border-radius: var(--radius-xl);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    :host-context(.dark) .role-btn {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .role-btn:hover {
      border-color: var(--gray-300);
    }

    :host-context(.dark) .role-btn:hover {
      border-color: var(--gray-600);
    }

    .role-btn.is-active {
      border-color: var(--primary-500);
      background: var(--primary-100);
      color: var(--primary-600);
    }

    :host-context(.dark) .role-btn.is-active {
      background: rgba(79, 70, 229, 0.2);
      color: var(--primary-400);
    }

    .role-btn .material-icons-outlined {
      font-size: 1.5rem;
    }

    .role-btn span {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-4);
    }

    @media (min-width: 480px) {
      .form-row {
        grid-template-columns: 1fr 1fr;
      }
    }

    .auth-error {
      font-size: var(--font-size-sm);
      color: var(--danger-500);
    }

    .terms-checkbox {
      display: flex;
      align-items: flex-start;
      gap: var(--space-2);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      cursor: pointer;
      margin-top: var(--space-2);
    }

    .terms-checkbox input {
      width: 16px;
      height: 16px;
      margin-top: 2px;
      flex-shrink: 0;
    }

    .terms-checkbox a {
      color: var(--primary-500);
      text-decoration: none;
    }

    .terms-checkbox a:hover {
      text-decoration: underline;
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
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);

  role: 'customer' | 'provider' = 'customer';
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  acceptTerms = false;

  firstNameError = signal<string | null>(null);
  lastNameError = signal<string | null>(null);
  emailError = signal<string | null>(null);
  passwordError = signal<string | null>(null);
  confirmPasswordError = signal<string | null>(null);

  async onSubmit(): Promise<void> {
    if (!this.validate()) return;

    await this.authService.register(
      this.email,
      this.password,
      this.firstName,
      this.lastName,
      this.role
    );
  }

  private validate(): boolean {
    this.firstNameError.set(null);
    this.lastNameError.set(null);
    this.emailError.set(null);
    this.passwordError.set(null);
    this.confirmPasswordError.set(null);

    let valid = true;

    if (!this.firstName) {
      this.firstNameError.set('First name is required');
      valid = false;
    }

    if (!this.lastName) {
      this.lastNameError.set('Last name is required');
      valid = false;
    }

    if (!this.email) {
      this.emailError.set('Email is required');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.emailError.set('Please enter a valid email');
      valid = false;
    }

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

    if (!this.acceptTerms) {
      valid = false;
    }

    return valid;
  }
}
