//
// JS wrapper for TypeScript API config helper
// Ensures compatibility when importing from JS files under CRA build.
// Re-exports the TypeScript functions so `../config/api` resolves correctly.
//
export { getApiBaseUrl, getHealthCheckUrl } from './api.ts';
