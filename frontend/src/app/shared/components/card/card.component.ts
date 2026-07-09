import { Component, contentChild, TemplateRef, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class.card-hoverable]="hoverable()" [class.card-clickable]="clickable()">
      @if (header() || title()) {
        <div class="card-header">
          @if (title()) {
            <h3 class="card-title">{{ title() }}</h3>
          }
          <ng-content select="[card-header]" />
        </div>
      }

      <div class="card-body">
        <ng-content />
      </div>

      @if (footerContent()) {
        <div class="card-footer">
          <ng-content select="[card-footer]" />
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      overflow: hidden;
      transition: all var(--transition-normal);
    }

    :host-context(.dark) .card {
      background: var(--gray-800);
      border-color: var(--gray-700);
    }

    .card-hoverable:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .card-clickable {
      cursor: pointer;
    }

    .card-clickable:active {
      transform: translateY(0);
    }

    .card-header {
      padding: var(--space-4) var(--space-5);
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-3);
    }

    :host-context(.dark) .card-header {
      border-color: var(--gray-700);
    }

    .card-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .card-body {
      padding: var(--space-5);
    }

    .card-footer {
      padding: var(--space-4) var(--space-5);
      border-top: 1px solid var(--border);
      background: var(--gray-50);
    }

    :host-context(.dark) .card-footer {
      border-color: var(--gray-700);
      background: var(--gray-900);
    }
  `],
})
export class CardComponent {
  title = input<string>();
  hoverable = input(false);
  clickable = input(false);

  header = contentChild<TemplateRef<unknown>>('cardHeader');
  footerContent = contentChild<TemplateRef<unknown>>('cardFooter');
}
