#!/bin/bash
cd /home/kavia/workspace/code-generation/ai-copilot-web-5313-5323/ai_copilot_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

