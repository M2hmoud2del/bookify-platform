import { Component, inject, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
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
  template: `
    <aside class="sidebar" [ngClass]="{ 'is-collapsed': isCollapsed() }">
      <div class="sidebar-header">
        <a routerLink="/" class="sidebar-brand">
          <span class="brand-icon">
            <span class="material-icons-outlined">calendar_month</span>
          </span>
          @if (!isCollapsed()) {
            <span class="brand-name">Bookify</span>
          }
        </a>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          @for (item of navItems(); track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="is-active"
              [routerLinkActiveOptions]="{exact: true}"
              class="nav-item"
              [title]="isCollapsed() ? item.label : ''"
            >
              <span class="nav-icon">
                <span class="material-icons-outlined">{{ item.icon }}</span>
              </span>
              @if (!isCollapsed()) {
                <span class="nav-label">{{ item.label }}</span>
              }
              @if (!isCollapsed() && item.badge) {
                <span class="nav-badge">{{ item.badge }}</span>
              }
            </a>
          }
        </div>
      </nav>

      <div class="sidebar-footer">
        <a
          routerLink="/settings"
          routerLinkActive="is-active"
          class="nav-item"
          [title]="isCollapsed() ? 'Settings' : ''"
        >
          <span class="nav-icon">
            <span class="material-icons-outlined">settings</span>
          </span>
          @if (!isCollapsed()) {
            <span class="nav-label">Settings</span>
          }
        </a>
        <button type="button" class="nav-item" (click)="themeService.toggleTheme()" [title]="isCollapsed() ? 'Toggle theme' : ''">
          <span class="nav-icon">
            <span class="material-icons-outlined">
              {{ themeService.isDarkMode() ? 'light_mode' : 'dark_mode' }}
            </span>
          </span>
          @if (!isCollapsed()) {
            <span class="nav-label">{{ themeService.isDarkMode() ? 'Light Mode' : 'Dark Mode' }}</span>
          }
        </button>
      </div>

      <div class="sidebar-user">
        <app-avatar
          [src]="authService.user()?.avatar"
          [name]="userDisplayName()"
          size="sm"
        />
        @if (!isCollapsed()) {
          <div class="user-info">
            <p class="user-name">{{ userDisplayName() }}</p>
            <p class="user-email">{{ authService.user()?.email }}</p>
          </div>
        }
      </div>

      <button type="button" class="collapse-toggle" (click)="toggleCollapse()" [attr.aria-label]="isCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'">
        <span class="material-icons-outlined">
          {{ isCollapsed() ? 'chevron_right' : 'chevron_left' }}
        </span>
      </button>
    </aside>
  `,
  styles: [`
    :host {
      display: block;
    }

    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: var(--sidebar-width);
      background: var(--surface);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      z-index: var(--z-sidebar);
      transition: width var(--transition-normal), transform var(--transition-normal);
    }

    :host-context(.dark) .sidebar {
      background: var(--gray-900);
      border-color: var(--gray-800);
    }

    .is-collapsed {
      width: var(--sidebar-collapsed-width);
    }

    .sidebar-header {
      height: var(--navbar-height);
      display: flex;
      align-items: center;
      padding: 0 var(--space-4);
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }

    :host-context(.dark) .sidebar-header {
      border-color: var(--gray-800);
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      color: var(--text-primary);
      text-decoration: none;
      transition: opacity var(--transition-fast);
    }

    .sidebar-brand:hover {
      opacity: 0.85;
    }

    .brand-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
      border-radius: var(--radius-lg);
      color: white;
      flex-shrink: 0;
      box-shadow: var(--shadow-primary);
    }

    .brand-icon .material-icons-outlined {
      font-size: 1.25rem;
    }

    .brand-name {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      letter-spacing: -0.02em;
    }

    .sidebar-nav {
      flex: 1;
      padding: var(--space-4) var(--space-3);
      overflow-y: auto;
      overflow-x: hidden;
    }

    .nav-section {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: 0.625rem 0.875rem;
      color: var(--text-secondary);
      text-decoration: none;
      border-radius: var(--radius-lg);
      transition: all var(--transition-fast);
      cursor: pointer;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      position: relative;
    }

    .nav-item:hover {
      background: var(--gray-100);
      color: var(--text-primary);
    }

    .nav-item.is-active {
      background: var(--primary-100);
      color: var(--primary-600);
      font-weight: var(--font-weight-semibold);
    }

    .nav-item.is-active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 60%;
      background: var(--primary-500);
      border-radius: var(--radius-full);
    }

    :host-context(.dark) .nav-item:hover {
      background: var(--gray-800);
    }

    :host-context(.dark) .nav-item.is-active {
      background: rgba(79, 70, 229, 0.2);
      color: var(--primary-400);
    }

    .is-collapsed .nav-item {
      justify-content: center;
      padding: 0.625rem;
    }

    .is-collapsed .nav-item.is-active::before {
      display: none;
    }

    .nav-icon {
      display: flex;
      flex-shrink: 0;
    }

    .nav-icon .material-icons-outlined {
      font-size: 1.25rem;
      transition: transform var(--transition-fast);
    }

    .nav-item:hover .nav-icon .material-icons-outlined {
      transform: scale(1.1);
    }

    .nav-label {
      flex: 1;
      white-space: nowrap;
    }

    .nav-badge {
      padding: 0.125rem 0.5rem;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      background: var(--primary-500);
      color: white;
      border-radius: var(--radius-full);
      min-width: 20px;
      text-align: center;
    }

    .sidebar-footer {
      padding: var(--space-3) var(--space-3);
      border-top: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex-shrink: 0;
    }

    :host-context(.dark) .sidebar-footer {
      border-color: var(--gray-800);
    }

    .sidebar-user {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-4);
      border-top: 1px solid var(--border);
      flex-shrink: 0;
    }

    :host-context(.dark) .sidebar-user {
      border-color: var(--gray-800);
    }

    .is-collapsed .sidebar-user {
      justify-content: center;
      padding: var(--space-3);
    }

    .user-info {
      flex: 1;
      min-width: 0;
    }

    .user-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .user-email {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .collapse-toggle {
      position: absolute;
      top: 50%;
      right: -12px;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-full);
      color: var(--text-secondary);
      cursor: pointer;
      z-index: 1;
      transition: all var(--transition-fast);
      box-shadow: var(--shadow-sm);
    }

    :host-context(.dark) .collapse-toggle {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .collapse-toggle:hover {
      background: var(--primary-50);
      color: var(--primary-600);
      border-color: var(--primary-300);
    }

    :host-context(.dark) .collapse-toggle:hover {
      background: rgba(79, 70, 229, 0.15);
      color: var(--primary-400);
      border-color: var(--primary-500);
    }

    .collapse-toggle .material-icons-outlined {
      font-size: 1rem;
    }

    @media (max-width: 1023px) {
      .sidebar {
        transform: translateX(-100%);
        box-shadow: var(--shadow-2xl);
      }

      .sidebar.is-open {
        transform: translateX(0);
      }

      .collapse-toggle {
        display: none;
      }
    }
  `],
})
export class SidebarComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  router = inject(Router);

  role = input<'customer' | 'provider'>('customer');

  isCollapsed = signal(false);

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
