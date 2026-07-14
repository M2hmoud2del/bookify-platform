import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { MOCK_PROVIDER_PROFILE } from '../shared/provider.models';

@Component({
  selector: 'app-provider-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ButtonComponent, CardComponent, InputComponent, AvatarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProviderProfileComponent {
  private router = inject(Router);
  authService = inject(AuthService);

  saving = signal(false);

  business = {
    businessName: MOCK_PROVIDER_PROFILE.businessName,
    bio: MOCK_PROVIDER_PROFILE.bio ?? '',
    category: MOCK_PROVIDER_PROFILE.category ?? '',
    address: MOCK_PROVIDER_PROFILE.address ?? '',
    city: MOCK_PROVIDER_PROFILE.city ?? '',
    timezone: MOCK_PROVIDER_PROFILE.timezone,
  };

  onSave(): void {
    this.saving.set(true);
    setTimeout(() => {
      this.saving.set(false);
      this.router.navigate(['/provider/dashboard']);
    }, 800);
  }
}
