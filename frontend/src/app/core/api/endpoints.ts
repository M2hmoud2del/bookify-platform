export const API_ENDPOINTS = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    me: '/auth/me',
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
  },
  payments: {
    root: '/payments',
  },
  reviews: {
    root: '/reviews',
  },
  dashboard: {
    root: '/dashboard',
  },
  notifications: {
    root: '/notifications',
  },
} as const;
