import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { PublicNavbarComponent } from './public-navbar.component';
import { FooterComponent } from './footer.component';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, PublicNavbarComponent, FooterComponent],
  template: `
    <app-public-navbar></app-public-navbar>
    <main class="public-main">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    :host {
      display: block;
    }

    .public-main {
      min-height: calc(100vh - var(--navbar-height) - 400px);
      padding-top: var(--navbar-height);
    }
  `],
})
export class PublicLayoutComponent {}
