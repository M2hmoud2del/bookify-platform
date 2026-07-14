import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { AppointmentView } from '../../../core/models/appointment.model';

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [CommonModule, RouterLink, AvatarComponent, StatusBadgeComponent, ButtonComponent],
  templateUrl: './appointment-card.component.html',
  styleUrl: './appointment-card.component.css',
})
export class AppointmentCardComponent {
  appointment = input.required<AppointmentView>();
  cancel = output<string>();
  reschedule = output<string>();

  dayNumber(): string {
    return new Date(this.appointment().localDate).getDate().toString().padStart(2, '0');
  }

  monthName(): string {
    return new Date(this.appointment().localDate).toLocaleDateString('en-US', { month: 'short' });
  }

  formattedTime(): string {
    const [h, m] = this.appointment().startTime.split(':');
    const hour = parseInt(h, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${m} ${period}`;
  }
}
