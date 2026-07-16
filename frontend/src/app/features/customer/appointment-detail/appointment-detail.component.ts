import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AppointmentTimelineComponent } from '../shared/appointment-timeline.component';
import { getTimelineForAppointment } from '../shared/customer.models';
import { AppointmentView } from '../../../core/models/appointment.model';
import { AppointmentsApi } from '../appointments/appointments.api';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ReviewFormComponent } from '../shared/review-form.component';
import { ReviewsApi } from '../reviews/reviews.api';

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
    ModalComponent,
    ReviewFormComponent,
  ],
  templateUrl: './appointment-detail.component.html',
  styleUrl: './appointment-detail.component.css',
})
export class AppointmentDetailComponent {
  private route = inject(ActivatedRoute);
  private appointmentsApi = inject(AppointmentsApi);
  private reviewsApi = inject(ReviewsApi);
  router = inject(Router);

  showCancel = signal(false);
  showReschedule = signal(false);
  showReviewModal = signal(false);
  appointment = signal<AppointmentView | null>(null);
  loading = signal(false);
  cancelling = signal(false);
  submittingReview = signal(false);
  error = signal<string | null>(null);

  timeline = computed(() => {
    const apt = this.appointment();
    return apt ? getTimelineForAppointment(apt) : [];
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

  canReschedule(): boolean {
    const s = this.appointment()?.status;
    return s === 'confirmed' || s === 'pending_payment';
  }

  canCancel(): boolean {
    const s = this.appointment()?.status;
    return s === 'confirmed' || s === 'pending_payment';
  }

  canReview(): boolean {
    const s = this.appointment()?.status;
    return s === 'completed' || s === 'confirmed';
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

  async confirmCancel(): Promise<void> {
    const appointment = this.appointment();

    if (!appointment) {
      return;
    }

    this.cancelling.set(true);
    this.error.set(null);

    try {
      this.appointment.set(await this.appointmentsApi.cancelAppointment(appointment._id));
      this.showCancel.set(false);
    } catch (err) {
      this.error.set(this.errorMessage(err, 'Unable to cancel appointment.'));
    } finally {
      this.cancelling.set(false);
    }
  }

  private errorMessage(err: unknown, fallback: string): string {
    const message = (err as { message?: string })?.message;
    return message || (err instanceof Error ? err.message : fallback);
  }

  async submitReview(data: { rating: number; comment: string }): Promise<void> {
    const apt = this.appointment();
    if (!apt) return;

    this.submittingReview.set(true);
    this.error.set(null);

    try {
      await this.reviewsApi.createReview({
        appointmentId: apt._id,
        rating: data.rating,
        comment: data.comment,
      });
      this.showReviewModal.set(false);
      // reload appointment to update timeline/status if needed, or redirect
      await this.loadAppointment();
    } catch (err) {
      this.error.set(this.errorMessage(err, 'Unable to submit review.'));
    } finally {
      this.submittingReview.set(false);
    }
  }
}
