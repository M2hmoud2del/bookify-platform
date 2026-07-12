import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="auth-shell">
      <!-- Form panel -->
      <div class="auth-panel">
        <div class="auth-panel-inner">

          <!-- Brand -->
          <a routerLink="/" class="auth-brand" aria-label="Go to homepage">
            <span class="brand-icon">
              <span class="material-icons-outlined">calendar_month</span>
            </span>
            <span class="brand-name">Bookify</span>
          </a>

          <!-- Heading slot -->
          <div class="auth-heading">
            <h1 class="auth-title">{{ title() }}</h1>
            @if (subtitle()) {
              <p class="auth-subtitle">{{ subtitle() }}</p>
            }
          </div>

          <!-- Content -->
          <ng-content />

        </div>
      </div>

      <!-- Image panel -->
      <div class="auth-visual" [style.background-image]="'url(' + imageUrl() + ')'">
        <div class="visual-overlay">
          <div class="visual-content">
            <div class="visual-quote">
              <span class="quote-icon material-icons-outlined">format_quote</span>
              <p class="quote-text">{{ quote() }}</p>
              <p class="quote-author">— {{ quoteAuthor() }}</p>
            </div>

            <div class="visual-stats">
              <div class="stat">
                <span class="stat-value">10k+</span>
                <span class="stat-label">Active Users</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat">
                <span class="stat-value">98%</span>
                <span class="stat-label">Satisfaction</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat">
                <span class="stat-value">50k+</span>
                <span class="stat-label">Bookings Made</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; }

    .auth-shell {
      display: grid;
      grid-template-columns: 1fr;
      min-height: 100vh;
    }

    @media (min-width: 1024px) {
      .auth-shell {
        grid-template-columns: 1fr 1fr;
      }
    }

    /* ── Form panel ── */
    .auth-panel {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-8) var(--space-5);
      background: var(--background);
    }

    @media (min-width: 768px) {
      .auth-panel { padding: var(--space-12) var(--space-8); }
    }

    .auth-panel-inner {
      width: 100%;
      max-width: 460px;
    }

    /* Brand */
    .auth-brand {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      text-decoration: none;
      margin-bottom: var(--space-8);
    }

    .brand-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
      border-radius: var(--radius-xl);
      color: #fff;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35);
      transition: box-shadow var(--transition-fast);
    }

    .auth-brand:hover .brand-icon {
      box-shadow: 0 6px 18px rgba(79, 70, 229, 0.45);
    }

    .brand-icon .material-icons-outlined { font-size: 1.375rem; }

    .brand-name {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      letter-spacing: -0.01em;
    }

    /* Heading */
    .auth-heading { margin-bottom: var(--space-7); }

    .auth-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      letter-spacing: -0.02em;
      line-height: 1.2;
      margin: 0 0 var(--space-2);
    }

    .auth-subtitle {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      line-height: 1.5;
      margin: 0;
    }

    /* ── Image panel ── */
    .auth-visual {
      display: none;
      position: relative;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    @media (min-width: 1024px) {
      .auth-visual { display: block; }
    }

    .visual-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        160deg,
        rgba(15, 23, 42, 0.55) 0%,
        rgba(79, 70, 229, 0.65) 100%
      );
      display: flex;
      align-items: flex-end;
      padding: var(--space-10);
    }

    .visual-content { width: 100%; }

    .visual-quote {
      margin-bottom: var(--space-8);
    }

    .quote-icon {
      font-size: 2.5rem;
      color: rgba(255, 255, 255, 0.5);
      display: block;
      margin-bottom: var(--space-3);
    }

    .quote-text {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-medium);
      color: #fff;
      line-height: 1.6;
      margin: 0 0 var(--space-3);
    }

    .quote-author {
      font-size: var(--font-size-sm);
      color: rgba(255, 255, 255, 0.7);
      margin: 0;
    }

    .visual-stats {
      display: flex;
      align-items: center;
      gap: var(--space-6);
      padding: var(--space-5) var(--space-6);
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: var(--radius-2xl);
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-1);
    }

    .stat-value {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: #fff;
      line-height: 1;
    }

    .stat-label {
      font-size: var(--font-size-xs);
      color: rgba(255, 255, 255, 0.7);
      white-space: nowrap;
    }

    .stat-divider {
      width: 1px;
      height: 32px;
      background: rgba(255, 255, 255, 0.2);
    }
  `],
})
export class AuthLayoutComponent {
  title       = input.required<string>();
  subtitle    = input<string>();
  imageUrl    = input('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200');
  quote       = input('Bookify has completely transformed how I manage my appointments. It\'s intuitive, fast, and my clients love it.');
  quoteAuthor = input('Sarah Johnson, Beauty Salon Owner');
}
