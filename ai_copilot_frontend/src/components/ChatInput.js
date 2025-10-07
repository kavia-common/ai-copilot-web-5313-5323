import React, { useState } from 'react';
import './ChatInput.css';

// PUBLIC_INTERFACE
/**
 * ChatInput Component
 * 
 * Provides a text input field and send button for users to submit messages.
 * Handles Enter key submission and prevents empty messages.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSendMessage - Callback function when message is sent
 * @param {boolean} props.disabled - Whether the input is disabled (e.g., during API call)
 * @returns {JSX.Element} - Rendered chat input component
 */
const ChatInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="chat-input-container">
      <form onSubmit={handleSubmit} className="chat-input-form">
        <textarea
          className="chat-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
          disabled={disabled}
          rows="1"
        />
        <button
          type="submit"
          className="send-button"
          disabled={disabled || !message.trim()}
          aria-label="Send message"
        >
          {disabled ? '⏳' : '📤'}
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
