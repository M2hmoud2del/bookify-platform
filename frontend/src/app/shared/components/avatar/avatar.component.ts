import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.css',
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
