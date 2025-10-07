# AI Copilot - Verification Guide

## Fixes Implemented

### 1. Backend URL Configuration
- **Fixed**: Robust BASE_URL detection with multiple fallbacks
  - Priority 1: `window.__BACKEND_URL__` (runtime injection for preview environments)
  - Priority 2: `process.env.REACT_APP_BACKEND_URL` (build-time environment variable)
  - Priority 3: Empty string (same-origin relative paths)
- **Tagged logging**: All API logs now use `[API]` prefix for easy filtering

### 2. CORS Configuration (Backend)
- **Fixed**: Updated backend CORS to support preview environments
  - Using `allow_origin_regex` to match `*.cloud.kavia.ai` and `*.kavia.ai` domains
  - Set `allow_credentials=False` for better cross-origin compatibility
  - Allows all methods and headers: `allow_methods=['*']`, `allow_headers=['*']`

### 3. Health Check Endpoint
- **Added**: `GET /` endpoint returns `{"status": "healthy", "message": "..."}`
- **Frontend**: Health check performed on app load
- **UI Feedback**: Connection status displayed in header (Connecting/Connected/Connection Issues)

### 4. Network Timeouts
- **Added**: 30-second timeout for all API requests
- **Better Error Messages**: Distinguishes between timeout, network error, and API error
- **AbortController**: Properly cancels long-running requests

### 5. Input Always Enabled
- **Fixed**: Chat input is NEVER disabled based on `sessionId`
- **Only disabled during**: Active loading state (while sending message)
- **Lazy Session Creation**: If no session exists when sending first message, session is created automatically
- **User Experience**: Users can always type, even if backend is temporarily unavailable

### 6. Error Handling & User Feedback
- **Specific Error Messages**: Different messages for different error types
  - "Failed to fetch" → Network/CORS issue
  - "Timeout" → Request took too long
  - API errors → Display the actual error from backend
- **Error Display**: Non-blocking error banner with close button
- **AI Error Responses**: Gemini API errors are displayed in chat with clear instructions

### 7. Debug Panel
- **Enhanced**: Shows backend URL, health status, session state, and input element diagnostics
- **Real-time**: Updates automatically to help diagnose issues
- **Removable**: Can be hidden in production by removing the component

## Verification Steps

### Step 1: Verify Backend is Running

```bash
# Check backend health
curl -k https://vscode-internal-11461-beta.beta01.cloud.kavia.ai:3001/

# Expected response:
# {"status":"healthy","message":"AI Copilot Backend API is running"}
```

### Step 2: Verify Frontend is Accessible

```bash
# Check frontend
curl -I -k https://vscode-internal-11461-beta.beta01.cloud.kavia.ai:3000

# Expected: HTTP/2 200
```

### Step 3: Open Frontend in Browser

1. Navigate to: `https://vscode-internal-11461-beta.beta01.cloud.kavia.ai:3000`
2. Open browser DevTools (F12)
3. Check Console for:
   ```
   [API] ✅ Using process.env.REACT_APP_BACKEND_URL: https://...
   [API] 🔗 Final BASE_URL configured: https://...
   [API] 🏥 Performing health check...
   [API] ✅ Health check successful: {...}
   [App] ✅ Backend is healthy
   [App] 🚀 Initializing chat session...
   [App] ✅ Session created successfully: ...
   ```

### Step 4: Test Chat Input

1. **Verify input is clickable**:
   - Click in the text area
   - Type some text
   - Should see: `[ChatInput] ✅ Textarea focused` in console

2. **Send a test message**:
   - Type "Hello"
   - Press Enter or click Send button
   - Should see in console:
     ```
     [App] 📤 Sending message: Hello...
     [API] 📤 Sending message to AI...
     [API] ✅ API Response: {...}
     [App] ✅ Received reply from backend
     ```

3. **Verify AI response**:
   - AI response should appear in chat window
   - Response should be properly formatted with markdown

### Step 5: Test Error Scenarios

#### Test 1: Backend Unreachable
1. Stop the backend: `kill -9 <backend-pid>`
2. Refresh frontend
3. **Expected behavior**:
   - Header shows "Connection Issues ⚠️"
   - Error banner displays: "Backend connectivity issue: ..."
   - Input remains ENABLED
   - Welcome message still displays with note about connection

#### Test 2: Invalid Gemini API Key
1. Backend returns 503 error
2. **Expected behavior**:
   - Message appears in chat
   - AI response shows error: "Gemini API is not configured..."
   - Error banner shows specific error message
   - Input remains enabled for retry

#### Test 3: Timeout
1. Gemini API takes > 30 seconds
2. **Expected behavior**:
   - Request times out after 30 seconds
   - Error message: "Request timeout - AI is taking too long to respond"
   - User can retry

### Step 6: Verify Cross-Origin Functionality

1. **Check CORS headers** in Network tab:
   - Requests should have `Access-Control-Allow-Origin` header
   - No CORS errors in console

2. **Test from different origin** (if applicable):
   - Preview URLs should work: `*.cloud.kavia.ai:3000`
   - Production URLs should work: `*.kavia.ai:3000`

