import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [CommonModule, RouterLink, AvatarComponent, ButtonComponent],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.css',
})
export class ProfileHeaderComponent {
  displayName = input('User');
  email = input('');
  avatarUrl = input<string | null>(null);
  totalAppointments = input(0);
  completedAppointments = input(0);
  totalReviews = input(0);
  showEditButton = input(true);
  editLink = input<string[]>(['/customer/profile/edit']);
}
