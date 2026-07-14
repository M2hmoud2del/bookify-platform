import { Component, inject, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { SearchComponent } from '../../shared/components/search/search.component';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, AvatarComponent, SearchComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);

  role = input<'customer' | 'provider'>('customer');
  toggleMobileMenu = output<void>();

  notificationCount = signal(3);
  userMenuOpen = signal(false);

  userDisplayName = computed(() => {
    const user = this.authService.user();
    if (!user) return 'User';
    return user.name;
  });

  roleLabel = computed(() => {
    return this.role() === 'provider' ? 'Provider' : 'Customer';
  });

  profilePath = computed(() => `/${this.role()}/profile`);
  settingsPath = computed(() => `/${this.role()}/settings`);

  breadcrumbs = signal<BreadcrumbItem[]>([{ label: 'Dashboard' }]);

  constructor() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      this.updateBreadcrumbs(event.url);
    });
  }

  private updateBreadcrumbs(url: string): void {
    const segments = url.split('/').filter(Boolean);
    const items: BreadcrumbItem[] = [];

    let currentPath = '';
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      currentPath += '/' + segment;

      const label = this.formatLabel(segment);
      items.push({
        label,
        path: i < segments.length - 1 ? currentPath : undefined,
      });
    }

    if (items.length === 0) {
      items.push({ label: 'Dashboard' });
    }

    this.breadcrumbs.set(items);
  }

  private formatLabel(segment: string): string {
    return segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  toggleUserMenu(): void {
    this.userMenuOpen.update((v) => !v);
  }

  onNotificationsClick(): void {
    this.router.navigate([`/${this.role()}/notifications`]);
  }

  onLogout(): void {
    this.authService.logout();
  }
}
