import { Component, inject, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { UserRole } from '../../core/models/user.model';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';

export interface SidebarItem {
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, AvatarComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  router = inject(Router);

  role = input<UserRole>('customer');
  isOpen = input<boolean>(false);

  isCollapsed = signal(false);
  settingsPath = computed(() => '/' + this.role() + '/settings');

  userDisplayName = computed(() => {
    const user = this.authService.user();
    return user?.name ?? 'User';
  });

  navItems = computed(() => {
    const role = this.role();
    const items: SidebarItem[] = [{
      label: 'Dashboard',
      icon: 'dashboard',
      path: `/${role}/dashboard`,
    }];

    if (role === 'provider') {
      items.push(
        { label: 'Calendar', icon: 'calendar_today', path: '/provider/calendar' },
        { label: 'Appointments', icon: 'event_note', path: '/provider/appointments', badge: 5 },
        { label: 'Services', icon: 'medical_services', path: '/provider/services' },
        { label: 'Working Hours', icon: 'schedule', path: '/provider/working-hours' },
        { label: 'Customers', icon: 'people', path: '/provider/customers' },
        { label: 'Reviews', icon: 'star', path: '/provider/reviews' },
        { label: 'Payments', icon: 'payments', path: '/provider/payments' },
        { label: 'Notifications', icon: 'notifications', path: '/provider/notifications' },
        { label: 'Profile', icon: 'person', path: '/provider/profile' },
        { label: 'Upload Images', icon: 'add_a_photo', path: '/provider/upload-images' }
      );
    } else {
      items.push(
        { label: 'Find Providers', icon: 'search', path: '/providers' },
        { label: 'Book', icon: 'add_circle', path: '/customer/book' },
        { label: 'Appointments', icon: 'event_note', path: '/customer/appointments' },
        { label: 'History', icon: 'history', path: '/customer/history' },
        { label: 'Payments', icon: 'receipt_long', path: '/customer/payments' },
        { label: 'Reviews', icon: 'star', path: '/customer/reviews' },
        { label: 'Notifications', icon: 'notifications', path: '/customer/notifications' },
        { label: 'Profile', icon: 'person', path: '/customer/profile' }
      );
    }

    return items;
  });

  toggleCollapse(): void {
    this.isCollapsed.update((v) => !v);
  }
}
