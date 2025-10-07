import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import DebugPanel from './components/DebugPanel';
import { createSession, sendMessage, healthCheck, getBaseUrl } from './services/api';

// PUBLIC_INTERFACE
/**
 * Main App Component
 * 
 * Manages the AI Copilot chat application state and lifecycle.
 * Handles session creation, message sending, and UI updates.
 * 
 * @returns {JSX.Element} - The main application component
 */
function App() {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [healthStatus, setHealthStatus] = useState('checking'); // 'checking', 'healthy', 'unhealthy'
  const [pendingMessages, setPendingMessages] = useState([]); // Queue for messages sent before session creation
  const messagesEndRef = useRef(null);

  // Perform health check on mount
  useEffect(() => {
    let isMounted = true;
    
    const performHealthCheck = async () => {
      console.log('[App] 🏥 Starting health check...');
      try {
        await healthCheck();
        if (isMounted) {
          console.log('[App] ✅ Backend is healthy');
          setHealthStatus('healthy');
        }
      } catch (err) {
        console.error('[App] ❌ Health check failed:', err.message);
        if (isMounted) {
          setHealthStatus('unhealthy');
          setError(`Backend connectivity issue: ${err.message}. Backend URL: ${getBaseUrl() || 'same-origin'}`);
        }
      }
    };

    performHealthCheck();

    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize session after health check succeeds
  useEffect(() => {
    let isMounted = true;
    
    const initSession = async () => {
      if (healthStatus !== 'healthy') {
        console.log('[App] ⏸️ Skipping session init - health check not passed');
        return;
      }

      console.log('[App] 🚀 Initializing chat session...');
      try {
        const { session_id } = await createSession();
        console.log('[App] ✅ Session created successfully:', session_id);
        
        if (isMounted) {
          setSessionId(session_id);
          setMessages([
            {
              role: 'assistant',
              content: '👋 Hello! I\'m your AI Copilot. I can help you with writing, summarizing, brainstorming, and coding. What would you like to work on today?',
            },
          ]);
          setError(null); // Clear any previous errors
        }
      } catch (err) {
        console.error('[App] ❌ Session initialization error:', err);
        
        if (isMounted) {
          // Don't block the user - they can still type
          console.log('[App] ⚠️ Session creation failed, but input will remain enabled');
          setError('Session creation failed. You can still type - session will be created when you send your first message.');
          
          // Show welcome message anyway
          setMessages([
            {
              role: 'assistant',
              content: '👋 Hello! I\'m your AI Copilot. Note: Session creation pending, but you can start typing your message.',
            },
          ]);
        }
      }
    };

    initSession();
    
    return () => {
      isMounted = false;
    };
  }, [healthStatus]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // PUBLIC_INTERFACE
  /**
   * Handle sending a new message
   * Attempts lazy session creation if sessionId is null
   * 
   * @param {string} messageText - The message content to send
   */
  const handleSendMessage = async (messageText) => {
    if (isLoading) {
      console.log('[App] ⚠️ Message sending blocked: already loading');
      return;
    }

    console.log('[App] 📤 Sending message:', messageText.substring(0, 50) + '...');

    // Add user message to UI immediately
    const userMessage = { role: 'user', content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    let currentSessionId = sessionId;

    try {
      // Lazy session creation: if no session exists, create one now
      if (!currentSessionId) {
        console.log('[App] 🔄 No session ID - creating session lazily...');
        const { session_id } = await createSession();
        currentSessionId = session_id;
        setSessionId(session_id);
        console.log('[App] ✅ Lazy session created:', session_id);
      }

      // Send message to backend and get AI response
      console.log('[App] 🔄 Calling backend API...');
      const { reply } = await sendMessage(currentSessionId, messageText);
      console.log('[App] ✅ Received reply from backend');
      
      // Add assistant response to UI
      const assistantMessage = { role: 'assistant', content: reply };
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Clear error if message was successful
      setError(null);
    } catch (err) {
      console.error('[App] ❌ Message send error:', err);
      
      // Provide specific error message
      const errorMsg = err.message || 'Unknown error occurred';
      setError(`Failed to get response: ${errorMsg}`);
      
      // Add error message to UI without blocking input
      const errorMessage = {
        role: 'assistant',
        content: `⚠️ Error: ${errorMsg}\n\nPlease check:\n- Backend is running at ${getBaseUrl() || 'same-origin'}\n- CORS is configured correctly\n- API key is valid (if required)\n\nYou can try sending your message again.`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="chat-container">
        {/* Header */}
        <header className="chat-header">
          <h1 className="app-title">🤖 AI Copilot</h1>
          <p className="app-subtitle">
            Your intelligent assistant for writing, coding, and more
            {healthStatus === 'checking' && ' • Connecting...'}
            {healthStatus === 'healthy' && ' • Connected ✓'}
            {healthStatus === 'unhealthy' && ' • Connection Issues ⚠️'}
          </p>
        </header>

        {/* Error banner */}
        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)} className="close-error">×</button>
          </div>
        )}

        {/* Messages area */}
        <div className="messages-container">
          {messages.map((msg, index) => (
            <ChatMessage key={index} role={msg.role} content={msg.content} />
          ))}
          {isLoading && (
            <div className="loading-indicator">
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="loading-text">AI is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area - ALWAYS ENABLED, never disabled based on sessionId */}
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />

        {/* Debug Panel - Remove in production */}
        <DebugPanel 
          sessionId={sessionId} 
          isLoading={isLoading} 
          error={error} 
          healthStatus={healthStatus}
          baseUrl={getBaseUrl()}
        />
      </div>
    </div>
  );
}

export default App;
