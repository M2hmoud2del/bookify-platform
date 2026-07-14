export const API_ENDPOINTS = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    me: '/auth/me',
  },
  providers: {
    root: '/providers',
    profile: '/providers/profile',
  },
  services: {
    root: '/services',
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
