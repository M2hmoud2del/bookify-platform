import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { SelectOption } from '../../../../shared/components/dropdown/dropdown.component';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    CardComponent,
    InputComponent,
  ],
  template: `
    <div class="service-form-page">
      <div class="page-header">
        <button type="button" class="back-btn" (click)="goBack()">
          <span class="material-icons-outlined">arrow_back</span>
        </button>
        <div class="header-content">
          <h1 class="page-title">{{ isEditMode() ? 'Edit Service' : 'Create Service' }}</h1>
          <p class="page-subtitle">{{ isEditMode() ? 'Update your service details' : 'Add a new service to your offerings' }}</p>
        </div>
      </div>

      <form class="service-form" (ngSubmit)="onSubmit()">
        <app-card title="Service Details">
          <div class="form-grid">
            <app-input
              label="Service Name"
              placeholder="e.g., Haircut & Styling"
              [(ngModel)]="service.title"
              name="title"
              [required]="true"
            />

            <app-input
              label="Category"
              placeholder="e.g., Hair Care"
              [(ngModel)]="service.category"
              name="category"
            />

            <div class="form-row">
              <app-input
                label="Duration (minutes)"
                type="number"
                placeholder="45"
                [(ngModel)]="service.durationMinutes"
                name="durationMinutes"
                [required]="true"
              />

              <app-input
                label="Price ($)"
                type="number"
                placeholder="65"
                [(ngModel)]="service.price"
                name="price"
                [required]="true"
              />
            </div>
          </div>
        </app-card>

        <app-card title="Description">
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea
              class="form-textarea"
              placeholder="Describe your service..."
              [(ngModel)]="service.description"
              name="description"
              rows="4"
            ></textarea>
            <p class="form-hint">Provide a brief description of what customers can expect.</p>
          </div>
        </app-card>

        <app-card title="Settings">
          <div class="settings-options">
            <div class="setting-option">
              <div class="setting-info">
                <p class="setting-title">Active Status</p>
                <p class="setting-description">Make this service available for booking</p>
              </div>
              <button
                type="button"
                class="toggle-btn"
                [ngClass]="{ 'is-active': service.isActive }"
                (click)="service.isActive = !service.isActive"
              >
                <span class="toggle-slider"></span>
              </button>
            </div>
          </div>
        </app-card>

        <div class="form-actions">
          <app-button variant="ghost" (onClick)="goBack()">Cancel</app-button>
          <app-button variant="primary" type="submit">
            {{ isEditMode() ? 'Save Changes' : 'Create Service' }}
          </app-button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .service-form-page {
      max-width: 800px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      margin-bottom: var(--space-6);
    }

    .back-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      color: var(--text-secondary);
      border-radius: var(--radius-lg);
      transition: all var(--transition-fast);
    }

    .back-btn:hover {
      background: var(--gray-100);
      color: var(--text-primary);
    }

    :host-context(.dark) .back-btn:hover {
      background: var(--gray-800);
    }

    .back-btn .material-icons-outlined {
      font-size: 1.5rem;
    }

    .page-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0;
    }

    .page-subtitle {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: var(--space-1) 0 0;
    }

    .service-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .form-grid {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .form-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--gray-700);
    }

    :host-context(.dark) .form-label {
      color: var(--gray-300);
    }

    .form-textarea {
      padding: var(--space-3) var(--space-4);
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      background: var(--surface);
      border: 1px solid var(--gray-300);
      border-radius: var(--radius-lg);
      resize: vertical;
      transition: all var(--transition-fast);
    }

    :host-context(.dark) .form-textarea {
      background: var(--gray-800);
      border-color: var(--gray-600);
    }

    .form-textarea:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px var(--primary-100);
    }

    :host-context(.dark) .form-textarea:focus {
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
    }

    .form-hint {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .settings-options {
      display: flex;
      flex-direction: column;
    }

    .setting-option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-4) 0;
    }

    .setting-info {
      flex: 1;
    }

    .setting-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      margin: 0;
    }

    .setting-description {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin: var(--space-1) 0 0;
    }

    .toggle-btn {
      position: relative;
      width: 44px;
      height: 24px;
      background: var(--gray-200);
      border-radius: var(--radius-full);
      transition: all var(--transition-fast);
    }

    :host-context(.dark) .toggle-btn {
      background: var(--gray-700);
    }

    .toggle-btn.is-active {
      background: var(--primary-500);
    }

    .toggle-slider {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: var(--radius-full);
      transition: transform var(--transition-fast);
    }

    .toggle-btn.is-active .toggle-slider {
      transform: translateX(20px);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-3);
      padding-top: var(--space-4);
    }
  `],
})
export class ServiceFormComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);

  serviceId = computed(() => this.route.snapshot.paramMap.get('id'));
  isEditMode = computed(() => !!this.serviceId());

  service = {
    title: '',
    category: '',
    durationMinutes: 45,
    price: 0,
    description: '',
    isActive: true,
  };

  goBack(): void {
    this.router.navigate(['/provider/services']);
  }

  onSubmit(): void {
    console.log('Submit service:', this.service);
    this.router.navigate(['/provider/services']);
  }
}
