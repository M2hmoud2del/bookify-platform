import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { AppointmentView } from '../../../core/models/appointment.model';

@Component({
  selector: 'app-appointment-table',
  standalone: true,
  imports: [CommonModule, RouterLink, AvatarComponent, StatusBadgeComponent],
  templateUrl: './appointment-table.component.html',
  styleUrl: './appointment-table.component.css',
})
export class AppointmentTableComponent {
  appointments = input.required<AppointmentView[]>();
  confirm = output<string>();
  cancel = output<string>();

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  formatTime(timeStr: string): string {
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${m} ${period}`;
  }

  canConfirm(status: string): boolean {
    return status === 'pending_payment';
  }

  canCancel(status: string): boolean {
    return status === 'confirmed' || status === 'pending_payment';
  }

  cancelTitle(status: string): string {
    return status === 'pending_payment' ? 'Reject' : 'Cancel';
  }
}
