import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  if (authService.hasStoredToken()) {
    try {
      const user = await authService.me();

      if (user) {
        return true;
      }
    } catch (err) {
      console.error('Auth guard session check failed:', err);
    }
  }

  router.navigate(['/login'], { queryParams: { redirect: state.url } });
  return false;
};
