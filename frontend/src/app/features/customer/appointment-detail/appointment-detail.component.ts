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
  templateUrl: './appointment-detail.component.html',
  styleUrl: './appointment-detail.component.css',
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
