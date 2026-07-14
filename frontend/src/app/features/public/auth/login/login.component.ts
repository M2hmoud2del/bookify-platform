import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ButtonComponent, InputComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  email = '';
  password = '';
  rememberMe = false;

  emailError = signal<string | null>(null);
  passwordError = signal<string | null>(null);

  message = signal<string | null>(null);

  constructor() {
    this.route.queryParams.subscribe((params) => {
      if (params['message'] === 'check-email') {
        this.message.set('Please check your email to verify your account');
      }
    });
  }

  async onSubmit(): Promise<void> {
    if (!this.validate()) return;

    await this.authService.login(this.email, this.password);
  }

  onSocialLogin(provider: string): void {
    console.log('Social login with', provider);
  }

  private validate(): boolean {
    this.emailError.set(null);
    this.passwordError.set(null);

    if (!this.email) {
      this.emailError.set('Email is required');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.emailError.set('Please enter a valid email');
      return false;
    }

    if (!this.password) {
      this.passwordError.set('Password is required');
      return false;
    }

    if (this.password.length < 6) {
      this.passwordError.set('Password must be at least 6 characters');
      return false;
    }

    return true;
  }
}
