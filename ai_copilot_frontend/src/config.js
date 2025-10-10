//
// Centralized configuration for frontend environment variables
//
// PUBLIC_INTERFACE
/**
 * getBackendUrl
 * Returns the backend API base URL from a single source of truth.
 * Order of precedence:
 * 1) window.__BACKEND_URL__ (runtime injection, if present)
 * 2) process.env.REACT_APP_BACKEND_URL (preferred env var per task instruction)
 * 3) Default to the provided URL:
 *    https://vscode-internal-13559-beta.beta01.cloud.kavia.ai:3001
 *
 * @returns {string} - Backend API base URL
 */
export function getBackendUrl() {
  let url;
  if (typeof window !== 'undefined' && window.__BACKEND_URL__) {
    url = window.__BACKEND_URL__;
    console.log('[Config] ✅ Using window.__BACKEND_URL__:', url);
  } else if (process.env.REACT_APP_BACKEND_URL) {
    url = process.env.REACT_APP_BACKEND_URL;
    console.log('[Config] ✅ Using process.env.REACT_APP_BACKEND_URL:', url);
  } else {
    url = 'https://vscode-internal-13559-beta.beta01.cloud.kavia.ai:3001';
    console.log('[Config] ✅ Using default backend URL (provided):', url);
  }
  return url;
}
