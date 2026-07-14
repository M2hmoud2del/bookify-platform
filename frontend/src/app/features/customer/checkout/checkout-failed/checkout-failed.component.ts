import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-checkout-failed',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  templateUrl: './checkout-failed.component.html',
  styleUrl: './checkout-failed.component.css',
})
export class CheckoutFailedComponent {}
