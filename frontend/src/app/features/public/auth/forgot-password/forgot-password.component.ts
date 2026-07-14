import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ButtonComponent, InputComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  authService = inject(AuthService);
  router = inject(Router);

  email = '';
  submitted = signal(false);
  emailError = signal<string | null>(null);

  async onSubmit(): Promise<void> {
    if (!this.validate()) return;

    await this.authService.forgotPassword(this.email);
    this.submitted.set(true);
  }

  async onResend(): Promise<void> {
    if (this.email) {
      await this.authService.forgotPassword(this.email);
    }
  }

  private validate(): boolean {
    this.emailError.set(null);

    if (!this.email) {
      this.emailError.set('Email is required');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.emailError.set('Please enter a valid email');
      return false;
    }

    return true;
  }
}
