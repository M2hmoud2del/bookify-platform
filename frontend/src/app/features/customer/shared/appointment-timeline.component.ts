import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineEvent } from '../shared/customer.models';

@Component({
  selector: 'app-appointment-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-timeline.component.html',
  styleUrl: './appointment-timeline.component.css',
})
export class AppointmentTimelineComponent {
  events = input.required<TimelineEvent[]>();
}
