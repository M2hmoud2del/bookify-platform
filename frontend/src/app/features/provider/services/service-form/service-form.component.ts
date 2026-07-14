import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CardComponent } from '../../../../shared/components/card/card.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { SelectComponent, SelectOption } from '../../../../shared/components/dropdown/dropdown.component';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    CardComponent,
    InputComponent,
    SelectComponent,
  ],
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.css',
})
export class ServiceFormComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);

  serviceId = computed(() => this.route.snapshot.paramMap.get('id'));
  isEditMode = computed(() => !!this.serviceId());

  service = {
    name: '',
    category: '',
    duration: 45,
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
