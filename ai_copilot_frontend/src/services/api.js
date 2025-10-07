/**
 * API Service Layer
 * 
 * Handles all communication with the AI Copilot backend API.
 * Includes functions for session management and chat operations.
 */

// Get backend URL from environment variable with fallback
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

// Log the backend URL being used (helpful for debugging)
console.log('🔗 Backend URL configured:', BACKEND_URL);
console.log('🌍 Environment:', process.env.NODE_ENV);

/**
 * Handle API errors consistently
 * @param {Response} response - Fetch API response object
 * @returns {Promise<Object>} - Parsed JSON response
 * @throws {Error} - Throws error with message from API or status text
 */
const handleResponse = async (response) => {
  console.log(`📡 Response status: ${response.status} ${response.statusText}`);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.detail || response.statusText || 'API request failed';
    console.error('❌ API Error:', errorMessage);
    throw new Error(errorMessage);
  }
  
  const data = await response.json();
  console.log('✅ API Response:', data);
  return data;
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
  console.log('📤 Creating new session...');
  console.log('🔗 Request URL:', `${BACKEND_URL}/api/sessions`);
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error('❌ Error creating session:', error.message);
    
    // Check if it's a network error
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error(`Cannot connect to backend at ${BACKEND_URL}. Please ensure the backend is running and CORS is configured correctly.`);
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
  console.log('📤 Sending message to AI...');
  console.log('🔗 Request URL:', `${BACKEND_URL}/api/chat`);
  console.log('📝 Session ID:', sessionId);
  console.log('💬 Message:', message.substring(0, 50) + '...');
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        message: message,
      }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error('❌ Error sending message:', error.message);
    
    // Check if it's a network error
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      throw new Error(`Cannot connect to backend at ${BACKEND_URL}. Please check your connection.`);
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
  try {
    const response = await fetch(`${BACKEND_URL}/api/sessions/${sessionId}/history`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching session history:', error);
    throw error;
  }
};
