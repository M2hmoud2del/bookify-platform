import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicProvider } from '../shared/public.models';

@Component({
  selector: 'app-provider-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './provider-about.component.html',
  styleUrl: './provider-about.component.css',
})
export class ProviderAboutComponent {
  provider = input.required<PublicProvider>();

  allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
}
