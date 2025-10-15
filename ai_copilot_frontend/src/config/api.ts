//
// Centralized API configuration helper for the frontend
//
// Purpose:
// - Provide a single source of truth for the backend API base URL
// - Prefer environment variable override while supporting runtime injection
// - Avoid hardcoding URLs across the codebase
//
// Usage:
//   import { getApiBaseUrl } from './config/api';
//   const BASE_URL = getApiBaseUrl();
//
// Notes:
// - For Create React App, variables must be prefixed with REACT_APP_
// - We support window.__BACKEND_URL__ to allow runtime overrides without rebuilds
// - Default fallback points to the provided URL in task requirements
//
 // PUBLIC_INTERFACE
export function getApiBaseUrl(): string {
  /**
   * Returns the backend API base URL.
   * Order of precedence:
   * 1) window.__BACKEND_URL__ (injected at runtime, if present)
   * 2) process.env.FRONTEND_BACKEND_BASE_URL (new single source for this project)
   * 3) process.env.REACT_APP_BACKEND_URL (backward compatibility)
   * 4) Default fallback to provided URL (must be API root, not /docs)
   */
  try {
    // Runtime injection support
    // @ts-ignore - window may have property added at runtime
    if (typeof window !== 'undefined' && (window as any).__BACKEND_URL__) {
      const url = (window as any).__BACKEND_URL__;
      console.log('[Config] ✅ Using window.__BACKEND_URL__:', url);
      return url;
    }

    // Preferred environment variable for this project
    if (process.env.FRONTEND_BACKEND_BASE_URL) {
      console.log(
        '[Config] ✅ Using process.env.FRONTEND_BACKEND_BASE_URL:',
        process.env.FRONTEND_BACKEND_BASE_URL
      );
      return String(process.env.FRONTEND_BACKEND_BASE_URL);
    }

    // Backward compatibility for existing setups (CRA-style)
    if (process.env.REACT_APP_BACKEND_URL) {
      console.log('[Config] ✅ Using process.env.REACT_APP_BACKEND_URL:', process.env.REACT_APP_BACKEND_URL);
      return String(process.env.REACT_APP_BACKEND_URL);
    }

    // Default fallback (server root, not /docs)
    const fallback = 'https://vscode-internal-13141-beta.beta01.cloud.kavia.ai:3001';
    console.log('[Config] ✅ Using default backend URL (provided):', fallback);
    return fallback;
  } catch (e) {
    // In case anything unexpected happens, keep a safe default
    const fallback = 'https://vscode-internal-13141-beta.beta01.cloud.kavia.ai:3001';
    console.warn('[Config] ⚠️ Fallback to default due to error reading config:', (e as Error)?.message || e);
    return fallback;
  }
}

// PUBLIC_INTERFACE
export function getHealthCheckUrl(): string {
  /** Return the URL to call for health checks (root of the backend). */
  const base = getApiBaseUrl();
  // Ensure we don't end with double slash
  return base ? `${base}/` : '/';
}
