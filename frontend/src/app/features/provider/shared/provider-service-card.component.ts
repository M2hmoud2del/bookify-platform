import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '../../../shared/components/badge/badge.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Service } from '../../../core/models/user.model';

@Component({
  selector: 'app-provider-service-card',
  standalone: true,
  imports: [CommonModule, RouterLink, BadgeComponent, ButtonComponent],
  templateUrl: './provider-service-card.component.html',
  styleUrl: './provider-service-card.component.css',
})
export class ProviderServiceCardComponent {
  service = input.required<Service>();
  toggleStatus = output<string>();
}
