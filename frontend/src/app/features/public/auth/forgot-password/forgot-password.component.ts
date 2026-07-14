import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { AuthLayoutComponent } from '../shared/auth-layout.component';
import { validateEmail } from '../shared/auth-validators';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ButtonComponent,
    InputComponent,
    AuthLayoutComponent,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  authService = inject(AuthService);

  email      = '';
  emailError = signal<string | null>(null);
  sent       = signal(false);

  readonly validateEmail = validateEmail;

  async onSubmit(): Promise<void> {
    this.emailError.set(validateEmail(this.email));
    if (this.emailError()) return;

    const ok = await this.authService.forgotPassword(this.email);
    if (ok) this.sent.set(true);
  }

  async onResend(): Promise<void> {
    await this.authService.forgotPassword(this.email);
  }
}
