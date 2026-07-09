import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-provider-notifications',
  standalone: true,
  imports: [CommonModule, CardComponent, EmptyStateComponent],
  template: `
    <div class="notifications-page">
      <div class="page-header">
        <h1 class="page-title">Notifications</h1>
        <p class="page-subtitle">Manage your alerts and updates</p>
      </div>
      <app-card>
        <div class="notifications-list">
          <div class="notification-item unread">
            <span class="notification-icon booking">
              <span class="material-icons-outlined">event</span>
            </span>
            <div class="notification-content">
              <h3 class="notification-title">New Booking</h3>
              <p class="notification-message">Emma Wilson booked a Haircut & Styling for July 2, 2026.</p>
              <p class="notification-time">1 hour ago</p>
            </div>
          </div>
          <div class="notification-item">
            <span class="notification-icon review">
              <span class="material-icons-outlined">star</span>
            </span>
            <div class="notification-content">
              <h3 class="notification-title">New Review</h3>
              <p class="notification-message">Emma Wilson left a 5-star review!</p>
              <p class="notification-time">3 hours ago</p>
            </div>
          </div>
        </div>
      </app-card>
    </div>
  `,
  styles: [`
    .notifications-page { display: flex; flex-direction: column; gap: var(--space-6); }
    .page-header { margin-bottom: var(--space-2); }
    .page-title { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); color: var(--text-primary); margin: 0; }
    .page-subtitle { font-size: var(--font-size-sm); color: var(--text-secondary); margin: var(--space-1) 0 0; }
    .notifications-list { display: flex; flex-direction: column; }
    .notification-item { display: flex; gap: var(--space-3); padding: var(--space-4); border-bottom: 1px solid var(--border); }
    .notification-item.unread { background: var(--primary-50); }
    :host-context(.dark) .notification-item.unread { background: rgba(79, 70, 229, 0.1); }
    .notification-icon { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: var(--radius-full); }
    .notification-icon.booking { background: var(--primary-100); color: var(--primary-600); }
    :host-context(.dark) .notification-icon.booking { background: rgba(79, 70, 229, 0.2); }
    .notification-icon.review { background: var(--warning-100); color: var(--warning-600); }
    :host-context(.dark) .notification-icon.review { background: rgba(245, 158, 11, 0.2); }
    .notification-content { flex: 1; }
    .notification-title { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--text-primary); margin: 0; }
    .notification-message { font-size: var(--font-size-sm); color: var(--text-secondary); margin: var(--space-1) 0 0; }
    .notification-time { font-size: var(--font-size-xs); color: var(--text-tertiary); margin: var(--space-2) 0 0; }
  `],
})
export class ProviderNotificationsComponent {}
