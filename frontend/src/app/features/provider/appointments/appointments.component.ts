import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';

@Component({
  selector: 'app-provider-appointments',
  standalone: true,
  imports: [CommonModule, CardComponent, BadgeComponent],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css',
})
export class ProviderAppointmentsComponent {}
