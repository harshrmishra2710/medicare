/**
 * MindCare AI — Frontend API Configuration
 *
 * In development (local Vite):
 *   VITE_API_BASE_URL is empty by default. Relative paths like '/api/chat'
 *   are handled by Vite's proxy (pointing to http://localhost:8000).
 *
 * In production (Vercel):
 *   VITE_API_BASE_URL is configured in Vercel environment variables
 *   pointing to the deployed FastAPI backend (e.g. https://mindcare-ai-backend.onrender.com).
 */

const RAW_API_BASE = (import.meta.env.VITE_API_BASE_URL || '').trim();
export const API_BASE_URL = RAW_API_BASE.replace(/\/$/, '');

export const apiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!API_BASE_URL) {
    return cleanEndpoint;
  }
  return `${API_BASE_URL}${cleanEndpoint}`;
};

export default apiUrl;
