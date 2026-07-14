import { Routes } from '@angular/router';
import { PublicLayoutComponent } from '../../layouts/public-layout/public-layout.component';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('../../features/public/landing/landing.component').then(m => m.LandingComponent),
      },
      {
        path: 'providers',
        loadComponent: () => import('../../features/public/search-providers/search-providers.component').then(m => m.SearchProvidersComponent),
      },
      {
        path: 'providers/:id',
        loadComponent: () => import('../../features/public/provider-details/provider-details.component').then(m => m.ProviderDetailsComponent),
      },
      {
        path: 'providers/:providerId/services/:serviceId',
        loadComponent: () => import('../../features/public/service-details/service-details.component').then(m => m.ServiceDetailsComponent),
      },
      {
        path: 'book/:providerId',
        loadComponent: () => import('../../features/public/booking/booking.component').then(m => m.PublicBookingComponent),
      },
    ],
  },

  {
    path: 'login',
    loadComponent: () => import('../../features/public/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('../../features/public/auth/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('../../features/public/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
  },
  {
    path: 'reset-password',
    loadComponent: () => import('../../features/public/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
  },
];
