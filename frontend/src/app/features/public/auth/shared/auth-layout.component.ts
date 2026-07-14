import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
})
export class AuthLayoutComponent {
  title       = input.required<string>();
  subtitle    = input<string>();
  imageUrl    = input('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200');
  quote       = input('Bookify has completely transformed how I manage my appointments. It\'s intuitive, fast, and my clients love it.');
  quoteAuthor = input('Sarah Johnson, Beauty Salon Owner');
}
