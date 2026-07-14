import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { AuthLayoutComponent } from '../shared/auth-layout.component';
import { PasswordInputComponent } from '../shared/password-input.component';
import { PasswordStrengthComponent } from '../shared/password-strength.component';
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  validateRequired,
} from '../shared/auth-validators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ButtonComponent,
    InputComponent,
    AuthLayoutComponent,
    PasswordInputComponent,
    PasswordStrengthComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  authService = inject(AuthService);
  router      = inject(Router);

  role            : 'customer' | 'provider' = 'customer';
  name            = '';
  email           = '';
  password        = '';
  confirmPassword = '';
  acceptTerms     = false;

  nameError            = signal<string | null>(null);
  emailError           = signal<string | null>(null);
  passwordError        = signal<string | null>(null);
  confirmPasswordError = signal<string | null>(null);
  termsError           = signal(false);

  touchField(field: string): void {
    switch (field) {
      case 'name':             this.nameError.set(validateRequired(this.name, 'Full name')); break;
      case 'email':           this.emailError.set(validateEmail(this.email)); break;
      case 'password':        this.passwordError.set(validatePassword(this.password)); break;
      case 'confirmPassword': this.confirmPasswordError.set(validatePasswordConfirm(this.password, this.confirmPassword)); break;
    }
  }

  private validateAll(): boolean {
    this.nameError.set(validateRequired(this.name, 'Full name'));
    this.emailError.set(validateEmail(this.email));
    this.passwordError.set(validatePassword(this.password));
    this.confirmPasswordError.set(validatePasswordConfirm(this.password, this.confirmPassword));
    this.termsError.set(!this.acceptTerms);

    return (
      !this.nameError() &&
      !this.emailError() &&
      !this.passwordError() &&
      !this.confirmPasswordError() &&
      !this.termsError()
    );
  }

  async onSubmit(): Promise<void> {
    if (!this.validateAll()) return;
    await this.authService.register(
      this.email,
      this.password,
      this.name,
      this.role,
    );
  }
}
