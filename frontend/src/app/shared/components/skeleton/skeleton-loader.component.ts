import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from './skeleton.component';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  templateUrl: './skeleton-loader.component.html',
  styleUrl: './skeleton-loader.component.css',
})
export class SkeletonLoaderComponent {
  type = input<'card' | 'list' | 'text'>('card');
  count = input(3);

  cards = () => Array.from({ length: this.count() }, (_, i) => i);

  randomWidth(): string {
    const widths = ['100%', '90%', '80%', '70%', '60%', '50%'];
    return widths[Math.floor(Math.random() * widths.length)];
  }
}
