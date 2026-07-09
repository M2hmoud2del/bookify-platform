import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  template: `
    <div class="not-found">
      <div class="not-found-content">
        <span class="error-code">404</span>
        <h1 class="error-title">Page not found</h1>
        <p class="error-description">
          Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL or the page has been moved.
        </p>
        <div class="error-actions">
          <app-button variant="primary" routerLink="/">
            Go back home
          </app-button>
          <app-button variant="outline" (onClick)="goBack()">
            Go back
          </app-button>
        </div>
      </div>
      <div class="not-found-illustration">
        <img
          src="https://images.pexels.com/photos/28893270/pexels-photo-28893270.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt="Page not found"
        />
      </div>
    </div>
  `,
  styles: [`
    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: var(--space-8);
      text-align: center;
    }

    .not-found-content {
      max-width: 480px;
    }

    .error-code {
      font-size: 8rem;
      font-weight: var(--font-weight-bold);
      color: var(--gray-200);
      line-height: 1;
    }

    :host-context(.dark) .error-code {
      color: var(--gray-700);
    }

    .error-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--space-4);
    }

    .error-description {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      margin: 0 0 var(--space-8);
      line-height: var(--line-height-relaxed);
    }

    .error-actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--space-3);
    }

    .not-found-illustration {
      margin-top: var(--space-8);
      max-width: 300px;
    }

    .not-found-illustration img {
      width: 100%;
      border-radius: var(--radius-2xl);
    }
  `],
})
export class NotFoundComponent {
  goBack(): void {
    window.history.back();
  }
}
