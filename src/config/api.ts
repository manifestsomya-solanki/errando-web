// API Configuration
// Read environment from .env file
const NODE_ENV = import.meta.env.VITE_NODE_ENV ;

// API Base URLs from environment variables
const API_BASE_URLS = {
  development: import.meta.env.VITE_API_BASE_URL_DEVELOPMENT,
  production: import.meta.env.VITE_API_BASE_URL_PRODUCTION,
  staging: import.meta.env.VITE_API_BASE_URL_STAGING
};

// Current API Base URL based on environment
export const API_BASE_URL = API_BASE_URLS[NODE_ENV as keyof typeof API_BASE_URLS];

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}/${endpoint}`;
};

// Common API endpoints
export const API_ENDPOINTS = {
  // User related
  USER_LOGIN: 'user/login',
  USER_SEND_OTP: 'user/send-otp',
  USER_VERIFY_OTP: 'user/verify-otp',
  USER_REGISTER: 'user/register',
  USER_DETAIL: 'user/detail',
  USER_EDIT: 'user/edit',
  USER_LOGOUT: 'user/logout',
  USER_DELETE: 'user/delete',
  USER_DELETE_PROFILE: 'user/delete-profile',
  
  // Business related
  BUSINESSES: 'businesses',
  BUSINESSES_CREATE: 'businesses/create',
  BUSINESSES_DETAIL: 'businesses/detail',
  BUSINESSES_EDIT: 'businesses/edit',
  BUSINESSES_DELETE: 'businesses/delete',
  BUSINESSES_COUNT: 'businesses/count',
  
  // Services related
  SERVICES: 'services',
  BUSINESS_SERVICES: 'business-services',
  BUSINESS_SERVICES_CREATE: 'business-services/create',
  BUSINESS_SERVICES_EDIT: 'business-services',
  BUSINESS_SERVICES_DELETE: 'business-services',
  
  // User requests
  USER_REQUESTS: 'user-requests',
  USER_REQUESTS_ADD: 'user-requests/add',
  USER_REQUESTS_EDIT: 'user-requests/edit',
  USER_REQUESTS_DETAIL: 'user-requests',
  USER_REQUESTS_SHOW_INTEREST: 'user-requests/show-interest',
  USER_REQUESTS_SHOW_INTEREST_ALL: 'user-requests/show-interest-all',
  USER_REQUESTS_REQUEST_QUOTE: 'user-requests/request-quote',
  USER_REQUESTS_CLOSE: 'user-requests/close',
  USER_REQUESTS_LEAD_DELETE: 'user-requests/lead-delete',
  
  // Reviews
  REVIEWS: 'reviews',
  REVIEWS_CREATE: 'reviews/create',
  REVIEWS_EDIT: 'reviews/edit',
  REVIEWS_DELETE: 'reviews/delete',
  REVIEWS_FLAG: 'reviews/flag',
  REVIEWS_ADD_RESPONSE: 'reviews/addresponse',
  REVIEWS_DETAIL: 'reviews',
  
  // Notifications
  NOTIFICATION: 'notification',
  NOTIFICATION_CREATE: 'notification/create',
  NOTIFICATION_EDIT: 'notification/edit',
  
  // Settings
  SETTINGS_CHANGE_PASSWORD: 'settings/change-password',
  
  // Chat
  CHAT_SEND_NOTIFICATION: 'chat/send-notification',
  CHAT_DELETE: 'chat/delete',
  
  // Quotes
  QUOTES_CREATE: 'quotes/create',
  QUOTES_EDIT: 'quotes/edit',
  
  // Notes
  NOTE: 'note',
  NOTE_ADD: 'note/add',
  
  // Postcodes
  POSTCODES: 'postcodes',
  POSTCODES_VALIDATE: 'postcodes/validate',
  
  // Questions
  QUESTIONS: 'questions',
  QUESTIONS_SUGGEST: 'questions/suggest',
  
  // Forgot password
  FORGOT_PASSWORD: 'user/forgot-password'
};
