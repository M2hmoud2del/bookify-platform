import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';

@Component({
  selector: 'app-customer-edit-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ButtonComponent, InputComponent],
  template: `
    <div class="edit-page">
      <div class="page-header">
        <a routerLink="/customer/profile" class="back-link">
          <span class="material-icons-outlined">arrow_back</span>
          Back to Profile
        </a>
        <h1 class="page-title">Edit Profile</h1>
      </div>

      <form class="edit-form" (ngSubmit)="onSubmit()" novalidate>
        <!-- Avatar section -->
        <div class="avatar-section">
          <div class="avatar-preview">
            <span class="material-icons-outlined avatar-placeholder">person</span>
          </div>
          <div class="avatar-actions">
            <app-button variant="outline" size="sm" type="button">
              <span class="material-icons-outlined">photo_camera</span>
              Change Photo
            </app-button>
            <app-button variant="ghost" size="sm" type="button">
              <span class="material-icons-outlined">delete</span>
              Remove
            </app-button>
          </div>
        </div>

        <!-- Personal Info -->
        <div class="form-section">
          <h2 class="section-title">Personal Information</h2>
          <div class="form-row">
            <app-input
              label="First Name"
              type="text"
              placeholder="First name"
              [required]="true"
              [error]="firstNameError() ?? undefined"
              [(ngModel)]="firstName"
              name="firstName"
            />
            <app-input
              label="Last Name"
              type="text"
              placeholder="Last name"
              [required]="true"
              [error]="lastNameError() ?? undefined"
              [(ngModel)]="lastName"
              name="lastName"
            />
          </div>

          <app-input
            label="Email"
            type="email"
            placeholder="you@example.com"
            [required]="true"
            [error]="emailError() ?? undefined"
            [(ngModel)]="email"
            name="email"
          />

          <app-input
            label="Phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            [(ngModel)]="phone"
            name="phone"
          />
        </div>

        <!-- Address -->
        <div class="form-section">
          <h2 class="section-title">Address</h2>
          <app-input
            label="Street Address"
            type="text"
            placeholder="123 Main St"
            [(ngModel)]="address"
            name="address"
          />
          <div class="form-row">
            <app-input
              label="City"
              type="text"
              placeholder="City"
              [(ngModel)]="city"
              name="city"
            />
            <app-input
              label="State / Province"
              type="text"
              placeholder="State"
              [(ngModel)]="state"
              name="state"
            />
          </div>
          <div class="form-row">
            <app-input
              label="Postal Code"
              type="text"
              placeholder="12345"
              [(ngModel)]="postalCode"
              name="postalCode"
            />
            <app-input
              label="Country"
              type="text"
              placeholder="Country"
              [(ngModel)]="country"
              name="country"
            />
          </div>
        </div>

        <!-- Bio -->
        <div class="form-section">
          <h2 class="section-title">About Me</h2>
          <div class="bio-field">
            <label class="bio-label" for="bio">Bio</label>
            <textarea
              id="bio"
              class="bio-input"
              [(ngModel)]="bio"
              name="bio"
              rows="3"
              placeholder="Tell us a bit about yourself..."
              maxlength="200"
            ></textarea>
            <p class="char-count">{{ bio.length }} / 200</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <app-button variant="outline" type="button" [routerLink]="['/customer/profile']">
            Cancel
          </app-button>
          <app-button variant="primary" type="submit" [loading]="saving()">
            <span class="material-icons-outlined">save</span>
            Save Changes
          </app-button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .edit-page {
      max-width: 600px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .page-header {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .back-link {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      text-decoration: none;
      transition: color var(--transition-fast);

      &:hover { color: var(--primary-500); }
    }

    .page-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0;
    }

    .edit-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
      padding: var(--space-6);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-2xl);
    }

    :host-context(.dark) .edit-form {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    /* Avatar */
    .avatar-section {
      display: flex;
      align-items: center;
      gap: var(--space-5);
    }

    .avatar-preview {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      background: var(--primary-100);
      border-radius: var(--radius-full);
      flex-shrink: 0;
    }

    :host-context(.dark) .avatar-preview {
      background: rgba(79, 70, 229, 0.15);
    }

    .avatar-placeholder {
      font-size: 2.5rem;
      color: var(--primary-500);
    }

    .avatar-actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    /* Form sections */
    .form-section {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .section-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
      padding-bottom: var(--space-2);
      border-bottom: 1px solid var(--border);
    }

    :host-context(.dark) .section-title { border-color: var(--gray-700); }

    .form-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-4);
    }

    @media (min-width: 480px) {
      .form-row { grid-template-columns: 1fr 1fr; }
    }

    /* Bio */
    .bio-field {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .bio-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .bio-input {
      width: 100%;
      padding: var(--space-3) var(--space-4);
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      background: var(--gray-50);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      resize: vertical;
      outline: none;
      font-family: inherit;
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);

      &:focus {
        border-color: var(--primary-500);
        box-shadow: 0 0 0 3px var(--primary-100);
      }
    }

    :host-context(.dark) .bio-input {
      background: var(--gray-900);
      border-color: var(--gray-700);
      color: var(--gray-100);
    }

    .char-count {
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
      text-align: right;
    }

    /* Actions */
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-3);
      padding-top: var(--space-4);
      border-top: 1px solid var(--border);
    }

    :host-context(.dark) .form-actions { border-color: var(--gray-700); }
  `],
})
export class CustomerEditProfileComponent {
  private router = inject(Router);
  authService = inject(AuthService);

  firstName = this.authService.user()?.name.split(' ')[0] ?? 'John';
  lastName = this.authService.user()?.name.split(' ').slice(1).join(' ') ?? 'Doe';
  email = this.authService.user()?.email ?? 'john.doe@example.com';
  phone = '+1 (555) 123-4567';
  address = '123 Main Street';
  city = 'New York';
  state = 'NY';
  postalCode = '10001';
  country = 'United States';
  bio = 'Love trying new services and supporting local businesses!';

  firstNameError = signal<string | null>(null);
  lastNameError = signal<string | null>(null);
  emailError = signal<string | null>(null);
  saving = signal(false);

  onSubmit(): void {
    let valid = true;

    if (!this.firstName.trim()) {
      this.firstNameError.set('First name is required');
      valid = false;
    } else {
      this.firstNameError.set(null);
    }

    if (!this.lastName.trim()) {
      this.lastNameError.set('Last name is required');
      valid = false;
    } else {
      this.lastNameError.set(null);
    }

    if (!this.email.trim()) {
      this.emailError.set('Email is required');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.emailError.set('Please enter a valid email');
      valid = false;
    } else {
      this.emailError.set(null);
    }

    if (!valid) return;

    this.saving.set(true);
    setTimeout(() => {
      this.saving.set(false);
      this.router.navigate(['/customer/profile']);
    }, 800);
  }
}
