import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { roleGuard } from '../guards/role.guard';

export const PROVIDER_ROUTES: Routes = [
  {
    path: 'provider',
    canActivate: [authGuard, roleGuard],
    data: { role: 'provider' },
    loadComponent: () => import('../../layouts/authenticated-layout/authenticated-layout.component').then(m => m.AuthenticatedLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('../../features/provider/dashboard/dashboard.component').then(m => m.ProviderDashboardComponent),
      },
      {
        path: 'calendar',
        loadComponent: () => import('../../features/provider/calendar/calendar.component').then(m => m.CalendarComponent),
      },
      {
        path: 'appointments',
        loadComponent: () => import('../../features/provider/appointments/appointments.component').then(m => m.ProviderAppointmentsComponent),
      },
      {
        path: 'appointments/:id',
        loadComponent: () => import('../../features/provider/appointments/appointment-detail.component').then(m => m.ProviderAppointmentDetailComponent),
      },
      {
        path: 'services',
        loadComponent: () => import('../../features/provider/services/services.component').then(m => m.ServicesComponent),
      },
      {
        path: 'services/create',
        loadComponent: () => import('../../features/provider/services/service-form/service-form.component').then(m => m.ServiceFormComponent),
      },
      {
        path: 'services/:id/edit',
        loadComponent: () => import('../../features/provider/services/service-form/service-form.component').then(m => m.ServiceFormComponent),
      },
      {
        path: 'working-hours',
        loadComponent: () => import('../../features/provider/working-hours/working-hours.component').then(m => m.WorkingHoursComponent),
      },
      {
        path: 'customers',
        loadComponent: () => import('../../features/provider/customers/customers.component').then(m => m.CustomersComponent),
      },
      {
        path: 'reviews',
        loadComponent: () => import('../../features/provider/reviews/reviews.component').then(m => m.ProviderReviewsComponent),
      },
      {
        path: 'payments',
        loadComponent: () => import('../../features/provider/payments/payments.component').then(m => m.ProviderPaymentsComponent),
      },
      {
        path: 'notifications',
        loadComponent: () => import('../../features/provider/notifications/notifications.component').then(m => m.ProviderNotificationsComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('../../features/provider/profile/profile.component').then(m => m.ProviderProfileComponent),
      },
      {
        path: 'settings',
        redirectTo: 'profile',
        pathMatch: 'full',
      },
      {
        path: 'upload-images',
        loadComponent: () => import('../../features/provider/profile/upload-images.component').then(m => m.UploadImagesComponent),
      },
    ],
  },
];
