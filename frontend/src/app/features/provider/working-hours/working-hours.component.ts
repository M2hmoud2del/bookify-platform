import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-working-hours',
  standalone: true,
  imports: [CommonModule, CardComponent, AvatarComponent, BadgeComponent, ButtonComponent],
  templateUrl: './working-hours.component.html',
  styleUrl: './working-hours.component.css',
})
export class WorkingHoursComponent {
  days = [
    { name: 'Monday', active: true },
    { name: 'Tuesday', active: true },
    { name: 'Wednesday', active: true },
    { name: 'Thursday', active: true },
    { name: 'Friday', active: true },
    { name: 'Saturday', active: false },
    { name: 'Sunday', active: false },
  ];
}
