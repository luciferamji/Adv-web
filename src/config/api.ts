// API Configuration
export const API_BASE_URL = 'http://localhost:3000/api';

// API Endpoints
export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
  UPDATE_DETAILS: '/auth/updatedetails',
  UPDATE_PASSWORD: '/auth/updatepassword',
  
  // Admin
  USERS: '/admin/users',
  USER: (id: string) => `/admin/users/${id}`,
  
  // Advocates
  ADVOCATES: '/advocates',
  ADVOCATE: (id: string) => `/advocates/${id}`,
  
  // Clients
  CLIENTS: '/clients',
  CLIENT: (id: string) => `/clients/${id}`,
  
  // Cases
  CASES: '/cases',
  CASE: (id: string) => `/cases/${id}`,
  CASE_COMMENTS: (id: string) => `/cases/${id}/comments`,
  
  // Hearings
  HEARINGS: '/hearings',
  HEARING: (id: string) => `/hearings/${id}`,
  HEARING_COMMENTS: (id: string) => `/hearings/${id}/comments`,
  
  // Calendar
  CALENDAR: '/calendar',
  CALENDAR_TODAY: '/calendar/today',
  CALENDAR_UPCOMING: '/calendar/upcoming',

  // Dashboard
  DASHBOARD: '/dashboard',
  DASHBOARD_STATS: '/dashboard/stats',
  DASHBOARD_RECENT: '/dashboard/recent',
  
  // Documents
  DOCUMENTS: '/documents',
  DOCUMENT: (id: string) => `/documents/${id}`,
  DOCUMENT_UPLOAD: '/documents/upload',
  
  // Invoices
  INVOICES: '/invoices',
  INVOICE: (id: string) => `/invoices/${id}`,
  INVOICE_GENERATE: (id: string) => `/invoices/${id}/generate`,
  
  // Notifications
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_READ: (id: string) => `/notifications/${id}/read`,
  NOTIFICATION_SETTINGS: '/notifications/settings'
};