### Step 7: End-to-End Flow

Complete flow test:

1. ✅ Frontend loads
2. ✅ Health check succeeds → "Connected ✓"
3. ✅ Session created automatically
4. ✅ Welcome message displays
5. ✅ Input is enabled and focusable
6. ✅ Type message → logs show input changes
7. ✅ Send message → network request visible in DevTools
8. ✅ AI response appears in chat
9. ✅ Send another message → conversation continues
10. ✅ Check Debug Panel → all states are correct

## Console Log Examples

### Successful Flow
```
[API] ✅ Using process.env.REACT_APP_BACKEND_URL: https://vscode-internal-11461-beta.beta01.cloud.kavia.ai:3001
[API] 🔗 Final BASE_URL configured: https://vscode-internal-11461-beta.beta01.cloud.kavia.ai:3001
[API] 🌍 Environment: development
[App] 🏥 Starting health check...
[API] 🏥 Performing health check...
[API] 🔗 Health check URL: https://vscode-internal-11461-beta.beta01.cloud.kavia.ai:3001/
[API] 📡 Response status: 200 OK
[API] ✅ API Response: {status: "healthy", message: "AI Copilot Backend API is running"}
[API] ✅ Health check successful: {status: "healthy", ...}
[App] ✅ Backend is healthy
[App] 🚀 Initializing chat session...
[API] 📤 Creating new session...
[API] 🔗 Request URL: https://vscode-internal-11461-beta.beta01.cloud.kavia.ai:3001/api/sessions
[API] 📡 Response status: 200 OK
[API] ✅ API Response: {session_id: "..."}
[App] ✅ Session created successfully: ...
[ChatInput] State: {disabled: false, hasMessage: 0}
```

### Error Flow (Backend Down)
```
[API] ✅ Using process.env.REACT_APP_BACKEND_URL: https://vscode-internal-11461-beta.beta01.cloud.kavia.ai:3001
[App] 🏥 Starting health check...
[API] 🏥 Performing health check...
[API] ❌ Health check failed: Cannot connect to backend at https://... Network error or CORS issue.
[App] ❌ Health check failed: Cannot connect to backend...
[App] ⏸️ Skipping session init - health check not passed
```

## Debug Panel Information

The debug panel (bottom-right corner) shows:

```
🔧 DEBUG PANEL

Backend Connection:
  Base URL: https://vscode-internal-11461-beta.beta01.cloud.kavia.ai:3001
  Health: ✅ HEALTHY

App State:
  SessionID: ✅ 76af2dc3-e616-4dff-b16b-e90c8c4c574e...
  Loading: ✅ false
  Error: ✅ none
  Input Disabled: ✅ NO

Input Element:
  Exists: ✅ true
  Disabled: ✅ false
  ReadOnly: ✅ false
  Pointer Events: auto
  Z-Index: 102
  Cursor: text
  Is input? ✅ YES
```

## Environment Variables

### Frontend (.env)
```
REACT_APP_BACKEND_URL=https://vscode-internal-11461-beta.beta01.cloud.kavia.ai:3001
REACT_APP_GEMINI_API_KEY=<your-key>
```

### Backend (.env)
```
GEMINI_API_KEY=<your-key>
```

## Common Issues & Solutions

### Issue: "Failed to fetch"
**Cause**: CORS or network connectivity
**Solution**: 
1. Check backend CORS configuration
2. Verify backend URL is correct
3. Check network/firewall settings

### Issue: Input not clickable
**Cause**: Z-index or pointer-events issue
**Solution**: Check Debug Panel → Input Element section
- Should show: `Pointer Events: auto`, `Is input? YES`

### Issue: 504 Gateway Timeout
**Cause**: Gemini API taking too long
**Solution**: 
1. Check Gemini API key is valid
2. Network may be slow
3. Try again - timeout is now 30s

### Issue: Session creation failed
**Cause**: Backend endpoint issue
**Solution**: App will allow lazy session creation on first message send

## Success Criteria

All items must be ✅:

- [ ] Frontend loads without errors
- [ ] Health check succeeds (header shows "Connected ✓")
- [ ] Session is created automatically
- [ ] Chat input is enabled and responsive
- [ ] User can type messages
- [ ] Messages are sent successfully
- [ ] AI responses appear in chat
- [ ] Errors are displayed clearly without blocking input
- [ ] Debug panel shows correct states
- [ ] Console logs use [API] tags
- [ ] CORS works across preview domains
- [ ] Lazy session creation works if initial session fails

## Performance Notes

- Health check: ~100-200ms
- Session creation: ~100-200ms
- Message send: 2-10 seconds (depends on Gemini API)
- Timeout: 30 seconds max per request

## Production Deployment Notes

1. **Remove Debug Panel**: Delete `<DebugPanel />` from App.js
2. **Remove console.logs**: Consider using a logger that can be disabled in production
3. **Set production backend URL**: Update `.env` with production URL
4. **Test CORS**: Ensure production domain is in backend's `allow_origin_regex`
5. **SSL/TLS**: Ensure HTTPS is used in production
