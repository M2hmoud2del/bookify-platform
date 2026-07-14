import { Component, contentChild, TemplateRef, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  title = input<string>();
  hoverable = input(false);
  clickable = input(false);

  header = contentChild<TemplateRef<unknown>>('cardHeader');
  footerContent = contentChild<TemplateRef<unknown>>('cardFooter');
}
