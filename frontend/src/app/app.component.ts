import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';
import { ToastContainerComponent } from './shared/components/toast/toast-container/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent],
  templateUrl: './app.component.html',
})
export class App implements OnInit {
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);

  async ngOnInit(): Promise<void> {
    await this.authService.checkSession();
  }
}
