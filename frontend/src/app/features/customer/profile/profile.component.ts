import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, CardComponent, InputComponent, AvatarComponent],
  template: `
    <div class="profile-page">
      <div class="page-header">
        <h1 class="page-title">Profile Settings</h1>
        <p class="page-subtitle">Manage your personal information</p>
      </div>
      <div class="profile-grid">
        <app-card title="Profile Picture">
          <div class="avatar-section">
            <app-avatar [name]="userDisplayName()" size="xl" />
            <app-button variant="outline" size="sm">Change Photo</app-button>
          </div>
        </app-card>
        <app-card title="Personal Information">
          <form class="profile-form">
            <div class="form-row">
              <app-input label="First Name" [value]="authService.user()?.first_name ?? ''" />
              <app-input label="Last Name" [value]="authService.user()?.last_name ?? ''" />
            </div>
            <app-input label="Email" type="email" [value]="authService.user()?.email ?? ''" />
            <app-input label="Phone" type="tel" placeholder="Enter phone" />
          </form>
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
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
  `],
})
export class CustomerProfileComponent {
  authService = inject(AuthService);
  userDisplayName = () => {
    const user = this.authService.user();
    return user ? `${user.first_name} ${user.last_name}` : 'User';
  };
}
