import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkeletonVariant = 'rectangular' | 'circle' | 'text' | 'avatar';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.css',
})
export class SkeletonComponent {
  variant = input<SkeletonVariant>('rectangular');
  width = input<string | undefined>(undefined);
  height = input<string | undefined>(undefined);
}

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-card.component.html',
  styleUrl: './skeleton-card.component.css',
})
export class SkeletonCardComponent {}

@Component({
  selector: 'app-skeleton-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-table.component.html',
  styleUrl: './skeleton-table.component.css',
})
export class SkeletonTableComponent {
  columns = input(5);
  rows = input(5);
}

@Component({
  selector: 'app-skeleton-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-list.component.html',
  styleUrl: './skeleton-list.component.css',
})
export class SkeletonListComponent {
  items = input(5);
}
