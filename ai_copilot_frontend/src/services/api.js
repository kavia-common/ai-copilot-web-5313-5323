/**
 * API Service Layer
 * 
 * Handles all communication with the AI Copilot backend API.
 * Includes functions for session management and chat operations.
 */

/**
 * Backend base URL resolution with prioritized fallbacks:
 * 1) window.__BACKEND_URL__ (runtime injection)
 * 2) process.env.REACT_APP_BACKEND_BASE_URL (preferred for CRA)
 * 3) process.env.REACT_APP_BACKEND_URL (backward compatibility)
 * Active override: hardcoded to new backend URL as requested.
 *
 * Note: Environment variable scaffolding is preserved below (commented)
 * to allow easy reversion to env-driven configuration if needed.
 */
let BASE_URL;

// Prefer runtime-injected value, then CRA env vars, finally fall back to requested default URL
if (typeof window !== 'undefined' && window.__BACKEND_URL__) {
  BASE_URL = window.__BACKEND_URL__;
  console.log('[API] ✅ Using window.__BACKEND_URL__:', BASE_URL);
} else if (process.env.REACT_APP_BACKEND_BASE_URL) {
  BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;
  console.log('[API] ✅ Using process.env.REACT_APP_BACKEND_BASE_URL:', BASE_URL);
} else if (process.env.REACT_APP_BACKEND_URL) {
  BASE_URL = process.env.REACT_APP_BACKEND_URL;
  console.log('[API] ✅ Using process.env.REACT_APP_BACKEND_URL:', BASE_URL);
} else {
  BASE_URL = 'https://vscode-internal-32145-beta.beta01.cloud.kavia.ai:3001';
  console.log('[API] ✅ Using default BASE_URL (requested):', BASE_URL);
}

console.log('[API] 🔗 Final BASE_URL configured:', BASE_URL || '(empty)');
console.log('[API] 🌍 Environment:', process.env.NODE_ENV);

// Export BASE_URL for use in health checks
export const getBaseUrl = () => BASE_URL;

/**
 * Create an AbortController with timeout for network requests
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {AbortController}
 */
const createTimeoutController = (timeoutMs = 30000) => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller;
};

/**
 * Handle API errors consistently
 * @param {Response} response - Fetch API response object
 * @returns {Promise<Object>} - Parsed JSON response
 * @throws {Error} - Throws error with message from API or status text
 */
const handleResponse = async (response) => {
  console.log(`[API] 📡 Response status: ${response.status} ${response.statusText}`);
  
  if (!response.ok) {
    let errorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || response.statusText || 'API request failed';
    } catch {
      errorMessage = response.statusText || `HTTP ${response.status} error`;
    }
    console.error('[API] ❌ API Error:', errorMessage);
    throw new Error(errorMessage);
  }
  
  const data = await response.json();
  console.log('[API] ✅ API Response:', data);
  return data;
};

// PUBLIC_INTERFACE
/**
 * Health check - ping the backend root endpoint
 * 
 * @returns {Promise<Object>} - Health check response
 * @example
 * const health = await healthCheck();
 */
export const healthCheck = async () => {
  console.log('[API] 🏥 Performing health check...');
  const url = BASE_URL ? `${BASE_URL}/` : '/';
  console.log('[API] 🔗 Health check URL:', url);
  
  try {
    const controller = createTimeoutController(10000); // 10s timeout for health check
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
      mode: 'cors',
      signal: controller.signal,
    });
    
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('[API] ✅ Health check successful:', data);
    return data;
  } catch (error) {
    console.error('[API] ❌ Health check failed:', error.message);
    
    if (error.name === 'AbortError') {
      throw new Error('Health check timeout - backend may be slow or unreachable');
    }
    
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error(`Cannot connect to backend at ${BASE_URL || 'same-origin'}. Network error or CORS issue.`);
    }
    
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Create a new chat session
 * 
 * @returns {Promise<Object>} - Response containing session_id
 * @example
 * const { session_id } = await createSession();
 */
export const createSession = async () => {
  console.log('[API] 📤 Creating new session...');
  const url = BASE_URL ? `${BASE_URL}/api/sessions` : '/api/sessions';
  console.log('[API] 🔗 Request URL:', url);
  
  try {
    const controller = createTimeoutController(30000); // 30s timeout
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
      mode: 'cors',
      signal: controller.signal,
    });
    return handleResponse(response);
  } catch (error) {
    console.error('[API] ❌ Error creating session:', error.message);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - backend took too long to respond');
    }
    
    // Check if it's a network error
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error(`Cannot connect to backend at ${BASE_URL || 'same-origin'}. Please ensure the backend is running and CORS is configured correctly.`);
    }
    
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Send a message to the AI assistant
 * 
 * @param {string} sessionId - The current session ID
 * @param {string} message - The user's message content
 * @returns {Promise<Object>} - Response containing session_id and reply
 * @example
 * const { reply } = await sendMessage(sessionId, "Hello AI!");
 */
export const sendMessage = async (sessionId, message) => {
  console.log('[API] 📤 Sending message to AI...');
  const url = BASE_URL ? `${BASE_URL}/api/chat` : '/api/chat';
  console.log('[API] 🔗 Request URL:', url);
  console.log('[API] 📝 Session ID:', sessionId);
  console.log('[API] 💬 Message:', message.substring(0, 50) + (message.length > 50 ? '...' : ''));
  
  try {
    const controller = createTimeoutController(30000); // 30s timeout
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
      mode: 'cors',
      body: JSON.stringify({
        session_id: sessionId,
        message: message,
      }),
      signal: controller.signal,
    });
    return handleResponse(response);
  } catch (error) {
    console.error('[API] ❌ Error sending message:', error.message);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - AI is taking too long to respond');
    }
    
    // Check if it's a network error
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error(`Cannot connect to backend at ${BASE_URL || 'same-origin'}. Network error or CORS issue.`);
    }
    
    throw error;
  }
};

// PUBLIC_INTERFACE
/**
 * Retrieve the message history for a session
 * 
 * @param {string} sessionId - The session ID to retrieve history for
 * @returns {Promise<Object>} - Response containing session_id and messages array
 * @example
 * const { messages } = await getSessionHistory(sessionId);
 * // messages: [{ role: "user", content: "..." }, { role: "assistant", content: "..." }]
 */
export const getSessionHistory = async (sessionId) => {
  console.log('[API] 📤 Fetching session history...');
  const url = BASE_URL ? `${BASE_URL}/api/sessions/${sessionId}/history` : `/api/sessions/${sessionId}/history`;
  console.log('[API] 🔗 Request URL:', url);
  
  try {
    const controller = createTimeoutController(30000); // 30s timeout
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
      mode: 'cors',
      signal: controller.signal,
    });
    return handleResponse(response);
  } catch (error) {
    console.error('[API] ❌ Error fetching session history:', error.message);
    
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - backend took too long to respond');
    }
    
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error(`Cannot connect to backend at ${BASE_URL || 'same-origin'}. Network error.`);
    }
    
    throw error;
  }
};
