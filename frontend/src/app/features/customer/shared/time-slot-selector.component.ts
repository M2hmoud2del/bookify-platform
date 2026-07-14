import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSlot } from '../shared/customer.models';

@Component({
  selector: 'app-time-slot-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './time-slot-selector.component.html',
  styleUrl: './time-slot-selector.component.css',
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
