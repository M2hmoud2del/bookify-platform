import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { roleGuard } from '../guards/role.guard';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: 'customer',
    canActivate: [authGuard, roleGuard],
    data: { role: 'customer' },
    loadComponent: () => import('../../layouts/authenticated-layout/authenticated-layout.component').then(m => m.AuthenticatedLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('../../features/customer/dashboard/dashboard.component').then(m => m.CustomerDashboardComponent),
      },
      {
        path: 'book',
        loadComponent: () => import('../../features/customer/booking/booking.component').then(m => m.BookingComponent),
      },
      {
        path: 'book/:providerId',
        loadComponent: () => import('../../features/customer/booking/booking.component').then(m => m.BookingComponent),
      },
      {
        path: 'appointments',
        loadComponent: () => import('../../features/customer/appointments/appointments.component').then(m => m.CustomerAppointmentsComponent),
      },
      {
        path: 'appointments/:id',
        loadComponent: () => import('../../features/customer/appointment-detail/appointment-detail.component').then(m => m.AppointmentDetailComponent),
      },
      {
        path: 'history',
        loadComponent: () => import('../../features/customer/history/history.component').then(m => m.HistoryComponent),
      },
      {
        path: 'reviews',
        loadComponent: () => import('../../features/customer/reviews/reviews.component').then(m => m.CustomerReviewsComponent),
      },
      {
        path: 'payments',
        loadComponent: () => import('../../features/customer/payments/payments.component').then(m => m.CustomerPaymentsComponent),
      },
      {
        path: 'checkout/success',
        loadComponent: () => import('../../features/customer/checkout/checkout-success/checkout-success.component').then(m => m.CheckoutSuccessComponent),
      },
      {
        path: 'checkout/failed',
        loadComponent: () => import('../../features/customer/checkout/checkout-failed/checkout-failed.component').then(m => m.CheckoutFailedComponent),
      },
      {
        path: 'notifications',
        loadComponent: () => import('../../features/customer/notifications/notifications.component').then(m => m.CustomerNotificationsComponent),
      },
      {
        path: 'profile',
        loadComponent: () => import('../../features/customer/profile/profile.component').then(m => m.CustomerProfileComponent),
      },
      {
        path: 'profile/edit',
        loadComponent: () => import('../../features/customer/profile/edit-profile.component').then(m => m.CustomerEditProfileComponent),
      },
    ],
  },
];
