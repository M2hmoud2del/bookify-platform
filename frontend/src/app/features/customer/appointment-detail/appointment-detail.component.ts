import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AppointmentTimelineComponent } from '../shared/appointment-timeline.component';
import { getAppointmentById, getTimelineForAppointment } from '../shared/customer.models';

@Component({
  selector: 'app-appointment-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent,
    AvatarComponent,
    StatusBadgeComponent,
    EmptyStateComponent,
    ConfirmDialogComponent,
    AppointmentTimelineComponent,
  ],
  template: `
    <div class="detail-page">
      @if (appointment()) {
        <div class="page-header">
          <a routerLink="/customer/appointments" class="back-link">
            <span class="material-icons-outlined">arrow_back</span>
            Back to Appointments
          </a>
          <h1 class="page-title">Appointment Details</h1>
        </div>

        <div class="content-grid">
          <!-- Main -->
          <div class="main-col">
            <!-- Provider & Service -->
            <div class="info-card">
              <h2 class="card-title">Service</h2>
              <div class="provider-row">
                <app-avatar
                  [src]="appointment()!.provider.avatar ?? undefined"
                  [name]="appointment()!.provider.name"
                  size="lg"
                />
                <div class="provider-info">
                  <h3 class="service-name">{{ appointment()!.service.title }}</h3>
                  <p class="provider-name">{{ appointment()!.provider.name }}</p>
                  <p class="provider-type">{{ appointment()!.service.category }}</p>
                </div>
              </div>
            </div>

            <!-- Date, Time & Location -->
            <div class="info-card">
              <h2 class="card-title">Date & Location</h2>
              <div class="detail-rows">
                <div class="detail-row">
                  <span class="material-icons-outlined detail-icon">event</span>
                  <div>
                    <p class="detail-label">Date</p>
                    <p class="detail-value">{{ formattedDate() }}</p>
                  </div>
                </div>
                <div class="detail-row">
                  <span class="material-icons-outlined detail-icon">schedule</span>
                  <div>
                    <p class="detail-label">Time</p>
                    <p class="detail-value">{{ formattedTime() }} - {{ formattedEndTime() }} ({{ appointment()!.service.durationMinutes }} min)</p>
                  </div>
                </div>
                <div class="detail-row">
                  <span class="material-icons-outlined detail-icon">location_on</span>
                  <div>
                    <p class="detail-label">Location</p>
                    <p class="detail-value">{{ appointment()!.service.category }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Timeline -->
            <div class="info-card">
              <h2 class="card-title">Appointment Timeline</h2>
              <app-appointment-timeline [events]="timeline()" />
            </div>

            <!-- Notes -->
            @if (appointment()!.notes) {
              <div class="info-card">
                <h2 class="card-title">Provider Notes</h2>
                <p class="notes-text">{{ appointment()!.notes }}</p>
              </div>
            }
          </div>

          <!-- Sidebar -->
          <aside class="sidebar">
            <!-- Status -->
            <div class="status-card">
              <h3 class="card-title">Status</h3>
              <div class="status-list">
                <div class="status-row">
                  <span class="status-label">Appointment</span>
                  <app-status-badge [status]="appointment()!.status" />
                </div>
                <div class="status-row">
                  <span class="status-label">Payment</span>
                  <app-status-badge [status]="appointment()!.paymentStatus" />
                </div>
              </div>
            </div>

            <!-- Payment -->
            <div class="payment-card">
              <h3 class="card-title">Payment</h3>
              <div class="payment-rows">
                <div class="payment-row">
                  <span class="payment-label">Service Price</span>
                  <span class="payment-value">$ {{ appointment()!.service.price }}</span>
                </div>
                <div class="payment-row">
                  <span class="payment-label">Booking Fee</span>
                  <span class="payment-value">Free</span>
                </div>
                <div class="payment-divider"></div>
                <div class="payment-row payment-total">
                  <span class="payment-label">Total</span>
                  <span class="payment-value">$ {{ appointment()!.service.price }}</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="actions-card">
              @if (canReschedule()) {
                <app-button variant="outline" [fullWidth]="true" (onClick)="showReschedule.set(true)">
                  <span class="material-icons-outlined">edit_calendar</span>
                  Reschedule
                </app-button>
              }
              @if (canReview()) {
                <app-button variant="primary" [fullWidth]="true" [routerLink]="['/customer/reviews']">
                  <span class="material-icons-outlined">rate_review</span>
                  Write Review
                </app-button>
              }
              @if (canCancel()) {
                <app-button variant="danger" [fullWidth]="true" (onClick)="showCancel.set(true)">
                  <span class="material-icons-outlined">cancel</span>
                  Cancel Appointment
                </app-button>
              }
            </div>
          </aside>
        </div>
      } @else {
        <app-empty-state
          icon="event_busy"
          title="Appointment not found"
          description="This appointment doesn't exist or has been removed."
          actionLabel="View Appointments"
          (action)="router.navigate(['/customer/appointments'])"
        />
      }
    </div>

    <!-- Cancel Dialog -->
    <app-confirm-dialog
      [isOpen]="showCancel()"
      title="Cancel Appointment"
      message="Are you sure you want to cancel this appointment? This action cannot be undone."
      icon="warning"
      confirmText="Yes, Cancel"
      confirmVariant="danger"
      (confirm)="confirmCancel()"
      (cancel)="showCancel.set(false)"
    />
  `,
  styles: [`
    :host { display: block; }

    .detail-page {
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

    .content-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-5);
    }

    @media (min-width: 1024px) {
      .content-grid { grid-template-columns: 1fr 320px; align-items: start; }
    }

    .main-col {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .info-card {
      padding: var(--space-5);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
    }

    :host-context(.dark) .info-card {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .card-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 var(--space-4);
    }

    .provider-row {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    .service-name {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .provider-name {
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      margin: var(--space-1) 0 0;
    }

    .provider-type {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin: var(--space-1) 0 0;
    }

    .detail-rows {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .detail-row {
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
    }

    .detail-icon {
      color: var(--primary-500);
      font-size: 1.25rem;
      margin-top: 2px;
    }

    .detail-label {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin: 0;
    }

    .detail-value {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      margin: var(--space-1) 0 0;
    }

    .notes-text {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
      padding: var(--space-3) var(--space-4);
      background: var(--gray-50);
      border-radius: var(--radius-lg);
      border-left: 3px solid var(--primary-500);
    }

    :host-context(.dark) .notes-text { background: var(--gray-900); }

    /* Sidebar */
    .sidebar {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .status-card, .payment-card, .actions-card {
      padding: var(--space-5);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
    }

    :host-context(.dark) .status-card,
    :host-context(.dark) .payment-card,
    :host-context(.dark) .actions-card {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .status-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .status-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .status-label {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .payment-rows {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .payment-row {
      display: flex;
      justify-content: space-between;
    }

    .payment-label {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .payment-value {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .payment-divider {
      height: 1px;
      background: var(--border);
      margin: var(--space-2) 0;
    }

    :host-context(.dark) .payment-divider { background: var(--gray-700); }

    .payment-total .payment-label, .payment-total .payment-value {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-bold);
      color: var(--primary-600);
    }

    :host-context(.dark) .payment-total .payment-label,
    :host-context(.dark) .payment-total .payment-value { color: var(--primary-400); }

    .actions-card {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
  `],
})
export class AppointmentDetailComponent {
  private route = inject(ActivatedRoute);
  router = inject(Router);

  showCancel = signal(false);
  showReschedule = signal(false);

  appointment = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? getAppointmentById(id) : undefined;
  });

  timeline = computed(() => {
    const apt = this.appointment();
    return apt ? getTimelineForAppointment(apt) : [];
  });

  canReschedule(): boolean {
    const s = this.appointment()?.status;
    return s === 'confirmed' || s === 'pending_payment';
  }

  canCancel(): boolean {
    const s = this.appointment()?.status;
    return s === 'confirmed' || s === 'pending_payment';
  }

  canReview(): boolean {
    return this.appointment()?.status === 'completed';
  }

  formattedDate(): string {
    const d = this.appointment()?.localDate;
    return d ? new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '';
  }

  formattedTime(): string {
    return this.formatTime(this.appointment()?.startTime ?? '');
  }

  formattedEndTime(): string {
    return this.formatTime(this.appointment()?.endTime ?? '');
  }

  private formatTime(t: string): string {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hour = parseInt(h, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${m} ${period}`;
  }

  confirmCancel(): void {
    this.showCancel.set(false);
    this.router.navigate(['/customer/appointments']);
  }
}
