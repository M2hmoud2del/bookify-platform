import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineEvent } from '../shared/customer.models';

@Component({
  selector: 'app-appointment-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="timeline">
      @for (event of events(); track $index; let last = $last) {
        <div class="timeline-item" [class.is-completed]="event.completed" [class.is-last]="last">
          <div class="timeline-marker">
            <span class="marker-icon" [class.is-done]="event.completed">
              <span class="material-icons-outlined">{{ event.icon }}</span>
            </span>
            @if (!last) {
              <span class="timeline-line" [class.is-done]="event.completed"></span>
            }
          </div>

          <div class="timeline-content">
            <div class="content-header">
              <h3 class="event-label">{{ event.label }}</h3>
              @if (event.completed) {
                <span class="event-badge">
                  <span class="material-icons-outlined">check</span>
                </span>
              }
            </div>
            <p class="event-description">{{ event.description }}</p>
            <div class="event-meta">
              <span class="meta-item">
                <span class="material-icons-outlined">event</span>
                {{ event.date | date: 'MMM d, y' }}
              </span>
              <span class="meta-item">
                <span class="material-icons-outlined">schedule</span>
                {{ event.time }}
              </span>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .timeline {
      display: flex;
      flex-direction: column;
    }

    .timeline-item {
      display: flex;
      gap: var(--space-4);
      min-height: 80px;
    }

    .timeline-marker {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
    }

    .marker-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full);
      background: var(--gray-100);
      color: var(--gray-400);
      border: 2px solid var(--border);
      transition: all var(--transition-normal);
      z-index: 1;
    }

    :host-context(.dark) .marker-icon {
      background: var(--gray-700);
      color: var(--gray-500);
      border-color: var(--gray-600);
    }

    .marker-icon.is-done {
      background: var(--primary-500);
      color: #fff;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 4px var(--primary-100);
    }

    :host-context(.dark) .marker-icon.is-done {
      box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.2);
    }

    .marker-icon .material-icons-outlined { font-size: 1.25rem; }

    .timeline-line {
      flex: 1;
      width: 2px;
      min-height: 40px;
      background: var(--border);
      margin-top: var(--space-1);
      transition: background var(--transition-normal);
    }

    :host-context(.dark) .timeline-line { background: var(--gray-700); }

    .timeline-line.is-done { background: var(--primary-500); }

    .timeline-content {
      flex: 1;
      padding-bottom: var(--space-6);
    }

    .content-header {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-bottom: var(--space-1);
    }

    .event-label {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .event-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      background: var(--success-500);
      color: #fff;
      border-radius: var(--radius-full);
    }

    .event-badge .material-icons-outlined { font-size: 0.75rem; }

    .event-description {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0 0 var(--space-2);
      line-height: 1.5;
    }

    .event-meta {
      display: flex;
      gap: var(--space-4);
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
    }

    .meta-item .material-icons-outlined { font-size: 0.875rem; }
  `],
})
export class AppointmentTimelineComponent {
  events = input.required<TimelineEvent[]>();
}
