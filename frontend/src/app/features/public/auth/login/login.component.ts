import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { AuthLayoutComponent } from '../shared/auth-layout.component';
import { PasswordInputComponent } from '../shared/password-input.component';
import { validateEmail, validatePassword } from '../shared/auth-validators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ButtonComponent,
    InputComponent,
    AuthLayoutComponent,
    PasswordInputComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  authService = inject(AuthService);
  router      = inject(Router);
  route       = inject(ActivatedRoute);

  email      = '';
  password   = '';
  rememberMe = false;

  emailError    = signal<string | null>(null);
  passwordError = signal<string | null>(null);
  infoBanner    = signal<string | null>(null);

  private touched = { email: false, password: false };

  constructor() {
    this.route.queryParams.subscribe(params => {
      if (params['message'] === 'check-email') {
        this.infoBanner.set('Check your inbox to verify your email, then sign in.');
      }
    });
  }

  touchField(field: 'email' | 'password'): void {
    this.touched[field] = true;
    this.validateField(field);
  }

  private validateField(field: 'email' | 'password'): void {
    if (field === 'email')    this.emailError.set(validateEmail(this.email));
    if (field === 'password') this.passwordError.set(validatePassword(this.password));
  }

  private validateAll(): boolean {
    this.emailError.set(validateEmail(this.email));
    this.passwordError.set(validatePassword(this.password));
    return !this.emailError() && !this.passwordError();
  }

  async onSubmit(): Promise<void> {
    if (!this.validateAll()) return;
    await this.authService.login(this.email, this.password);
  }

  onSocialLogin(provider: string): void {
    console.log(`Social login with ${provider} — not yet connected`);
  }
}
