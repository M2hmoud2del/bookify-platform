import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';

@Component({
  selector: 'app-customer-edit-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ButtonComponent, InputComponent],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',
})
export class CustomerEditProfileComponent {
  private router = inject(Router);
  authService = inject(AuthService);

  firstName = this.authService.user()?.name.split(' ')[0] ?? 'John';
  lastName = this.authService.user()?.name.split(' ').slice(1).join(' ') ?? 'Doe';
  email = this.authService.user()?.email ?? 'john.doe@example.com';
  phone = '+1 (555) 123-4567';


  firstNameError = signal<string | null>(null);
  lastNameError = signal<string | null>(null);
  emailError = signal<string | null>(null);
  saving = signal(false);
  uploadingAvatar = signal(false);

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    this.uploadingAvatar.set(true);
    
    try {
      await this.authService.uploadAvatar(file);
    } finally {
      this.uploadingAvatar.set(false);
      // Reset input so the same file can be selected again if needed
      input.value = '';
    }
  }

  onSubmit(): void {
    let valid = true;

    if (!this.firstName.trim()) {
      this.firstNameError.set('First name is required');
      valid = false;
    } else {
      this.firstNameError.set(null);
    }

    if (!this.lastName.trim()) {
      this.lastNameError.set('Last name is required');
      valid = false;
    } else {
      this.lastNameError.set(null);
    }

    if (!this.email.trim()) {
      this.emailError.set('Email is required');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.emailError.set('Please enter a valid email');
      valid = false;
    } else {
      this.emailError.set(null);
    }

    if (!valid) return;

    this.saving.set(true);
    
    this.authService.updateProfile({
      name: `${this.firstName} ${this.lastName}`.trim(),
      phone: this.phone,
      email: this.email
    }).then(success => {
      this.saving.set(false);
      if (success) {
        this.router.navigate(['/customer/profile']);
      }
    });
  }
}
