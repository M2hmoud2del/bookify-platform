import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Service } from '../../../core/models/user.model';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.css',
})
export class ServiceListComponent {
  services = input.required<Service[]>();
  providerId = input.required<string>();
  book = output<Service>();
}
