import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './ChatMessage.css';

// PUBLIC_INTERFACE
/**
 * ChatMessage Component
 * 
 * Displays a single chat message with markdown rendering and code syntax highlighting.
 * Supports both user and assistant messages with different styling.
 * 
 * @param {Object} props - Component props
 * @param {string} props.role - Message role: "user" or "assistant"
 * @param {string} props.content - Message content (supports markdown)
 * @returns {JSX.Element} - Rendered chat message
 */
const ChatMessage = ({ role, content }) => {
  return (
    <div className={`chat-message ${role}`}>
      <div className="message-content">
        <div className="message-role">
          {role === 'user' ? '👤 You' : '🤖 AI Assistant'}
        </div>
        <div className="message-text">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
