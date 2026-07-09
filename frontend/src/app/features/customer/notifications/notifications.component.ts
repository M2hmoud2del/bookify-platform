import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-customer-notifications',
  standalone: true,
  imports: [CommonModule, CardComponent, EmptyStateComponent],
  template: `
    <div class="notifications-page">
      <div class="page-header">
        <h1 class="page-title">Notifications</h1>
        <p class="page-subtitle">Stay updated with your appointments</p>
      </div>
      <app-card>
        <div class="notifications-list">
          <div class="notification-item unread">
            <span class="notification-icon confirmed">
              <span class="material-icons-outlined">event</span>
            </span>
            <div class="notification-content">
              <h3 class="notification-title">Appointment Confirmed</h3>
              <p class="notification-message">Your appointment with Blossom Beauty Salon has been confirmed for July 2, 2026 at 10:00 AM.</p>
              <p class="notification-time">2 hours ago</p>
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
    .notification-icon.confirmed { background: var(--success-100); color: var(--success-600); }
    :host-context(.dark) .notification-icon.confirmed { background: rgba(34, 197, 94, 0.2); }
    .notification-content { flex: 1; }
    .notification-title { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); color: var(--text-primary); margin: 0; }
    .notification-message { font-size: var(--font-size-sm); color: var(--text-secondary); margin: var(--space-1) 0 0; }
    .notification-time { font-size: var(--font-size-xs); color: var(--text-tertiary); margin: var(--space-2) 0 0; }
  `],
})
export class CustomerNotificationsComponent {}
