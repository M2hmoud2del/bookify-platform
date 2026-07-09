import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  template: `
    <header class="navbar" [ngClass]="{ 'is-scrolled': isScrolled() }">
      <div class="container navbar-container">
        <a routerLink="/" class="navbar-brand">
          <span class="brand-icon">
            <span class="material-icons-outlined">calendar_month</span>
          </span>
          <span class="brand-text">Bookify</span>
        </a>

        <nav class="navbar-nav">
          <a routerLink="/#features" class="nav-link">Features</a>
          <a routerLink="/#how-it-works" class="nav-link">How It Works</a>
          <a routerLink="/#pricing" class="nav-link">Pricing</a>
        </nav>

        <div class="navbar-actions">
          @if (authService.isAuthenticated()) {
            <app-button variant="outline" size="sm" routerLink="/customer/dashboard">
              Dashboard
            </app-button>
          } @else {
            <app-button variant="ghost" size="sm" routerLink="/login">
              Sign In
            </app-button>
            <app-button variant="primary" size="sm" routerLink="/register">
              Get Started
            </app-button>
          }
        </div>

        <button type="button" class="mobile-menu-btn" (click)="mobileMenuOpen.set(!mobileMenuOpen())">
          <span class="material-icons-outlined">{{ mobileMenuOpen() ? 'close' : 'menu' }}</span>
        </button>
      </div>

      @if (mobileMenuOpen()) {
        <div class="mobile-menu">
          <nav class="mobile-nav">
            <a routerLink="/#features" class="mobile-nav-link" (click)="mobileMenuOpen.set(false)">Features</a>
            <a routerLink="/#how-it-works" class="mobile-nav-link" (click)="mobileMenuOpen.set(false)">How It Works</a>
            <a routerLink="/#pricing" class="mobile-nav-link" (click)="mobileMenuOpen.set(false)">Pricing</a>
          </nav>
          <div class="mobile-actions">
            @if (authService.isAuthenticated()) {
              <app-button variant="primary" [fullWidth]="true" routerLink="/customer/dashboard">
                Go to Dashboard
              </app-button>
            } @else {
              <app-button variant="outline" [fullWidth]="true" routerLink="/login">
                Sign In
              </app-button>
              <app-button variant="primary" [fullWidth]="true" routerLink="/register">
                Get Started
              </app-button>
            }
          </div>
        </div>
      }
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }

    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: var(--navbar-height);
      background: transparent;
      z-index: var(--z-navbar);
      transition: all var(--transition-normal);
    }

    .navbar.is-scrolled {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--border);
    }

    :host-context(.dark) .navbar.is-scrolled {
      background: rgba(17, 24, 39, 0.9);
      border-color: var(--gray-700);
    }

    .navbar-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      text-decoration: none;
      color: var(--text-primary);
    }

    .brand-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: var(--primary-500);
      border-radius: var(--radius-lg);
      color: white;
    }

    .brand-icon .material-icons-outlined {
      font-size: 1.25rem;
    }

    .brand-text {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
    }

    .navbar-nav {
      display: flex;
      align-items: center;
      gap: var(--space-6);
    }

    @media (max-width: 767px) {
      .navbar-nav {
        display: none;
      }
    }

    .nav-link {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-secondary);
      text-decoration: none;
      transition: color var(--transition-fast);
    }

    .nav-link:hover {
      color: var(--primary-500);
    }

    .navbar-actions {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    @media (max-width: 767px) {
      .navbar-actions {
        display: none;
      }
    }

    .mobile-menu-btn {
      display: none;
      padding: var(--space-2);
      color: var(--text-primary);
    }

    @media (max-width: 767px) {
      .mobile-menu-btn {
        display: flex;
      }
    }

    .mobile-menu-btn .material-icons-outlined {
      font-size: 1.5rem;
    }

    .mobile-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: var(--space-4);
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    :host-context(.dark) .mobile-menu {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .mobile-nav {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .mobile-nav-link {
      padding: var(--space-3);
      font-size: var(--font-size-base);
      color: var(--text-primary);
      text-decoration: none;
      border-radius: var(--radius-md);
    }

    .mobile-nav-link:hover {
      background: var(--gray-100);
    }

    :host-context(.dark) .mobile-nav-link:hover {
      background: var(--gray-700);
    }

    .mobile-actions {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }
  `],
})
export class PublicNavbarComponent {
  authService = inject(AuthService);

  isScrolled = signal(false);
  mobileMenuOpen = signal(false);

  constructor() {
    effect(() => {
      const onScroll = () => {
        this.isScrolled.set(window.scrollY > 20);
      };
      window.addEventListener('scroll', onScroll);
      return () => window.removeEventListener('scroll', onScroll);
    });
  }
}
