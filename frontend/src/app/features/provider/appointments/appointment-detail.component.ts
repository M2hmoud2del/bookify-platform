import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AppointmentTimelineComponent } from '../../customer/shared/appointment-timeline.component';
import { getProviderAppointmentById, TimelineEvent } from '../shared/provider.models';

@Component({
  selector: 'app-provider-appointment-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent,
    CardComponent,
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
          <a routerLink="/provider/appointments" class="back-link">
            <span class="material-icons-outlined">arrow_back</span>
            Back to Appointments
          </a>
          <h1 class="page-title">Appointment Details</h1>
        </div>

        <div class="content-grid">
          <div class="main-col">
            <!-- Customer Info -->
            <app-card title="Customer Information">
              <div class="customer-row">
                <app-avatar
                  [src]="appointment()!.customer.avatar ?? undefined"
                  [name]="appointment()!.customer.name"
                  size="lg"
                />
                <div class="customer-info">
                  <h3 class="customer-name">{{ appointment()!.customer.name }}</h3>
                  <div class="contact-list">
                    <div class="contact-item">
                      <span class="material-icons-outlined">email</span>
                      <span>{{ appointment()!.customer.email }}</span>
                    </div>
                    <div class="contact-item">
                      <span class="material-icons-outlined">phone</span>
                      <span>{{ appointment()!.customer.phone }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </app-card>

            <!-- Service & Schedule -->
            <app-card title="Service & Schedule">
              <div class="detail-rows">
                <div class="detail-row">
                  <span class="material-icons-outlined detail-icon">spa</span>
                  <div>
                    <p class="detail-label">Service</p>
                    <p class="detail-value">{{ appointment()!.service.title }}</p>
                  </div>
                </div>
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
                    <p class="detail-value">{{ formattedTime(appointment()!.startTime) }} - {{ formattedTime(appointment()!.endTime) }}</p>
                  </div>
                </div>
                <div class="detail-row">
                  <span class="material-icons-outlined detail-icon">timer</span>
                  <div>
                    <p class="detail-label">Duration</p>
                    <p class="detail-value">{{ appointment()!.service.durationMinutes }} minutes</p>
                  </div>
                </div>
              </div>
            </app-card>

            <!-- Timeline -->
            <app-card title="Appointment Timeline">
              <app-appointment-timeline [events]="timeline()" />
            </app-card>

            <!-- Notes -->
            @if (appointment()!.notes) {
              <app-card title="Customer Notes">
                <p class="notes-text">{{ appointment()!.notes }}</p>
              </app-card>
            }
          </div>

          <!-- Sidebar -->
          <aside class="sidebar">
            <app-card title="Status">
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
            </app-card>

            <app-card title="Payment">
              <div class="payment-rows">
                <div class="payment-row">
                  <span class="payment-label">Service Price</span>
                  <span class="payment-value">$ {{ appointment()!.service.price }}</span>
                </div>
                <div class="payment-row">
                  <span class="payment-label">Platform Fee</span>
                  <span class="payment-value">$ {{ platformFee() }}</span>
                </div>
                <div class="payment-divider"></div>
                <div class="payment-row payment-total">
                  <span class="payment-label">Net Earnings</span>
                  <span class="payment-value">$ {{ netEarnings() }}</span>
                </div>
              </div>
            </app-card>

            <div class="actions-card">
              @if (canConfirm()) {
                <app-button variant="primary" [fullWidth]="true" (onClick)="confirmAppointment()">
                  <span class="material-icons-outlined">check_circle</span>
                  Confirm Appointment
                </app-button>
              }
              @if (canMarkComplete()) {
                <app-button variant="primary" [fullWidth]="true" (onClick)="markComplete()">
                  <span class="material-icons-outlined">task_alt</span>
                  Mark as Completed
                </app-button>
              }
              @if (canCancel()) {
                <app-button variant="danger" [fullWidth]="true" (onClick)="showCancel.set(true)">
                  <span class="material-icons-outlined">cancel</span>
                  Cancel Appointment
                </app-button>
              }
              <app-button variant="outline" [fullWidth]="true" (onClick)="contactCustomer()">
                <span class="material-icons-outlined">message</span>
                Contact Customer
              </app-button>
            </div>
          </aside>
        </div>
      } @else {
        <app-empty-state
          icon="event_busy"
          title="Appointment not found"
          description="This appointment doesn't exist or has been removed."
          actionLabel="View Appointments"
          (action)="router.navigate(['/provider/appointments'])"
        />
      }
    </div>

    <app-confirm-dialog
      [isOpen]="showCancel()"
      title="Cancel Appointment"
      message="Are you sure you want to cancel this appointment? The customer will be notified and a refund will be processed."
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
    }

    .back-link:hover { color: var(--primary-500); }

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

    .customer-row {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    .customer-name {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-3);
    }

    .contact-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .contact-item .material-icons-outlined { font-size: 1rem; color: var(--primary-500); }

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

    .sidebar {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
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
      color: var(--success-600);
    }

    :host-context(.dark) .payment-total .payment-label,
    :host-context(.dark) .payment-total .payment-value { color: var(--success-400); }

    .actions-card {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
  `],
})
export class ProviderAppointmentDetailComponent {
  private route = inject(ActivatedRoute);
  router = inject(Router);

  showCancel = signal(false);

  appointment = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? getProviderAppointmentById(id) : undefined;
  });

  timeline = computed<TimelineEvent[]>(() => {
    const apt = this.appointment();
    if (!apt) return [];
    return [
      {
        status: 'created',
        label: 'Booking Created',
        description: `Customer booked on ${new Date(apt.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
        date: apt.createdAt,
        time: new Date(apt.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        icon: 'receipt_long',
        completed: true,
      },
      {
        status: 'confirmed',
        label: 'Confirmed',
        description: 'You confirmed this appointment',
        date: apt.createdAt,
        time: '',
        icon: 'verified',
        completed: ['confirmed', 'completed'].includes(apt.status),
      },
      {
        status: 'paid',
        label: 'Payment Received',
        description: `${apt.service.price} payment processed`,
        date: apt.date,
        time: '',
        icon: 'payments',
        completed: apt.paymentStatus === 'paid',
      },
      {
        status: 'completed',
        label: 'Service Completed',
        description: 'Appointment was completed successfully',
        date: apt.date,
        time: apt.startTime,
        icon: 'task_alt',
        completed: apt.status === 'completed',
      },
    ];
  });

  platformFee = computed(() => (this.appointment()!.service.price * 0.05).toFixed(2));
  netEarnings = computed(() => (this.appointment()!.service.price - this.appointment()!.service.price * 0.05).toFixed(2));

  canConfirm(): boolean {
    return this.appointment()?.status === 'pending_payment';
  }

  canMarkComplete(): boolean {
    return this.appointment()?.status === 'confirmed';
  }

  canCancel(): boolean {
    const s = this.appointment()?.status;
    return s === 'confirmed' || s === 'pending_payment';
  }

  formattedDate(): string {
    const d = this.appointment()?.localDate;
    return d ? new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '';
  }

  formattedTime(t: string): string {
    const [h, m] = t.split(':');
    const hour = parseInt(h, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${m} ${period}`;
  }

  confirmAppointment(): void {
    this.router.navigate(['/provider/appointments']);
  }

  markComplete(): void {
    this.router.navigate(['/provider/appointments']);
  }

  contactCustomer(): void {
    this.router.navigate(['/provider/appointments']);
  }

  confirmCancel(): void {
    this.showCancel.set(false);
    this.router.navigate(['/provider/appointments']);
  }
}
