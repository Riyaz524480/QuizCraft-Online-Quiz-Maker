# QuizCraft — Online Quiz Maker

Copyright © 2026 Riyaz Ahmad. All rights reserved.

A full-stack MERN quiz platform: register/login, create quizzes with multiple-choice questions, browse and take quizzes one question at a time, view scores and correct answers, and see your quiz attempts. Responsive design.

## Requirements
- Node.js 18+ and npm
- MongoDB Atlas connection string or local MongoDB

## Start locally
1. `cd server && npm install`
2. Copy `server/.env.example` to `server/.env`, set `MONGO_URI` and a strong random `JWT_SECRET`.
3. `npm run dev` in `server` (http://localhost:5000).
4. In a second terminal: `cd client && npm install`
5. Copy `client/.env.example` to `client/.env` and set `VITE_API_URL=http://localhost:5000/api` (default already works).
6. `npm run dev` in `client` (http://localhost:5173).

## Deploy
- MongoDB Atlas: create cluster, database user, and configure Network Access for your server.
- Backend on Render: root directory `server`; build `npm install`; start `npm start`; env vars `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your Vercel URL), optionally `PORT`. Do not commit `.env`.
- Frontend on Vercel: root directory `client`; framework Vite; build `npm run build`; output `dist`; env `VITE_API_URL=https://YOUR-RENDER-SERVICE.onrender.com/api`.
- For React routes, `client/vercel.json` provides SPA fallback.
- If you change environment variables, redeploy the respective service.

## Notes
- Only signed-in users can create or take quizzes. Quiz listing is public.
- Correct answers are NOT sent by the quiz-taking API before submission; grading happens on the server.
- Each question has exactly four options and one correct option.
- The author's copyright notice is displayed in the app footer and included in source files.
- For production, add rate limiting, email verification, password reset, tests, and security monitoring as appropriate.
