import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loader.component.html',
  styleUrl: './skeleton-loader.component.css',
})
export class SkeletonComponent {
  variant = input<'rectangular' | 'circle' | 'text' | 'avatar'>('rectangular');
  width = input<string>();
  height = input<string>();
}

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-card.component.html',
  styleUrl: './skeleton-card.component.css',
})
export class SkeletonCardComponent {}
