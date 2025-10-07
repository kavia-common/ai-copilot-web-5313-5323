import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
/**
 * DebugPanel Component
 * 
 * Displays real-time debugging information about the app state
 * to help diagnose input blocking issues.
 * 
 * @param {Object} props - Component props
 * @param {string} props.sessionId - Current session ID
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message if any
 * @returns {JSX.Element} - Rendered debug panel
 */
const DebugPanel = ({ sessionId, isLoading, error }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [elementInfo, setElementInfo] = useState({});

  useEffect(() => {
    // Check the chat input element
    const checkInput = () => {
      const input = document.querySelector('.chat-input');
      if (input) {
        const rect = input.getBoundingClientRect();
        const styles = window.getComputedStyle(input);
        const elementAtCenter = document.elementFromPoint(
          rect.left + rect.width / 2,
          rect.top + rect.height / 2
        );

        setElementInfo({
          exists: true,
          disabled: input.disabled,
          readOnly: input.readOnly,
          pointerEvents: styles.pointerEvents,
          zIndex: styles.zIndex,
          position: styles.position,
          display: styles.display,
          visibility: styles.visibility,
          opacity: styles.opacity,
          cursor: styles.cursor,
          elementAtCenter: elementAtCenter ? elementAtCenter.className : 'none',
          isInputAtCenter: elementAtCenter === input,
          rect: {
            top: Math.round(rect.top),
            left: Math.round(rect.left),
            width: Math.round(rect.width),
            height: Math.round(rect.height)
          }
        });
      } else {
        setElementInfo({ exists: false });
      }
    };

    // Check immediately and after a delay
    checkInput();
    const timer = setTimeout(checkInput, 1000);
    return () => clearTimeout(timer);
  }, [sessionId, isLoading]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          padding: '8px 12px',
          background: '#374151',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          zIndex: 10000,
          fontSize: '12px'
        }}
      >
        Show Debug
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      maxWidth: '400px',
      maxHeight: '80vh',
      overflow: 'auto',
      background: 'rgba(0, 0, 0, 0.9)',
      color: '#00ff00',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '11px',
      fontFamily: 'monospace',
      zIndex: 10000,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <strong style={{ color: '#00ffff' }}>🔧 DEBUG PANEL</strong>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#ff6666',
            cursor: 'pointer',
            fontSize: '16px',
            padding: 0
          }}
        >
          ×
        </button>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <div style={{ color: '#ffff00', marginBottom: '5px' }}>App State:</div>
        <div>SessionID: {sessionId ? '✅ ' + sessionId.substring(0, 20) + '...' : '❌ null'}</div>
        <div>Loading: {isLoading ? '⏳ true' : '✅ false'}</div>
        <div>Error: {error ? '❌ ' + error : '✅ none'}</div>
        <div>Disabled: {isLoading || !sessionId ? '❌ YES' : '✅ NO'}</div>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <div style={{ color: '#ffff00', marginBottom: '5px' }}>Input Element:</div>
        {elementInfo.exists ? (
          <>
            <div>Exists: ✅ true</div>
            <div>Disabled: {elementInfo.disabled ? '❌ true' : '✅ false'}</div>
            <div>ReadOnly: {elementInfo.readOnly ? '❌ true' : '✅ false'}</div>
            <div>Pointer Events: {elementInfo.pointerEvents}</div>
            <div>Z-Index: {elementInfo.zIndex}</div>
            <div>Cursor: {elementInfo.cursor}</div>
            <div>Position: {elementInfo.position}</div>
            <div>Visibility: {elementInfo.visibility}</div>
            <div>Opacity: {elementInfo.opacity}</div>
            <div style={{ marginTop: '5px', color: '#ffaa00' }}>Center Check:</div>
            <div>Element at center: {elementInfo.elementAtCenter}</div>
            <div>Is input? {elementInfo.isInputAtCenter ? '✅ YES' : '❌ NO (BLOCKED!)'}</div>
            {elementInfo.rect && (
              <>
                <div style={{ marginTop: '5px', color: '#ffaa00' }}>Dimensions:</div>
                <div>Top: {elementInfo.rect.top}px, Left: {elementInfo.rect.left}px</div>
                <div>Size: {elementInfo.rect.width}x{elementInfo.rect.height}px</div>
              </>
            )}
          </>
        ) : (
          <div>❌ Input element not found!</div>
        )}
      </div>

      <div style={{ marginTop: '10px', fontSize: '10px', color: '#888' }}>
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default DebugPanel;
