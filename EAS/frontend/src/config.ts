export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Derived from API URL to ensure consistency in production
export const UPLOADS_BASE_URL = API_BASE_URL.replace('/api', '/uploads');
