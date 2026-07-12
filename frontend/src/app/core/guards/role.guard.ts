import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

const DEV_MODE = true; // Set to false in production

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data?.['role'] as 'customer' | 'provider' | undefined;

  // Development mode - create/update mock user with appropriate role
  if (DEV_MODE) {
    const currentUser = authService.user();
    const role = requiredRole || 'customer';

    // Only create or update user if no user exists OR if role doesn't match
    if (!currentUser || currentUser.role !== role) {
      authService.user.set({
        _id: `dev-${role}-user-123`,
        name: role === 'provider' ? 'Provider Demo' : 'Customer Demo',
        email: `${role}@bookify.com`,
        role,
        authProvider: 'local',
        phone: undefined,
        avatar: undefined,
        isActive: true,
        deletedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      authService.session.set({ access_token: 'dev-token' });
    }
    return true;
  }

  const user = authService.user();

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  if (requiredRole && user.role !== requiredRole) {
    const redirectRoute = user.role === 'provider' ? '/provider/dashboard' : '/customer/dashboard';
    router.navigate([redirectRoute]);
    return false;
  }

  return true;
};
