# Frontend-Backend Connectivity Notes

- Correct backend base URL: https://kavia-alb-2474e9cb-881246245.backend.kavia.app
- Single source of truth for frontend base URL:
  1) window.__BACKEND_URL__ (runtime injection, optional)
  2) REACT_APP_BACKEND_BASE_URL (preferred)
  3) REACT_APP_BACKEND_URL (fallback)
  4) Default hardcoded to the correct ALB URL (as a last-resort default)

To verify connectivity from the workspace root:

1) Health check
   BACKEND_URL=https://kavia-alb-2474e9cb-881246245.backend.kavia.app node ai-copilot-web-5313-5323/test-api-flow.js

2) Browser verification
   - Open: https://vscode-internal-38099-beta.beta01.cloud.kavia.ai:3000
   - Confirm no CORS errors in DevTools console
   - Ensure GET /, POST /api/sessions succeed

Backend CORS:
- Default allow_origin_regex includes:
  - localhost/127.0.0.1
  - https://vscode-internal-31656-beta.beta01.cloud.kavia.ai
  - https://vscode-internal-38099-beta.beta01.cloud.kavia.ai
  - Backend ALB: https://kavia-alb-2474e9cb-881246245.backend.kavia.app
- Can override with CORS_ALLOWED_ORIGINS or CORS_ALLOW_ORIGIN_REGEX envs.

Environment setup:
- Frontend: ai-copilot-web-5313-5323/ai_copilot_frontend/.env
  REACT_APP_BACKEND_BASE_URL=https://kavia-alb-2474e9cb-881246245.backend.kavia.app

- Backend: ai-copilot-web-5313-5322/ai_copilot_backend/.env
  GEMINI_API_KEY=your_gemini_api_key_here
  # Optional:
  # CORS_ALLOWED_ORIGINS=https://vscode-internal-38099-beta.beta01.cloud.kavia.ai:3000
  # CORS_ALLOW_ORIGIN_REGEX=...

Notes:
- /api/chat may fail if GEMINI_API_KEY or model configuration is invalid; that is not a connectivity issue.
