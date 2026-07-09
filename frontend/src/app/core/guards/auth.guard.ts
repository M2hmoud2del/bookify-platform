import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

const DEV_MODE = true; // Set to false in production

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Development bypass - allows access without auth for testing
  // roleGuard will set the appropriate mock user based on the route
  if (DEV_MODE) {
    return true;
  }

  const isAuthenticated = authService.isAuthenticated();
  const user = authService.user();

  if (!isAuthenticated || !user) {
    const { data: { session } } = await (await import('../config/supabase.config')).supabase.auth.getSession();

    if (session) {
      return true;
    }

    router.navigate(['/login'], { queryParams: { redirect: window.location.pathname } });
    return false;
  }

  return true;
};
