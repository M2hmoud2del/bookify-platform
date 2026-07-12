import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSlot } from '../shared/customer.models';

@Component({
  selector: 'app-time-slot-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="slot-selector">
      <div class="slot-header">
        <h3 class="slot-title">Available Times</h3>
        <span class="slot-hint">
          <span class="material-icons-outlined">info</span>
          Times in your local timezone
        </span>
      </div>

      @if (slots().length > 0) {
        <div class="slot-grid">
          @for (slot of slots(); track slot.time) {
            <button
              type="button"
              class="slot-btn"
              [class.is-selected]="selectedTime() === slot.time"
              [class.is-unavailable]="!slot.available"
              [disabled]="!slot.available"
              (click)="onSelect(slot)"
            >
              <span class="slot-label">{{ slot.label }}</span>
              @if (!slot.available) {
                <span class="slot-status">Booked</span>
              }
            </button>
          }
        </div>
      } @else {
        <div class="no-slots">
          <span class="material-icons-outlined">event_busy</span>
          <p>No available time slots for this date. Please select another day.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .slot-selector {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .slot-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    .slot-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .slot-hint {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .slot-hint .material-icons-outlined { font-size: 0.875rem; }

    .slot-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-2);
    }

    @media (min-width: 480px) {
      .slot-grid { grid-template-columns: repeat(3, 1fr); }
    }

    @media (min-width: 768px) {
      .slot-grid { grid-template-columns: repeat(4, 1fr); }
    }

    .slot-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: var(--space-3) var(--space-2);
      background: var(--surface);
      border: 2px solid var(--border);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover:not(:disabled) {
        border-color: var(--primary-300);
        background: var(--primary-50);
      }

      &.is-selected {
        background: var(--primary-500);
        border-color: var(--primary-500);
        color: #fff;
        box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
      }

      &.is-unavailable {
        opacity: 0.5;
        cursor: not-allowed;
        background: var(--gray-50);
      }
    }

    :host-context(.dark) .slot-btn {
      background: var(--gray-800);
      border-color: var(--gray-700);

      &:hover:not(:disabled) {
        background: rgba(79, 70, 229, 0.1);
        border-color: var(--primary-500);
      }

      &.is-unavailable { background: var(--gray-900); }
    }

    .slot-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
    }

    .slot-status {
      font-size: 10px;
      color: var(--text-tertiary);
    }

    .no-slots {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-8);
      text-align: center;
      color: var(--text-secondary);
    }

    .no-slots .material-icons-outlined {
      font-size: 2.5rem;
      color: var(--gray-300);
    }

    :host-context(.dark) .no-slots .material-icons-outlined { color: var(--gray-600); }
  `],
})
export class TimeSlotSelectorComponent {
  slots = input.required<TimeSlot[]>();
  selectedTime = input<string | null>(null);

  timeChange = output<string>();

  onSelect(slot: TimeSlot): void {
    if (!slot.available) return;
    this.timeChange.emit(slot.time);
  }
}
