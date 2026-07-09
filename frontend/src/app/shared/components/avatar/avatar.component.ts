import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="avatar"
      [ngClass]="{
        'avatar-xs': size() === 'xs',
        'avatar-sm': size() === 'sm',
        'avatar-lg': size() === 'lg',
        'avatar-xl': size() === 'xl'
      }"
      [style.background-color]="backgroundColor()"
    >
      @if (src() && !imageError) {
        <img
          [src]="src()"
          [alt]="alt()"
          class="avatar-image"
          (error)="onImageError()"
        />
      } @else {
        <span class="avatar-initials" [style.color]="textColor()">
          {{ initials() }}
        </span>
      }
      @if (status()) {
        <span
          class="avatar-status"
          [ngClass]="{
            'status-online': status() === 'online',
            'status-busy': status() === 'busy',
            'status-away': status() === 'away',
            'status-offline': status() === 'offline'
          }"
        ></span>
      }
    </div>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }

    .avatar {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full);
      overflow: hidden;
      flex-shrink: 0;
    }

    .avatar-xs {
      width: 24px;
      height: 24px;
    }

    .avatar-sm {
      width: 32px;
      height: 32px;
    }

    .avatar-lg {
      width: 48px;
      height: 48px;
    }

    .avatar-xl {
      width: 64px;
      height: 64px;
    }

    .avatar-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-initials {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
    }

    .avatar-xs .avatar-initials {
      font-size: var(--font-size-xs);
    }

    .avatar-lg .avatar-initials {
      font-size: var(--font-size-base);
    }

    .avatar-xl .avatar-initials {
      font-size: var(--font-size-lg);
    }

    .avatar-status {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 25%;
      height: 25%;
      min-width: 8px;
      min-height: 8px;
      border-radius: var(--radius-full);
      border: 2px solid var(--surface);
    }

    .status-online {
      background: var(--success-500);
    }

    .status-busy {
      background: var(--danger-500);
    }

    .status-away {
      background: var(--warning-500);
    }

    .status-offline {
      background: var(--gray-400);
    }
  `],
})
export class AvatarComponent {
  src = input<string>();
  alt = input<string>('');
  name = input<string>('');
  size = input<AvatarSize>('md');
  status = input<'online' | 'busy' | 'away' | 'offline'>();

  imageError = false;

  initials = computed(() => {
    const n = this.name();
    if (!n) return '';

    const names = n.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`;
    }
    return n.substring(0, 2);
  });

  backgroundColor = computed(() => {
    const colors = [
      '#FFE4E6', '#FEF3C7', '#DBEAFE', '#E0E7FF', '#F0FDF4',
      '#FCE7F3', '#E6F7EF', '#FFF1F2', '#ECFDF5', '#F3E8FF'
    ];
    const n = this.name();
    if (!n) return colors[0];

    let hash = 0;
    for (let i = 0; i < n.length; i++) {
      hash = n.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  });

  textColor = computed(() => {
    const darkColors = ['#4338CA', '#475569', '#166534', '#9333EA', '#15795A'];
    const n = this.name();
    if (!n) return darkColors[0];

    let hash = 0;
    for (let i = 0; i < n.length; i++) {
      hash = n.charCodeAt(i) + ((hash << 5) - hash);
    }
    return darkColors[Math.abs(hash) % darkColors.length];
  });

  onImageError(): void {
    this.imageError = true;
  }
}
