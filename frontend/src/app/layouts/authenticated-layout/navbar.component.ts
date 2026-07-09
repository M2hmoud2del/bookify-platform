import { Component, inject, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { SearchComponent } from '../../shared/components/search/search.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, AvatarComponent, SearchComponent, ButtonComponent],
  template: `
    <header class="navbar">
      <div class="navbar-left">
        <button type="button" class="menu-toggle" (click)="toggleMobileMenu.emit()">
          <span class="material-icons-outlined">menu</span>
        </button>
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          @for (item of breadcrumbs(); track $index) {
            @if ($index > 0) {
              <span class="breadcrumb-divider">
                <span class="material-icons-outlined">chevron_right</span>
              </span>
            }
            @if (item.path && $index !== (breadcrumbs().length - 1)) {
              <a [routerLink]="item.path" class="breadcrumb-link">{{ item.label }}</a>
            } @else {
              <span class="breadcrumb-current">{{ item.label }}</span>
            }
          }
        </nav>
      </div>

      <div class="navbar-center">
        <app-search placeholder="Search..." class="navbar-search" />
      </div>

      <div class="navbar-right">
        <button type="button" class="navbar-icon-btn" (click)="onNotificationsClick()">
          <span class="material-icons-outlined">notifications</span>
          @if (notificationCount() > 0) {
            <span class="navbar-badge">{{ notificationCount() }}</span>
          }
        </button>

        <div class="navbar-divider"></div>

        <div class="navbar-user" (click)="toggleUserMenu()" #userMenuTrigger>
          <app-avatar
            [src]="authService.user()?.avatar_url"
            [name]="userDisplayName()"
            size="sm"
          />
          <div class="user-details">
            <p class="user-name">{{ userDisplayName() }}</p>
            <p class="user-role">{{ roleLabel() }}</p>
          </div>
          <span class="material-icons-outlined user-menu-arrow">
            {{ userMenuOpen() ? 'expand_less' : 'expand_more' }}
          </span>

          @if (userMenuOpen()) {
            <div class="user-menu" #userMenu>
              <a [routerLink]="profilePath()" class="user-menu-item">
                <span class="material-icons-outlined">person</span>
                <span>Profile</span>
              </a>
              <a [routerLink]="settingsPath()" class="user-menu-item">
                <span class="material-icons-outlined">settings</span>
                <span>Settings</span>
              </a>
              <div class="user-menu-divider"></div>
              <button type="button" class="user-menu-item user-menu-logout" (click)="onLogout()">
                <span class="material-icons-outlined">logout</span>
                <span>Log out</span>
              </button>
            </div>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }

    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: var(--navbar-height);
      padding: 0 var(--space-6);
      background: var(--surface);
      border-bottom: 1px solid var(--border);
    }

    :host-context(.dark) .navbar {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .navbar-left {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    .menu-toggle {
      display: none;
      padding: 0.5rem;
      color: var(--text-secondary);
      border-radius: var(--radius-md);
    }

    @media (max-width: 1023px) {
      .menu-toggle {
        display: flex;
      }
    }

    .menu-toggle .material-icons-outlined {
      font-size: 1.5rem;
    }

    .breadcrumbs {
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }

    @media (max-width: 767px) {
      .breadcrumbs {
        display: none;
      }
    }

    .breadcrumb-link {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      text-decoration: none;
      transition: color var(--transition-fast);
    }

    .breadcrumb-link:hover {
      color: var(--primary-500);
    }

    .breadcrumb-current {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .breadcrumb-divider {
      display: flex;
      color: var(--gray-300);
    }

    .breadcrumb-divider .material-icons-outlined {
      font-size: 1rem;
    }

    .navbar-center {
      flex: 1;
      max-width: 480px;
      margin: 0 var(--space-4);
    }

    @media (max-width: 767px) {
      .navbar-center {
        display: none;
      }
    }

    .navbar-search {
      width: 100%;
    }

    .navbar-right {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .navbar-icon-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      color: var(--text-secondary);
      border-radius: var(--radius-lg);
      transition: all var(--transition-fast);
    }

    .navbar-icon-btn:hover {
      background: var(--gray-100);
      color: var(--text-primary);
    }

    :host-context(.dark) .navbar-icon-btn:hover {
      background: var(--gray-700);
    }

    .navbar-icon-btn .material-icons-outlined {
      font-size: 1.25rem;
    }

    .navbar-badge {
      position: absolute;
      top: 4px;
      right: 4px;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      font-size: 10px;
      font-weight: var(--font-weight-semibold);
      background: var(--danger-500);
      color: white;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .navbar-divider {
      width: 1px;
      height: 24px;
      background: var(--border);
    }

    :host-context(.dark) .navbar-divider {
      background: var(--gray-700);
    }

    .navbar-user {
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .navbar-user:hover {
      background: var(--gray-100);
    }

    :host-context(.dark) .navbar-user:hover {
      background: var(--gray-700);
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    @media (max-width: 639px) {
      .user-details {
        display: none;
      }
    }

    .user-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .user-role {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin: 0;
    }

    .user-menu-arrow {
      color: var(--text-secondary);
      font-size: 1.25rem;
    }

    @media (max-width: 639px) {
      .user-menu-arrow {
        display: none;
      }
    }

    .user-menu {
      position: absolute;
      top: calc(100% + var(--space-2));
      right: 0;
      min-width: 180px;
      padding: var(--space-2);
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      z-index: var(--z-dropdown);
      animation: fadeInDown var(--transition-fast);
    }

    :host-context(.dark) .user-menu {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .user-menu-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: 0.5rem var(--space-3);
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      text-decoration: none;
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
      cursor: pointer;
      background: none;
      border: none;
      width: 100%;
      text-align: left;
    }

    .user-menu-item:hover {
      background: var(--gray-100);
    }

    :host-context(.dark) .user-menu-item:hover {
      background: var(--gray-700);
    }

    .user-menu-item .material-icons-outlined {
      font-size: 1.125rem;
      color: var(--text-secondary);
    }

    .user-menu-logout {
      color: var(--danger-500);
    }

    .user-menu-logout .material-icons-outlined {
      color: var(--danger-500);
    }

    .user-menu-divider {
      height: 1px;
      margin: var(--space-2) 0;
      background: var(--border);
    }

    :host-context(.dark) .user-menu-divider {
      background: var(--gray-700);
    }

    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `],
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
    return `${user.first_name} ${user.last_name}`;
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
