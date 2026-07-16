export const API_ENDPOINTS = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    me: '/auth/me',
    updateProfile: '/auth/profile',
  },
  providerProfile: {
    me: '/provider/profile',
  },
  providers: {
    root: '/providers',
    byId: (providerId: string) => `/providers/${providerId}`,
  },
  providerServices: {
    byProvider: (providerId: string) => `/providers/${providerId}/services`,
  },
  services: {
    root: '/services',
    byId: (serviceId: string) => `/services/${serviceId}`,
    status: (serviceId: string) => `/services/${serviceId}/status`,
  },
  uploads: {
    providerProfileImage: '/uploads/provider/profile-image',
    userAvatar: '/uploads/user/avatar',
    serviceImages: (serviceId: string) => `/uploads/services/${serviceId}/images`,
  },
  workingHours: {
    my: '/working-hours/my',
    provider: (providerId: string) => `/working-hours/provider/${providerId}`,
  },
  availability: {
    check: '/availability',
  },
  appointments: {
    root: '/appointments',
    create: '/appointments',
    my: '/appointments/my',
    provider: '/appointments/provider',
    byId: (id: string) => `/appointments/${id}`,
    cancel: (id: string) => `/appointments/${id}/cancel`,
    reject: (id: string) => `/appointments/${id}/reject`,
    complete: (id: string) => `/appointments/${id}/complete`,
    accept: (id: string) => `/appointments/${id}/accept`,
  },
  payments: {
    root: '/payments',
    createCheckoutSession: '/payments/create-checkout-session',
    my: '/payments/my',
  },
  reviews: {
    root: '/reviews',
    create: '/reviews',
    provider: (providerId: string) => `/reviews/provider/${providerId}`,
    my: '/reviews/my',
    byId: (reviewId: string) => `/reviews/${reviewId}`,
  },
  dashboard: {
    root: '/dashboard',
    provider: '/dashboard/provider',
  },
  notifications: {
    root: '/notifications',
    my: '/notifications/my',
  },
} as const;
