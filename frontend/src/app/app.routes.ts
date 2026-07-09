import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    loadComponent: () => import('./features/public/landing/landing.component').then(m => m.LandingComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/public/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/public/auth/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./features/public/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./features/public/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
  },

  // Customer routes
  {
    path: 'customer',
    canActivate: [authGuard, roleGuard],
    data: { role: 'customer' },
    loadComponent: () => import('./layouts/authenticated-layout/authenticated-layout.component').then(m => m.AuthenticatedLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/customer/dashboard/dashboard.component').then(m => m.CustomerDashboardComponent),
      },
      {
        path: 'appointments',
        loadComponent: () => import('./features/customer/appointments/appointments.component').then(m => m.CustomerAppointmentsComponent),
      },
      {
        path: 'appointments/:id',
        loadComponent: () => import('./features/customer/appointment-detail/appointment-detail.component').then(m => m.AppointmentDetailComponent),
      },
      {
        path: 'history',
        loadComponent: () => import('./features/customer/history/history.component').then(m => m.HistoryComponent),
      },
      {
        path: 'payments',
        loadComponent: () => import('./features/customer/payments/payments.component').then(m => m.CustomerPaymentsComponent),
      },
      {
        path: 'reviews',
        loadComponent: () => import('./features/customer/reviews/reviews.component').then(m => m.CustomerReviewsComponent),
      },
      {
        path: 'book',
        loadComponent: () => import('./features/customer/booking/booking.component').then(m => m.BookingComponent),
      },
      {
        path: 'book/:providerId',
        loadComponent: () => import('./features/customer/booking/booking.component').then(m => m.BookingComponent),
      },
      {
        path: 'checkout/success',
        loadComponent: () => import('./features/customer/checkout/checkout-success/checkout-success.component').then(m => m.CheckoutSuccessComponent),
      },
      {
        path: 'checkout/failed',
        loadComponent: () => import('./features/customer/checkout/checkout-failed/checkout-failed.component').then(m => m.CheckoutFailedComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/customer/profile/profile.component').then(m => m.CustomerProfileComponent),
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/customer/notifications/notifications.component').then(m => m.CustomerNotificationsComponent),
      },
    ],
  },

  // Provider routes
  {
    path: 'provider',
    canActivate: [authGuard, roleGuard],
    data: { role: 'provider' },
    loadComponent: () => import('./layouts/authenticated-layout/authenticated-layout.component').then(m => m.AuthenticatedLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/provider/dashboard/dashboard.component').then(m => m.ProviderDashboardComponent),
      },
      {
        path: 'calendar',
        loadComponent: () => import('./features/provider/calendar/calendar.component').then(m => m.CalendarComponent),
      },
      {
        path: 'appointments',
        loadComponent: () => import('./features/provider/appointments/appointments.component').then(m => m.ProviderAppointmentsComponent),
      },
      {
        path: 'services',
        loadComponent: () => import('./features/provider/services/services.component').then(m => m.ServicesComponent),
      },
      {
        path: 'services/create',
        loadComponent: () => import('./features/provider/services/service-form/service-form.component').then(m => m.ServiceFormComponent),
      },
      {
        path: 'services/:id/edit',
        loadComponent: () => import('./features/provider/services/service-form/service-form.component').then(m => m.ServiceFormComponent),
      },
      {
        path: 'working-hours',
        loadComponent: () => import('./features/provider/working-hours/working-hours.component').then(m => m.WorkingHoursComponent),
      },
      {
        path: 'customers',
        loadComponent: () => import('./features/provider/customers/customers.component').then(m => m.CustomersComponent),
      },
      {
        path: 'reviews',
        loadComponent: () => import('./features/provider/reviews/reviews.component').then(m => m.ProviderReviewsComponent),
      },
      {
        path: 'payments',
        loadComponent: () => import('./features/provider/payments/payments.component').then(m => m.ProviderPaymentsComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/provider/profile/profile.component').then(m => m.ProviderProfileComponent),
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/provider/notifications/notifications.component').then(m => m.ProviderNotificationsComponent),
      },
    ],
  },

  // Public booking page for providers
  {
    path: 'book/:providerId',
    loadComponent: () => import('./features/public/booking/booking.component').then(m => m.PublicBookingComponent),
  },

  // Not found
  {
    path: '**',
    loadComponent: () => import('./features/public/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
