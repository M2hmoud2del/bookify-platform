import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ProviderServicesApi } from '../provider-services.api';

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
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.css',
})
export class ServiceFormComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  private providerServicesApi = inject(ProviderServicesApi);

  serviceId = computed(() => this.route.snapshot.paramMap.get('id'));
  isEditMode = computed(() => !!this.serviceId());
  loading = signal(false);
  saving = signal(false);
  error = signal<string | null>(null);
  private originalIsActive = true;

  service = {
    title: '',
    category: '',
    durationMinutes: 45,
    price: 0,
    description: '',
    isActive: true,
  };

  constructor() {
    if (this.isEditMode()) {
      void this.loadService();
    }
  }

  async loadService(): Promise<void> {
    const serviceId = this.serviceId();

    if (!serviceId) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const service = await this.providerServicesApi.getServiceById(serviceId);
      this.service = {
        title: service.title,
        category: service.category ?? '',
        durationMinutes: service.durationMinutes,
        price: service.price,
        description: service.description ?? '',
        isActive: service.isActive,
      };
      this.originalIsActive = service.isActive;
    } catch (err) {
      this.error.set(this.errorMessage(err));
    } finally {
      this.loading.set(false);
    }
  }

  goBack(): void {
    this.router.navigate(['/provider/services']);
  }

  async onSubmit(): Promise<void> {
    this.saving.set(true);
    this.error.set(null);

    try {
      const serviceId = this.serviceId();
      const payload = {
        title: this.service.title,
        category: this.service.category,
        durationMinutes: Number(this.service.durationMinutes),
        price: Number(this.service.price),
        description: this.service.description,
      };

      if (serviceId) {
        await this.providerServicesApi.updateService(serviceId, payload);

        if (this.service.isActive !== this.originalIsActive) {
          await this.providerServicesApi.updateServiceStatus(serviceId, this.service.isActive);
        }
      } else {
        await this.providerServicesApi.createService({
          ...payload,
          isActive: this.service.isActive,
        });
      }

      this.router.navigate(['/provider/services']);
    } catch (err) {
      this.error.set(this.errorMessage(err));
    } finally {
      this.saving.set(false);
    }
  }

  private errorMessage(err: unknown): string {
    const message = (err as { message?: string })?.message;
    return message || (err instanceof Error ? err.message : 'Unable to save service.');
  }
}
