import { Routes } from '@angular/router';
import { PUBLIC_ROUTES } from './core/routes/public.routes';
import { CUSTOMER_ROUTES } from './core/routes/customer.routes';
import { PROVIDER_ROUTES } from './core/routes/provider.routes';

export const routes: Routes = [
  // Public routes (landing, search, provider details, auth)
  ...PUBLIC_ROUTES,

  // Customer routes (dashboard, booking, appointments, profile, etc.)
  ...CUSTOMER_ROUTES,

  // Provider routes (dashboard, calendar, services, working hours, etc.)
  ...PROVIDER_ROUTES,

  // 404 — must be last
  {
    path: '**',
    loadComponent: () => import('./features/public/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
