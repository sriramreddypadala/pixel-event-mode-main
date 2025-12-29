const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const MACHINE_ID = import.meta.env.VITE_MACHINE_ID || 'machine-001';
const ENABLE_MOCK_API = import.meta.env.VITE_ENABLE_MOCK_API !== 'false'; // Default to true for development

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  MACHINE_ID,
  ENABLE_MOCK: ENABLE_MOCK_API,
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

console.log('API Config:', {
  ENABLE_MOCK: ENABLE_MOCK_API,
  BASE_URL: API_BASE_URL,
  env: import.meta.env.VITE_ENABLE_MOCK_API,
});

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  MACHINE: {
    GET_CONFIG: '/machine/config',
    UPDATE_MODE: '/machine/mode',
    SYNC_PRINT_COUNT: '/machine/print-count',
    UPDATE_STATUS: '/machine/status',
    GET_MACHINES: '/machine/list',
    // New endpoints
    SESSION_START: '/machine/session/start',
    SESSION_FINALIZE: '/machine/session/finalize',
    PAYMENT_INIT: '/machine/payment/initiate',
    PHOTO_UPLOAD: '/machine/photo/upload',
    PRINT_JOB: '/machine/print',
  },
  CONTENT: {
    UPDATE: '/content/update',
    UPLOAD_VIDEO: '/content/upload/video',
    UPLOAD_IMAGE: '/content/upload/image',
  },
  LAYOUT: {
    GET_ALL: '/layout/list',
    UPDATE: '/layout/update',
    CREATE: '/layout/create',
    DELETE: '/layout/delete',
  },
  ANALYTICS: {
    GET: '/analytics',
    EXPORT: '/analytics/export',
  },
  EVENT: {
    RESET_COUNTER: '/event/reset-counter',
  },
};
