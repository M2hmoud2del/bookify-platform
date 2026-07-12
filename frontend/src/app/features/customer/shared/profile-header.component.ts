import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [CommonModule, RouterLink, AvatarComponent, ButtonComponent],
  template: `
    <div class="profile-header">
      <div class="header-cover"></div>

      <div class="header-content">
        <div class="header-main">
          <app-avatar
            class="header-avatar"
            [src]="avatarUrl() ?? undefined"
            [name]="displayName()"
            size="xl"
          />

          <div class="header-info">
            <h1 class="display-name">{{ displayName() }}</h1>
            <p class="user-email">{{ email() }}</p>

            <div class="header-stats">
              <div class="stat">
                <span class="stat-value">{{ totalAppointments() }}</span>
                <span class="stat-label">Appointments</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat">
                <span class="stat-value">{{ completedAppointments() }}</span>
                <span class="stat-label">Completed</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat">
                <span class="stat-value">{{ totalReviews() }}</span>
                <span class="stat-label">Reviews</span>
              </div>
            </div>
          </div>
        </div>

        <div class="header-actions">
          @if (showEditButton()) {
            <app-button variant="primary" [routerLink]="editLink()">
              <span class="material-icons-outlined">edit</span>
              Edit Profile
            </app-button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .profile-header {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-2xl);
      overflow: hidden;
    }

    :host-context(.dark) .profile-header {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .header-cover {
      height: 120px;
      background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
    }

    .header-content {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      padding: 0 var(--space-6) var(--space-6);
    }

    @media (min-width: 768px) {
      .header-content {
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-between;
      }
    }

    .header-main {
      display: flex;
      gap: var(--space-4);
      align-items: flex-end;
      margin-top: calc(-1 * var(--space-12));
    }

    .header-avatar {
      flex-shrink: 0;
      border: 4px solid var(--surface);
      border-radius: var(--radius-full);
    }

    :host-context(.dark) .header-avatar {
      border-color: var(--gray-800);
    }

    .header-info {
      flex: 1;
      padding-bottom: var(--space-2);
      min-width: 0;
    }

    .display-name {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--space-1);
    }

    .user-email {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0 0 var(--space-3);
    }

    .header-stats {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    .stat {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      line-height: 1;
    }

    .stat-label {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin-top: 2px;
    }

    .stat-divider {
      width: 1px;
      height: 28px;
      background: var(--border);
    }

    :host-context(.dark) .stat-divider { background: var(--gray-700); }

    .header-actions {
      flex-shrink: 0;
      padding-bottom: var(--space-2);
    }
  `],
})
export class ProfileHeaderComponent {
  displayName = input('User');
  email = input('');
  avatarUrl = input<string | null>(null);
  totalAppointments = input(0);
  completedAppointments = input(0);
  totalReviews = input(0);
  showEditButton = input(true);
  editLink = input<string[]>(['/customer/profile/edit']);
}
