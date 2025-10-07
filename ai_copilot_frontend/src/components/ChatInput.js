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
  const textareaRef = React.useRef(null);

  // Debug logging
  React.useEffect(() => {
    console.log('ChatInput state:', { disabled, hasMessage: message.length > 0 });
  }, [disabled, message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    
    console.log('Submit attempt:', { trimmedMessage, disabled });
    
    if (trimmedMessage && !disabled) {
      console.log('✅ Sending message:', trimmedMessage);
      onSendMessage(trimmedMessage);
      setMessage('');
    } else {
      console.log('❌ Submit blocked:', { hasMessage: !!trimmedMessage, disabled });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e) => {
    console.log('Input change:', e.target.value.length, 'chars');
    setMessage(e.target.value);
  };

  const handleFocus = (e) => {
    console.log('✅ Textarea focused');
  };

  const handleClick = (e) => {
    console.log('✅ Textarea clicked');
  };

  return (
    <div className="chat-input-container">
      <form onSubmit={handleSubmit} className="chat-input-form">
        <textarea
          ref={textareaRef}
          className="chat-input"
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onClick={handleClick}
          placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
          disabled={disabled}
          rows="1"
          autoComplete="off"
          spellCheck="true"
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
