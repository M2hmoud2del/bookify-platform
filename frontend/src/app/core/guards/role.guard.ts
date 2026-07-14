import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../models/user.model';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data?.['role'] as UserRole | UserRole[] | undefined;

  if (!authService.isAuthenticated() && authService.hasStoredToken()) {
    try {
      await authService.me();
    } catch (err) {
      console.error('Role guard session check failed:', err);
    }
  }

  const user = authService.user();

  if (!user) {
    router.navigate(['/login'], { queryParams: { redirect: state.url } });
    return false;
  }

  if (requiredRole && !authService.hasRole(requiredRole)) {
    router.navigate([authService.redirectPathForRole(user.role)]);
    return false;
  }

  return true;
};
