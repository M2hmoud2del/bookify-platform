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
  template: `
    <div class="service-card">
      <div class="card-header">
        <div class="service-info">
          <h3 class="service-name">{{ service().title }}</h3>
          <p class="service-category">{{ service().category }}</p>
        </div>
        <app-badge [variant]="service().isActive ? 'success' : 'gray'" size="sm">
          {{ service().isActive ? 'Active' : 'Inactive' }}
        </app-badge>
      </div>

      @if (service().description) {
        <p class="service-desc">{{ service().description }}</p>
      }

      <div class="service-meta">
        <div class="meta-item">
          <span class="material-icons-outlined">schedule</span>
          <span>{{ service().durationMinutes }} min</span>
        </div>
        <div class="meta-item price">
          <span class="material-icons-outlined">payments</span>
          <span>$ {{ service().price }}</span>
        </div>
      </div>

      <div class="card-actions">
        <app-button variant="ghost" size="sm" [routerLink]="['/provider/services', service()._id, 'edit']">
          <span class="material-icons-outlined">edit</span>
          Edit
        </app-button>
        <button
          type="button"
          class="toggle-action"
          (click)="toggleStatus.emit(service()._id)"
        >
          <span class="material-icons-outlined">{{ service().isActive ? 'toggle_off' : 'toggle_on' }}</span>
          {{ service().isActive ? 'Deactivate' : 'Activate' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .service-card {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      padding: var(--space-5);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      transition: box-shadow var(--transition-fast);
    }

    :host-context(.dark) .service-card {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .service-card:hover { box-shadow: var(--shadow-md); }

    .card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--space-3);
    }

    .service-name {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .service-category {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin: var(--space-1) 0 0;
    }

    .service-desc {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .service-meta {
      display: flex;
      gap: var(--space-4);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .meta-item.price { color: var(--primary-600); font-weight: var(--font-weight-semibold); }
    :host-context(.dark) .meta-item.price { color: var(--primary-400); }
    .meta-item .material-icons-outlined { font-size: 1.125rem; }

    .card-actions {
      display: flex;
      gap: var(--space-2);
    }

    .toggle-action {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-1);
      padding: var(--space-2) var(--space-3);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      background: var(--gray-100);
      border: none;
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    :host-context(.dark) .toggle-action { background: var(--gray-700); }
    .toggle-action:hover { background: var(--gray-200); color: var(--text-primary); }
    :host-context(.dark) .toggle-action:hover { background: var(--gray-600); }
    .toggle-action .material-icons-outlined { font-size: 1.125rem; }
  `],
})
export class ProviderServiceCardComponent {
  service = input.required<Service>();
  toggleStatus = output<string>();
}
