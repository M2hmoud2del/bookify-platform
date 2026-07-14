import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ButtonComponent, InputComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);

  role: 'customer' | 'provider' = 'customer';
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  acceptTerms = false;

  firstNameError = signal<string | null>(null);
  lastNameError = signal<string | null>(null);
  emailError = signal<string | null>(null);
  passwordError = signal<string | null>(null);
  confirmPasswordError = signal<string | null>(null);

  async onSubmit(): Promise<void> {
    if (!this.validate()) return;

    await this.authService.register(
      this.email,
      this.password,
      this.firstName,
      this.lastName,
      this.role
    );
  }

  private validate(): boolean {
    this.firstNameError.set(null);
    this.lastNameError.set(null);
    this.emailError.set(null);
    this.passwordError.set(null);
    this.confirmPasswordError.set(null);

    let valid = true;

    if (!this.firstName) {
      this.firstNameError.set('First name is required');
      valid = false;
    }

    if (!this.lastName) {
      this.lastNameError.set('Last name is required');
      valid = false;
    }

    if (!this.email) {
      this.emailError.set('Email is required');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.emailError.set('Please enter a valid email');
      valid = false;
    }

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

    if (!this.acceptTerms) {
      valid = false;
    }

    return valid;
  }
}
