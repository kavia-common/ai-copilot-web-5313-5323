import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import DebugPanel from './components/DebugPanel';
import { createSession, sendMessage } from './services/api';

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
  const messagesEndRef = useRef(null);

  // Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      console.log('🚀 Initializing chat session...');
      try {
        const { session_id } = await createSession();
        console.log('✅ Session created successfully:', session_id);
        setSessionId(session_id);
        // Add welcome message
        setMessages([
          {
            role: 'assistant',
            content: '👋 Hello! I\'m your AI Copilot. I can help you with writing, summarizing, brainstorming, and coding. What would you like to work on today?',
          },
        ]);
      } catch (err) {
        console.error('❌ Session initialization error:', err);
        // Create a temporary session ID to allow typing even if backend is down
        const tempSessionId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        console.log('⚠️ Using temporary session ID:', tempSessionId);
        setSessionId(tempSessionId);
        setError('Backend connection failed. Messages will be queued locally.');
        // Still show welcome message
        setMessages([
          {
            role: 'assistant',
            content: '👋 Hello! I\'m your AI Copilot. Note: Backend connection failed, but you can still type messages.',
          },
        ]);
      }
    };

    initSession();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // PUBLIC_INTERFACE
  /**
   * Handle sending a new message
   * 
   * @param {string} messageText - The message content to send
   */
  const handleSendMessage = async (messageText) => {
    if (!sessionId || isLoading) return;

    // Add user message to UI
    const userMessage = { role: 'user', content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Send message to backend and get AI response
      const { reply } = await sendMessage(sessionId, messageText);
      
      // Add assistant response to UI
      const assistantMessage = { role: 'assistant', content: reply };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError('Failed to get response. Please try again.');
      console.error('Message send error:', err);
      
      // Add error message to UI
      const errorMessage = {
        role: 'assistant',
        content: '⚠️ Sorry, I encountered an error processing your request. Please try again.',
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
          <p className="app-subtitle">Your intelligent assistant for writing, coding, and more</p>
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

        {/* Input area */}
        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading || !sessionId} />

        {/* Debug Panel - Remove in production */}
        <DebugPanel sessionId={sessionId} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
}

export default App;
