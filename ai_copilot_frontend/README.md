# AI Copilot Frontend

React-based web interface for the AI Copilot application. Provides a clean, responsive chat interface with markdown rendering and code syntax highlighting for interacting with AI assistance powered by Google Gemini.

## Features

- **Modern Chat Interface**: Clean, minimalist design following Ocean Professional theme
- **Markdown Support**: Rich text rendering for AI responses
- **Code Syntax Highlighting**: Beautiful code blocks with language-specific highlighting
- **Session Management**: Maintains conversation context across messages
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Interaction**: Instant message sending and AI response display

## Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher
- Running backend API (see backend README)

## Installation

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Configure Environment Variables**

   A `.env` file should already exist. If not, create it from the example:
   
   ```bash
   cp .env.example .env
   ```

   The `.env` file should contain:

   ```
   REACT_APP_BACKEND_URL=http://localhost:3001
   ```

   **Note**: For production deployments, update this URL to point to your backend API endpoint.

## Running the Frontend

Start the development server on port 3000:

```bash
npm start
```

The application will automatically open in your browser at `http://localhost:3000`.

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `REACT_APP_BACKEND_URL` | Backend API base URL | Yes | `http://localhost:3001` |

**Important**: Environment variables prefixed with `REACT_APP_` are embedded at build time. If you change them, restart the development server.

## Backend Integration

The frontend communicates with the backend API using three main operations:

1. **Create Session**: Initialize a new chat conversation
2. **Send Message**: Submit user input and receive AI response
3. **Get History**: Retrieve previous messages in a session

All API calls are handled through `src/services/api.js`, which reads the backend URL from `process.env.REACT_APP_BACKEND_URL`.

### CORS Configuration

The backend must allow requests from `http://localhost:3000`. This is already configured in the backend's `src/api/main.py`. If you deploy to a different domain, update the backend's CORS settings accordingly.

## Verification Instructions

Follow these steps to verify the complete application flow:

### 1. Ensure Backend is Running

Make sure the backend is running on port 3001:

```bash
# In the backend directory
uvicorn src.api.main:app --host 0.0.0.0 --port 3001
```

Verify at: `http://localhost:3001/docs`

### 2. Start the Frontend

```bash
npm start
```

Browser should open at: `http://localhost:3000`

### 3. Create a Session

- The app automatically creates a new session when it loads
- Look for "Session ID" displayed in the chat interface
- Check browser console for: `Session created: [session-id]`

### 4. Send a Message

- Type a message in the input box at the bottom
- Click "Send" or press Enter
- Your message should appear in the chat area

### 5. See AI Response

- After a moment, the AI's response should appear below your message
- The response should be properly formatted with markdown
- Code blocks (if any) should have syntax highlighting

### 6. Retrieve History (Optional)

- Open browser developer console (F12)
- Run: `// Check localStorage for session persistence`
- Send multiple messages and verify conversation flow is maintained

### Verification Checklist

- [ ] Frontend loads without errors at `http://localhost:3000`
- [ ] Session is created automatically (check console logs)
- [ ] Can type and send messages
- [ ] AI responses appear correctly
- [ ] Markdown formatting renders properly
- [ ] Code blocks have syntax highlighting
- [ ] Conversation history is maintained
- [ ] No CORS errors in browser console
- [ ] Responsive design works on different screen sizes

## Project Structure

```
ai_copilot_frontend/
├── public/
│   ├── index.html           # HTML template
│   └── favicon.ico          # App icon
├── src/
│   ├── components/
│   │   ├── ChatWindow.js    # Main chat interface component
│   │   ├── Message.js       # Individual message display
│   │   └── InputBox.js      # User input component
│   ├── services/
│   │   └── api.js           # Backend API integration
│   ├── App.js               # Root application component
│   ├── App.css              # Global styles
│   └── index.js             # Application entry point
├── package.json             # Dependencies and scripts
├── .env.example             # Environment variable template
├── .env                     # Environment configuration (local)
└── README.md                # This file
```

## Available Scripts

### `npm start`

Runs the app in development mode at `http://localhost:3000`.

The page will reload when you make changes. You may also see lint errors in the console.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

The build is minified and optimized for best performance. Files include hashes for caching.

### `npm run eject`

**Note**: This is a one-way operation. Once you eject, you can't go back!

If you need full control over the build configuration, you can eject. This copies all configuration files and dependencies into your project.

## Customization

### Theme Colors

The application uses the Ocean Professional theme defined in `src/App.css`:

```css
:root {
  --primary: #374151;
  --secondary: #9CA3AF;
  --success: #10B981;
  --error: #EF4444;
  --background: #FFFFFF;
  --surface: #F9FAFB;
  --text: #111827;
}
```

### Adding New Components

1. Create component file in `src/components/`
2. Import and use in `App.js` or other components
3. Add styles in component file or `App.css`

## Troubleshooting

### Error: "Cannot connect to backend"

**Solution**: 
- Verify the backend is running on port 3001
- Check `REACT_APP_BACKEND_URL` in `.env` is correct
- Ensure no firewall is blocking the connection

### CORS Error in Console

**Solution**: 
- Backend must have `http://localhost:3000` in its CORS allow list
- Verify backend's `src/api/main.py` CORS configuration
- Restart the backend after CORS changes

### Environment Variables Not Working

**Solution**: 
- Ensure variable names start with `REACT_APP_`
- Restart the development server after changing `.env`
- Variables are embedded at build time, not runtime

### Blank Page on Load

**Solution**: 
- Check browser console for JavaScript errors
- Verify all dependencies are installed: `npm install`
- Clear browser cache and reload

## Development Tips

- Use React DevTools browser extension for debugging
- Check Network tab in browser DevTools to monitor API calls
- Console logs in `api.js` help track request/response flow
- Hot reload works for most changes, but restart for env var changes

## Learn More

- [React Documentation](https://reactjs.org/)
- [Create React App Documentation](https://create-react-app.dev/)
- [FastAPI CORS Documentation](https://fastapi.tiangolo.com/tutorial/cors/)

## License

This project is part of the AI Copilot application suite.
