import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AuthLayoutComponent } from '../shared/auth-layout.component';
import { PasswordInputComponent } from '../shared/password-input.component';
import { PasswordStrengthComponent } from '../shared/password-strength.component';
import { validatePassword, validatePasswordConfirm } from '../shared/auth-validators';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ButtonComponent,
    AuthLayoutComponent,
    PasswordInputComponent,
    PasswordStrengthComponent,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  authService = inject(AuthService);
  router      = inject(Router);

  password        = '';
  confirmPassword = '';
  passwordError   = signal<string | null>(null);
  confirmError    = signal<string | null>(null);
  done            = signal(false);

  readonly validatePassword        = validatePassword;
  readonly validatePasswordConfirm = validatePasswordConfirm;

  private validateAll(): boolean {
    this.passwordError.set(validatePassword(this.password));
    this.confirmError.set(validatePasswordConfirm(this.password, this.confirmPassword));
    return !this.passwordError() && !this.confirmError();
  }

  async onSubmit(): Promise<void> {
    if (!this.validateAll()) return;
    const ok = await this.authService.resetPassword(this.password);
    if (ok) this.done.set(true);
  }
}
