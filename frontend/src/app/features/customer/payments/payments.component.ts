import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-customer-payments',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css',
})
export class CustomerPaymentsComponent {}
