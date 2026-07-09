import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, ActivatedRoute } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-authenticated-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent],
  template: `
    <div class="layout" [ngClass]="{ 'sidebar-collapsed': sidebarCollapsed(), 'mobile-menu-open': mobileMenuOpen() }">
      <app-sidebar [role]="userRole()" />
      <div class="layout-main">
        <app-navbar [role]="userRole()" (toggleMobileMenu)="toggleMobileMenu()" />
        <main class="layout-content">
          <router-outlet></router-outlet>
        </main>
      </div>
      @if (mobileMenuOpen()) {
        <div class="mobile-overlay" (click)="closeMobileMenu()"></div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .layout {
      display: flex;
      min-height: 100vh;
      background: var(--background);
    }

    .layout-main {
      flex: 1;
      margin-left: var(--sidebar-width);
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      transition: margin-left var(--transition-normal);
    }

    .sidebar-collapsed .layout-main {
      margin-left: var(--sidebar-collapsed-width);
    }

    @media (max-width: 1023px) {
      .layout-main {
        margin-left: 0;
      }
    }

    .layout-content {
      flex: 1;
      padding: var(--space-6);
      overflow-y: auto;
    }

    @media (max-width: 767px) {
      .layout-content {
        padding: var(--space-4);
      }
    }

    .mobile-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.5);
      z-index: calc(var(--z-fixed) - 1);
      animation: fadeIn var(--transition-fast);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `],
})
export class AuthenticatedLayoutComponent {
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  sidebarCollapsed = signal(false);
  mobileMenuOpen = signal(false);

  userRole = computed(() => {
    const user = this.authService.user();
    return user?.role ?? 'customer';
  });

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
