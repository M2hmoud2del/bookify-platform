import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ButtonComponent, InputComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  password = '';
  confirmPassword = '';
  success = signal(false);

  passwordError = signal<string | null>(null);
  confirmPasswordError = signal<string | null>(null);

  async onSubmit(): Promise<void> {
    if (!this.validate()) return;

    const result = await this.authService.resetPassword(this.password);
    if (result) {
      this.success.set(true);
    }
  }

  private validate(): boolean {
    this.passwordError.set(null);
    this.confirmPasswordError.set(null);

    let valid = true;

    if (!this.password) {
      this.passwordError.set('Password is required');
      valid = false;
    } else if (this.password.length < 8) {
      this.passwordError.set('Password must be at least 8 characters');
      valid = false;
    }

    if (!this.confirmPassword) {
      this.confirmPasswordError.set('Please confirm your password');
      valid = false;
    } else if (this.password !== this.confirmPassword) {
      this.confirmPasswordError.set('Passwords do not match');
      valid = false;
    }

    return valid;
  }
}
