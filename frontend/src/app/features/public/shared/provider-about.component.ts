import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicProvider } from '../shared/public.models';

@Component({
  selector: 'app-provider-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="about-section">
      <h2 class="section-title">About {{ provider().profile.businessName }}</h2>

      <p class="about-text">{{ provider().profile.bio }}</p>

      <div class="info-grid">
        <div class="info-card">
          <span class="info-icon"><span class="material-icons-outlined">location_on</span></span>
          <div class="info-content">
            <p class="info-label">Address</p>
            <p class="info-value">{{ provider().profile.address }}</p>
          </div>
        </div>

        <div class="info-card">
          <span class="info-icon"><span class="material-icons-outlined">phone</span></span>
          <div class="info-content">
            <p class="info-label">Phone</p>
            <p class="info-value">{{ provider().user.phone }}</p>
          </div>
        </div>

        <div class="info-card">
          <span class="info-icon"><span class="material-icons-outlined">email</span></span>
          <div class="info-content">
            <p class="info-label">Email</p>
            <p class="info-value">{{ provider().user.email }}</p>
          </div>
        </div>
      </div>

      <div class="hours-section">
        <h3 class="hours-title">
          <span class="material-icons-outlined">schedule</span>
          Working Hours
        </h3>
        <div class="hours-grid">
          <div class="hours-days">
            @for (day of allDays; track day) {
              <div class="day-row">
                <span class="day-name">{{ day }}</span>
                <span class="day-hours">By appointment</span>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .about-section {
      display: flex;
      flex-direction: column;
      gap: var(--space-6);
    }

    .section-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0;
    }

    .about-text {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      line-height: 1.7;
      margin: 0;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-3);
    }

    @media (min-width: 640px) {
      .info-grid { grid-template-columns: 1fr 1fr; }
    }

    .info-card {
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
      padding: var(--space-4);
      background: var(--gray-50);
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
    }

    :host-context(.dark) .info-card {
      background: var(--gray-900);
      border-color: var(--gray-700);
    }

    .info-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: var(--primary-100);
      border-radius: var(--radius-lg);
      color: var(--primary-600);
      flex-shrink: 0;
    }

    :host-context(.dark) .info-icon {
      background: rgba(79, 70, 229, 0.15);
      color: var(--primary-400);
    }

    .info-icon .material-icons-outlined { font-size: 1.125rem; }

    .info-content { flex: 1; min-width: 0; }

    .info-label {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin: 0 0 var(--space-1);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: var(--font-weight-semibold);
    }

    .info-value {
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      margin: 0;
      word-break: break-word;
    }

    .info-link {
      font-size: var(--font-size-sm);
      color: var(--primary-600);
      text-decoration: none;
      word-break: break-all;

      &:hover { text-decoration: underline; }
    }

    :host-context(.dark) .info-link { color: var(--primary-400); }

    .hours-section {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .hours-title {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .hours-title .material-icons-outlined { font-size: 1.25rem; color: var(--primary-500); }

    .hours-grid {
      background: var(--gray-50);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: var(--space-4);
    }

    :host-context(.dark) .hours-grid {
      background: var(--gray-900);
      border-color: var(--gray-700);
    }

    .hours-days {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-1);
    }

    @media (min-width: 480px) {
      .hours-days { grid-template-columns: 1fr 1fr; }
    }

    .day-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-md);
      transition: background var(--transition-fast);

      &:hover { background: var(--surface); }
    }

    :host-context(.dark) .day-row:hover { background: var(--gray-800); }

    .day-row.is-working .day-hours { color: var(--success-600); font-weight: var(--font-weight-medium); }
    :host-context(.dark) .day-row.is-working .day-hours { color: var(--success-400); }

    .day-name {
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      font-weight: var(--font-weight-medium);
    }

    .day-hours {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }
  `],
})
export class ProviderAboutComponent {
  provider = input.required<PublicProvider>();

  allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
}
