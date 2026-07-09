import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-main">
          <div class="footer-brand">
            <a routerLink="/" class="brand-link">
              <span class="brand-icon">
                <span class="material-icons-outlined">calendar_month</span>
              </span>
              <span class="brand-name">Bookify</span>
            </a>
            <p class="brand-description">
              The smart appointment scheduling platform for modern businesses. Manage bookings, customers, and payments all in one place.
            </p>
            <div class="social-links">
              <a href="#" class="social-link" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" class="social-link" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.969c0-1.424-.03-3.258-1.987-3.258-1.987 0-2.294 1.551-2.294 3.153v5.078h-3.554v-10.24h3.414v1.507h.049c.476-.9 1.637-1.85 3.371-1.85 3.601 0 4.267 2.37 4.267 5.455v5.124zM5.587 6.683c-1.14 0-2.062-.926-2.062-2.064-.001-1.137.922-2.063 2.062-2.063 1.138 0 2.06.926 2.06 2.063 0 1.138-.922 2.064-2.06 2.064zm1.782 13.769H3.804v-10.24h3.565v10.24zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" class="social-link" aria-label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>

          <div class="footer-links">
            <div class="footer-section">
              <h4 class="footer-heading">Product</h4>
              <nav class="footer-nav">
                <a routerLink="/#features" class="footer-link">Features</a>
                <a routerLink="/#pricing" class="footer-link">Pricing</a>
                <a routerLink="/#integrations" class="footer-link">Integrations</a>
                <a routerLink="/#updates" class="footer-link">Updates</a>
              </nav>
            </div>

            <div class="footer-section">
              <h4 class="footer-heading">Resources</h4>
              <nav class="footer-nav">
                <a href="#" class="footer-link">Documentation</a>
                <a href="#" class="footer-link">Help Center</a>
                <a href="#" class="footer-link">API Reference</a>
                <a href="#" class="footer-link">Community</a>
              </nav>
            </div>

            <div class="footer-section">
              <h4 class="footer-heading">Company</h4>
              <nav class="footer-nav">
                <a href="#" class="footer-link">About</a>
                <a href="#" class="footer-link">Blog</a>
                <a href="#" class="footer-link">Careers</a>
                <a href="#" class="footer-link">Contact</a>
              </nav>
            </div>

            <div class="footer-section">
              <h4 class="footer-heading">Legal</h4>
              <nav class="footer-nav">
                <a href="#" class="footer-link">Privacy</a>
                <a href="#" class="footer-link">Terms</a>
                <a href="#" class="footer-link">Security</a>
                <a href="#" class="footer-link">Cookies</a>
              </nav>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p class="copyright">
            &copy; {{ currentYear }} Bookify. All rights reserved.
          </p>
          <div class="footer-bottom-links">
            <a href="#" class="footer-bottom-link">Status</a>
            <span class="divider">•</span>
            <a href="#" class="footer-bottom-link">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
    }

    .footer {
      background: var(--gray-900);
      color: var(--gray-300);
      padding: var(--space-16) 0 var(--space-8);
    }

    :host-context(.dark) .footer {
      background: var(--gray-950, #020617);
    }

    .footer-container {
      max-width: var(--max-content-width);
      margin: 0 auto;
      padding: 0 var(--space-4);
    }

    @media (min-width: 768px) {
      .footer-container {
        padding: 0 var(--space-6);
      }
    }

    .footer-main {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-10);
    }

    @media (min-width: 768px) {
      .footer-main {
        grid-template-columns: 2fr 3fr;
      }
    }

    .footer-brand {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .brand-link {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      color: white;
      text-decoration: none;
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

    .brand-name {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
    }

    .brand-description {
      font-size: var(--font-size-sm);
      color: var(--gray-400);
      line-height: var(--line-height-relaxed);
      max-width: 320px;
    }

    .social-links {
      display: flex;
      gap: var(--space-3);
      margin-top: var(--space-2);
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: var(--gray-800);
      border-radius: var(--radius-lg);
      color: var(--gray-400);
      transition: all var(--transition-fast);
    }

    .social-link:hover {
      background: var(--gray-700);
      color: white;
    }

    .footer-links {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-8);
    }

    @media (min-width: 768px) {
      .footer-links {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .footer-section {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .footer-heading {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: white;
      margin: 0;
    }

    .footer-nav {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .footer-link {
      font-size: var(--font-size-sm);
      color: var(--gray-400);
      text-decoration: none;
      transition: color var(--transition-fast);
    }

    .footer-link:hover {
      color: white;
    }

    .footer-bottom {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      margin-top: var(--space-12);
      padding-top: var(--space-8);
      border-top: 1px solid var(--gray-800);
    }

    @media (min-width: 768px) {
      .footer-bottom {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }

    .copyright {
      font-size: var(--font-size-sm);
      color: var(--gray-500);
    }

    .footer-bottom-links {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .footer-bottom-link {
      font-size: var(--font-size-sm);
      color: var(--gray-500);
      text-decoration: none;
      transition: color var(--transition-fast);
    }

    .footer-bottom-link:hover {
      color: var(--gray-300);
    }

    .divider {
      color: var(--gray-600);
    }
  `],
})
export class FooterComponent {
  authService = inject(AuthService);

  currentYear = new Date().getFullYear();
}
