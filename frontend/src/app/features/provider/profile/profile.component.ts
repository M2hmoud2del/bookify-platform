import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { MOCK_PROVIDER_PROFILE } from '../shared/provider.models';

@Component({
  selector: 'app-provider-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ButtonComponent, CardComponent, InputComponent, AvatarComponent],
  template: `
    <div class="profile-page">
      <div class="page-header">
        <a routerLink="/provider/dashboard" class="back-link">
          <span class="material-icons-outlined">arrow_back</span>
          Back to Dashboard
        </a>
        <h1 class="page-title">Business Profile</h1>
        <p class="page-subtitle">Manage your business information and appearance</p>
      </div>

      <div class="profile-grid">
        <!-- Profile Image -->
        <app-card title="Business Media">
          <div class="media-section">
            <div class="logo-section">
              <app-avatar name="Blossom Beauty" size="xl" />
              <div class="logo-actions">
                <app-button variant="outline" size="sm">
                  <span class="material-icons-outlined">photo_camera</span>
                  Upload Profile Image
                </app-button>
                <app-button variant="ghost" size="sm">
                  <span class="material-icons-outlined">delete</span>
                  Remove
                </app-button>
              </div>
            </div>
          </div>
        </app-card>

        <!-- Business Info -->
        <app-card title="Business Information">
          <form class="info-form" (ngSubmit)="onSave()">
            <app-input
              label="Business Name"
              placeholder="Your business name"
              [required]="true"
              [(ngModel)]="business.businessName"
              name="businessName"
            />
            <app-input
              label="Category"
              placeholder="e.g., beauty"
              [(ngModel)]="business.category"
              name="category"
            />
            <app-input
              label="Address"
              placeholder="Street address"
              [(ngModel)]="business.address"
              name="address"
            />
            <div class="form-row">
              <app-input
                label="City"
                placeholder="City"
                [(ngModel)]="business.city"
                name="city"
              />
              <app-input
                label="Timezone"
                placeholder="e.g., America/New_York"
                [(ngModel)]="business.timezone"
                name="timezone"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Business Description</label>
              <textarea
                class="form-textarea"
                placeholder="Tell customers about your business..."
                rows="4"
                [(ngModel)]="business.bio"
                name="bio"
                maxlength="500"
              ></textarea>
              <p class="char-count">{{ business.bio.length }} / 500</p>
            </div>

            <div class="form-actions">
              <app-button variant="outline" type="button" [routerLink]="['/provider/dashboard']">
                Cancel
              </app-button>
              <app-button variant="primary" type="submit" [loading]="saving()">
                <span class="material-icons-outlined">save</span>
                Save Changes
              </app-button>
            </div>
          </form>
        </app-card>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .profile-page {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .page-header {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .back-link {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      text-decoration: none;
      transition: color var(--transition-fast);
    }

    .back-link:hover { color: var(--primary-500); }

    .page-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0;
    }

    .page-subtitle {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: var(--space-1) 0 0;
    }

    .profile-grid {
      display: flex;
      flex-direction: column;
      gap: var(--space-5);
    }

    .media-section {
      display: flex;
      flex-direction: column;
      gap: var(--space-5);
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    .logo-actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .info-form {
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

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .form-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .form-textarea {
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
      transition: border-color var(--transition-fast);
    }

    :host-context(.dark) .form-textarea {
      background: var(--gray-900);
      border-color: var(--gray-700);
      color: var(--gray-100);
    }

    .form-textarea:focus { border-color: var(--primary-500); }

    .char-count {
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
      text-align: right;
    }

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
export class ProviderProfileComponent {
  private router = inject(Router);
  authService = inject(AuthService);

  saving = signal(false);

  business = {
    businessName: MOCK_PROVIDER_PROFILE.businessName,
    bio: MOCK_PROVIDER_PROFILE.bio ?? '',
    category: MOCK_PROVIDER_PROFILE.category ?? '',
    address: MOCK_PROVIDER_PROFILE.address ?? '',
    city: MOCK_PROVIDER_PROFILE.city ?? '',
    timezone: MOCK_PROVIDER_PROFILE.timezone,
  };

  onSave(): void {
    this.saving.set(true);
    setTimeout(() => {
      this.saving.set(false);
      this.router.navigate(['/provider/dashboard']);
    }, 800);
  }
}
