//
//
// JS wrapper for TypeScript API config helper
// Ensures compatibility when importing from JS files under CRA build.
// Re-exports the TypeScript functions so `../config/api` resolves correctly.
// Consumers should import from '../config/api' across the app to keep a single source of truth.
//
export { getApiBaseUrl, getHealthCheckUrl } from './api.ts';
