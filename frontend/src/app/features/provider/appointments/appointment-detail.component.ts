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
import { TimelineEvent } from '../shared/provider.models';
import { AppointmentView } from '../../../core/models/appointment.model';
import { AppointmentsApi } from '../../customer/appointments/appointments.api';

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
  templateUrl: './appointment-detail.component.html',
  styleUrl: './appointment-detail.component.css',
})
export class ProviderAppointmentDetailComponent {
  private route = inject(ActivatedRoute);
  private appointmentsApi = inject(AppointmentsApi);
  router = inject(Router);

  showCancel = signal(false);
  appointment = signal<AppointmentView | null>(null);
  loading = signal(false);
  actionLoading = signal(false);
  error = signal<string | null>(null);

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
        description: 'Stripe webhook confirms paid appointments',
        date: apt.updatedAt,
        time: '',
        icon: 'verified',
        completed: ['confirmed', 'completed'].includes(apt.status),
      },
      {
        status: 'paid',
        label: 'Payment Received',
        description: `${apt.service.price} payment processed`,
        date: apt.updatedAt,
        time: '',
        icon: 'payments',
        completed: apt.paymentStatus === 'paid',
      },
      {
        status: 'completed',
        label: 'Service Completed',
        description: 'Appointment was completed successfully',
        date: apt.completedAt || apt.updatedAt,
        time: apt.endTime,
        icon: 'task_alt',
        completed: apt.status === 'completed',
      },
    ];
  });

  platformFee = computed(() => ((this.appointment()?.service.price ?? 0) * 0.05).toFixed(2));
  netEarnings = computed(() => {
    const price = this.appointment()?.service.price ?? 0;
    return (price - price * 0.05).toFixed(2);
  });

  constructor() {
    void this.loadAppointment();
  }

  async loadAppointment(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      this.appointment.set(await this.appointmentsApi.getAppointmentById(id));
    } catch (err) {
      this.error.set(this.errorMessage(err, 'Unable to load appointment.'));
    } finally {
      this.loading.set(false);
    }
  }

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

  async confirmAppointment(): Promise<void> {
    const appointment = this.appointment();
    if (!appointment) return;
    await this.runAction(() => this.appointmentsApi.acceptAppointment(appointment._id));
  }

  async markComplete(): Promise<void> {
    const appointment = this.appointment();
    if (!appointment) return;
    await this.runAction(() => this.appointmentsApi.completeAppointment(appointment._id));
  }

  contactCustomer(): void {
    this.router.navigate(['/provider/appointments']);
  }

  async confirmCancel(): Promise<void> {
    const appointment = this.appointment();
    if (!appointment) return;

    if (appointment.status === 'pending_payment') {
      await this.runAction(() => this.appointmentsApi.rejectAppointment(appointment._id));
    } else {
      await this.runAction(() => this.appointmentsApi.cancelAppointment(appointment._id));
    }
    this.showCancel.set(false);
  }

  private async runAction(action: () => Promise<AppointmentView>): Promise<void> {
    this.actionLoading.set(true);
    this.error.set(null);

    try {
      this.appointment.set(await action());
    } catch (err) {
      this.error.set(this.errorMessage(err, 'Unable to update appointment.'));
    } finally {
      this.actionLoading.set(false);
    }
  }

  private errorMessage(err: unknown, fallback: string): string {
    const message = (err as { message?: string })?.message;
    return message || (err instanceof Error ? err.message : fallback);
  }
}
