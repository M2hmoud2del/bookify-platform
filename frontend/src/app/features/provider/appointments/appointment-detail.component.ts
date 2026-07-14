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
  templateUrl: './appointment-detail.component.html',
  styleUrl: './appointment-detail.component.css',
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
