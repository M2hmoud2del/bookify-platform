import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { ProfileHeaderComponent } from '../shared/profile-header.component';
import { MOCK_APPOINTMENTS, MOCK_REVIEWS } from '../shared/customer.models';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, CardComponent, ProfileHeaderComponent],
  template: `
    <div class="profile-page">
      <app-profile-header
        [displayName]="displayName()"
        [email]="authService.user()?.email ?? 'user@example.com'"
        [avatarUrl]="null"
        [totalAppointments]="totalAppointments()"
        [completedAppointments]="completedAppointments()"
        [totalReviews]="totalReviews()"
        [editLink]="['/customer/profile/edit']"
      />

      <div class="content-grid">
        <!-- Personal Info -->
        <app-card title="Personal Information">
          <div class="info-list">
            <div class="info-row">
              <span class="info-label">Name</span>
              <span class="info-value">{{ authService.user()?.name ?? 'John Doe' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email</span>
              <span class="info-value">{{ authService.user()?.email ?? 'john.doe@example.com' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Phone</span>
              <span class="info-value">{{ phone() }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Member Since</span>
              <span class="info-value">{{ memberSince() }}</span>
            </div>
          </div>
          <div class="card-footer">
            <app-button variant="outline" size="sm" [routerLink]="['/customer/profile/edit']">
              <span class="material-icons-outlined">edit</span>
              Edit Profile
            </app-button>
          </div>
        </app-card>

        <!-- Preferences -->
        <app-card title="Preferences">
          <div class="pref-list">
            <div class="pref-row">
              <div class="pref-info">
                <span class="material-icons-outlined pref-icon">notifications</span>
                <div>
                  <p class="pref-label">Email Notifications</p>
                  <p class="pref-desc">Receive booking confirmations and reminders</p>
                </div>
              </div>
              <span class="pref-status" [class.is-on]="true">On</span>
            </div>
            <div class="pref-row">
              <div class="pref-info">
                <span class="material-icons-outlined pref-icon">sms</span>
                <div>
                  <p class="pref-label">SMS Reminders</p>
                  <p class="pref-desc">Get text reminders before appointments</p>
                </div>
              </div>
              <span class="pref-status" [class.is-on]="true">On</span>
            </div>
            <div class="pref-row">
              <div class="pref-info">
                <span class="material-icons-outlined pref-icon">dark_mode</span>
                <div>
                  <p class="pref-label">Dark Mode</p>
                  <p class="pref-desc">Use dark theme across the app</p>
                </div>
              </div>
              <span class="pref-status" [class.is-on]="false">Off</span>
            </div>
          </div>
        </app-card>

        <!-- Account Actions -->
        <app-card title="Account">
          <div class="account-list">
            <button type="button" class="account-btn" [routerLink]="['/customer/profile/edit']">
              <span class="material-icons-outlined">person</span>
              <span>Edit Personal Info</span>
              <span class="material-icons-outlined chevron">chevron_right</span>
            </button>
            <button type="button" class="account-btn" [routerLink]="['/customer/appointments']">
              <span class="material-icons-outlined">event</span>
              <span>My Appointments</span>
              <span class="material-icons-outlined chevron">chevron_right</span>
            </button>
            <button type="button" class="account-btn" [routerLink]="['/customer/reviews']">
              <span class="material-icons-outlined">rate_review</span>
              <span>My Reviews</span>
              <span class="material-icons-outlined chevron">chevron_right</span>
            </button>
            <button type="button" class="account-btn danger" (click)="onLogout()">
              <span class="material-icons-outlined">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .profile-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-5);
    }

    @media (min-width: 768px) {
      .content-grid { grid-template-columns: 1fr 1fr; }
    }

    .info-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .info-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-3) 0;
      border-bottom: 1px solid var(--border);
    }

    :host-context(.dark) .info-row { border-color: var(--gray-700); }

    .info-row:last-child { border-bottom: none; }

    .info-label {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .info-value {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .card-footer {
      margin-top: var(--space-4);
      padding-top: var(--space-4);
      border-top: 1px solid var(--border);
    }

    :host-context(.dark) .card-footer { border-color: var(--gray-700); }

    /* Preferences */
    .pref-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .pref-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-3);
    }

    .pref-info {
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
      flex: 1;
    }

    .pref-icon {
      color: var(--primary-500);
      font-size: 1.25rem;
      margin-top: 2px;
    }

    .pref-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      margin: 0;
    }

    .pref-desc {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin: var(--space-1) 0 0;
    }

    .pref-status {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-full);
      background: var(--gray-100);
      color: var(--text-secondary);
    }

    .pref-status.is-on {
      background: var(--success-100);
      color: var(--success-600);
    }

    :host-context(.dark) .pref-status {
      background: var(--gray-700);
      color: var(--gray-300);
    }

    :host-context(.dark) .pref-status.is-on {
      background: rgba(34, 197, 94, 0.15);
      color: var(--success-400);
    }

    /* Account */
    .account-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .account-btn {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      width: 100%;
      padding: var(--space-3) var(--space-4);
      background: transparent;
      border: none;
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      cursor: pointer;
      text-align: left;
      transition: background var(--transition-fast);

      &:hover { background: var(--gray-50); }
    }

    :host-context(.dark) .account-btn:hover { background: var(--gray-700); }

    .account-btn .material-icons-outlined { font-size: 1.25rem; color: var(--text-secondary); }

    .account-btn .chevron {
      margin-left: auto;
      color: var(--gray-400);
      font-size: 1.125rem;
    }

    .account-btn.danger { color: var(--danger-600); }
    .account-btn.danger .material-icons-outlined { color: var(--danger-500); }
    .account-btn.danger:hover { background: var(--danger-50); }

    :host-context(.dark) .account-btn.danger { color: var(--danger-400); }
    :host-context(.dark) .account-btn.danger:hover { background: rgba(239, 68, 68, 0.1); }
  `],
})
export class CustomerProfileComponent {
  authService = inject(AuthService);

  totalAppointments = computed(() => MOCK_APPOINTMENTS.length);
  completedAppointments = computed(() => MOCK_APPOINTMENTS.filter(a => a.status === 'completed').length);
  totalReviews = computed(() => MOCK_REVIEWS.length);

  displayName(): string {
    const user = this.authService.user();
    return user ? user.name : 'John Doe';
  }

  phone(): string {
    return '+1 (555) 123-4567';
  }

  memberSince(): string {
    return 'January 2026';
  }

  onLogout(): void {
    this.authService.logout();
  }
}
