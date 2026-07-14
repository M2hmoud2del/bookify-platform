import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../../shared/components/card/card.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-customer-appointments',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, AvatarComponent, BadgeComponent, ButtonComponent, EmptyStateComponent],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css',
})
export class CustomerAppointmentsComponent {}
