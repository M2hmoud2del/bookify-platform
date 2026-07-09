import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-provider-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, CardComponent, InputComponent, AvatarComponent],
  template: `
    <div class="profile-page">
      <div class="page-header">
        <h1 class="page-title">Business Profile</h1>
        <p class="page-subtitle">Manage your business information</p>
      </div>
      <div class="profile-grid">
        <app-card title="Business Logo">
          <div class="avatar-section">
            <app-avatar name="My Business" size="xl" />
            <app-button variant="outline" size="sm">Upload Logo</app-button>
          </div>
        </app-card>
        <app-card title="Business Information">
          <form class="profile-form">
            <app-input label="Business Name" placeholder="Your business name" />
            <app-input label="Business Type" placeholder="e.g., Beauty Salon" />
            <app-input label="Address" placeholder="Street address" />
            <app-input label="Phone" type="tel" placeholder="Business phone" />
            <app-input label="Website" type="url" placeholder="https://" />
          </form>
          <div class="form-group">
            <label class="form-label">Business Description</label>
            <textarea class="form-textarea" placeholder="Tell customers about your business..." rows="4"></textarea>
          </div>
          <app-button variant="primary">Save Changes</app-button>
        </app-card>
      </div>
    </div>
  `,
  styles: [`
    .profile-page { display: flex; flex-direction: column; gap: var(--space-6); }
    .page-header { margin-bottom: var(--space-2); }
    .page-title { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); color: var(--text-primary); margin: 0; }
    .page-subtitle { font-size: var(--font-size-sm); color: var(--text-secondary); margin: var(--space-1) 0 0; }
    .profile-grid { display: flex; flex-direction: column; gap: var(--space-4); }
    .avatar-section { display: flex; flex-direction: column; align-items: center; gap: var(--space-4); }
    .profile-form { display: flex; flex-direction: column; gap: var(--space-4); margin-bottom: var(--space-4); }
    .form-group { display: flex; flex-direction: column; gap: var(--space-2); margin-bottom: var(--space-4); }
    .form-label { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); color: var(--gray-700); }
    :host-context(.dark) .form-label { color: var(--gray-300); }
    .form-textarea { padding: var(--space-3) var(--space-4); font-size: var(--font-size-sm); color: var(--text-primary); background: var(--surface); border: 1px solid var(--gray-300); border-radius: var(--radius-lg); resize: vertical; }
    :host-context(.dark) .form-textarea { background: var(--gray-800); border-color: var(--gray-600); }
    .form-textarea:focus { outline: none; border-color: var(--primary-500); }
  `],
})
export class ProviderProfileComponent {
  authService = inject(AuthService);
}
