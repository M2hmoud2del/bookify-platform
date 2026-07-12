import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Service } from '../../../core/models/user.model';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  template: `
    <div class="service-card" [routerLink]="['/providers', providerId(), 'services', service()._id]">
      <div class="service-image">
        <img [src]="service().images[0]?.url" [alt]="service().title" loading="lazy" />
        <span class="duration-badge">
          <span class="material-icons-outlined">schedule</span>
          {{ service().durationMinutes }}min
        </span>
      </div>

      <div class="service-body">
        <h3 class="service-name">{{ service().title }}</h3>
        <p class="service-desc">{{ service().description }}</p>

        <div class="service-footer">
          <span class="service-price">
            <span class="price-label">From</span>
            <span class="price-amount">$ {{ service().price }}</span>
          </span>
          <app-button
            variant="primary"
            size="sm"
            (onClick)="onBook($event)"
          >
            <span class="material-icons-outlined">add</span>
            Book
          </app-button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .service-card {
      display: flex;
      flex-direction: column;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      overflow: hidden;
      cursor: pointer;
      transition: box-shadow var(--transition-normal), transform var(--transition-normal), border-color var(--transition-normal);
      text-decoration: none;
      color: inherit;
      height: 100%;

      &:hover {
        box-shadow: var(--shadow-lg);
        transform: translateY(-3px);
        border-color: var(--primary-200);
      }
    }

    :host-context(.dark) .service-card {
      background: var(--gray-800);
      border-color: var(--gray-700);

      &:hover {
        border-color: var(--primary-500);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
      }
    }

    .service-image {
      position: relative;
      height: 180px;
      overflow: hidden;
    }

    .service-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--transition-slow);
    }

    .service-card:hover .service-image img {
      transform: scale(1.05);
    }

    .duration-badge {
      position: absolute;
      bottom: var(--space-2);
      right: var(--space-2);
      display: flex;
      align-items: center;
      gap: 2px;
      padding: var(--space-1) var(--space-2);
      background: rgba(0, 0, 0, 0.65);
      color: #fff;
      border-radius: var(--radius-md);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      backdrop-filter: blur(4px);
    }

    .duration-badge .material-icons-outlined { font-size: 0.875rem; }

    .service-body {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: var(--space-4);
    }

    .service-name {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-1);
    }

    .service-desc {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      line-height: 1.5;
      margin: 0 0 var(--space-4);
      flex: 1;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .service-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: var(--space-3);
      border-top: 1px solid var(--border);
    }

    :host-context(.dark) .service-footer { border-color: var(--gray-700); }

    .service-price {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .price-label {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .price-amount {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
    }
  `],
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
