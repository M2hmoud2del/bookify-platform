import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Service } from '../../../core/models/user.model';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.css',
})
export class ServiceCardComponent {
  service = input.required<Service>();
  providerId = input.required<string>();
  bookService = output<Service>();

  onBook(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.bookService.emit(this.service());
  }
}
