# NextStepAI

An AI-powered interview preparation app. Enter your target role, experience level, and topics — the app generates tailored interview questions and detailed answers using Google Gemini AI. Pin questions, add notes, and explore concept explanations to ace your interviews.

## Tech Stack

| Layer    | Technology                                                  |
| -------- | ----------------------------------------------------------- |
| Frontend | React 19, Vite, Tailwind CSS, React Router, Axios          |
| Backend  | Node.js, Express 5, Mongoose, JWT, bcryptjs                |
| AI       | Google Gemini API (`@google/genai`)                         |
| Database | MongoDB                                                     |
| Storage  | Cloudinary (profile photos — optional)                      |

## Project Structure

```
NextStepAI/
├── backend/                  # Express API server
│   ├── config/db.js          # MongoDB connection
│   ├── controllers/          # Route handlers (auth, sessions, AI)
│   ├── middlewares/           # JWT auth & file upload middleware
│   ├── models/               # Mongoose schemas (User, Session, Question)
│   ├── routes/               # API route definitions
│   ├── utils/prompts.js      # Gemini prompt templates
│   └── server.js             # App entry point
├── frontend/
│   └── interview-prep-ai/    # Vite + React app
│       ├── src/
│       │   ├── components/   # Reusable UI components
│       │   ├── context/      # React context (user auth state)
│       │   ├── pages/        # Page components (Landing, Dashboard, InterviewPrep)
│       │   └── utils/        # Axios instance, API paths, helpers
│       └── index.html
└── README.md
```

## Prerequisites

- **Node.js** v18+ (tested with v23)
- **npm** v9+
- **MongoDB** running locally or a MongoDB Atlas connection string
- **Gemini API key** (free) — get one at https://aistudio.google.com/apikey

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/noiorhyun/NextStep-AI.git
cd NextStepAI
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/nextstepai
JWT_SECRET=dev-secret-key-12345
BYPASS_AUTH=true
GEMINI_API_KEY=AIzaSyCzsGlGnl2hJFNG3DiXQy6ZBXhM_ClP3oM



> **macOS users:** Port 5000 is used by AirPlay Receiver.
Use port **5001** (or any other open port) instead.
You can also disable AirPlay Receiver in **System Settings → General → AirDrop & Handoff**.

Start the backend:

```bash
npm run dev
```

You should see:

```
Server running on port 5001
MongoDB connected
```

### 3. Set up the Frontend

```bash
cd frontend/interview-prep-ai
npm install
```

Create a `.env` file in the `frontend/interview-prep-ai/` directory:

```env
VITE_API_URL=http://localhost:5001
VITE_BYPASS_AUTH=true
```

> Make sure the port matches the backend `PORT` in your backend `.env`.

Start the frontend:

```bash
npm run dev
```

You should see:

```
VITE v6.x.x  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### 4. Open the app

Visit **http://localhost:5173** in your browser.

1. Click **Login / Sign Up** → create an account
2. Click **Get Started** on the dashboard → fill in role, experience, topics
3. The app generates AI-powered interview questions for you
4. Pin important questions, add personal notes, and explore concepts in depth

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable                  | Required | Description                                      |
| ------------------------- | -------- | ------------------------------------------------ |
| `PORT`                    | No       | Server port (default: `5000`, recommend `5001`)  |
| `MONGO_URI`               | Yes      | MongoDB connection string                        |
| `JWT_SECRET`              | Yes      | Secret key for signing JWT tokens                |
| `GEMINI_API_KEY`          | Yes*     | Google Gemini API key for AI features            |
| `BYPASS_AUTH`             | No       | Set to `true` to skip login (dev mode)           |
| `FRONTEND_URL`            | No       | Allowed CORS origin for production frontend      |
| `CLOUDINARY_CLOUD_NAME`   | No       | Cloudinary cloud name (for profile photo upload) |
| `CLOUDINARY_API_KEY`      | No       | Cloudinary API key                               |
| `CLOUDINARY_API_SECRET`   | No       | Cloudinary API secret                            |

> *If `GEMINI_API_KEY` is missing or the free-tier quota is exhausted, the app automatically falls back to mock interview questions so it still works.

### Frontend (`frontend/interview-prep-ai/.env`)

| Variable           | Required | Description                                       |
| ------------------ | -------- | ------------------------------------------------- |
| `VITE_API_URL`     | Yes      | Backend URL (e.g. `http://localhost:5001`)         |
| `VITE_BYPASS_AUTH` | No       | Set to `true` to skip login screen (dev mode)     |

## API Endpoints

### Auth
| Method | Endpoint              | Auth | Description           |
| ------ | --------------------- | ---- | --------------------- |
| POST   | `/api/auth/register`  | No   | Register a new user   |
| POST   | `/api/auth/login`     | No   | Login & get JWT token |
| GET    | `/api/auth/profile`   | Yes  | Get current user info |

### Sessions
| Method | Endpoint                    | Auth | Description                  |
| ------ | --------------------------- | ---- | ---------------------------- |
| POST   | `/api/sessions/create`      | Yes  | Create session + questions   |
| GET    | `/api/sessions/my-sessions` | Yes  | List all user sessions       |
| GET    | `/api/sessions/:id`         | Yes  | Get session with questions   |
| DELETE | `/api/sessions/:id`         | Yes  | Delete session & questions   |

### Questions
| Method | Endpoint                    | Auth | Description              |
| ------ | --------------------------- | ---- | ------------------------ |
| POST   | `/api/questions/add`        | Yes  | Add questions to session |
| PUT    | `/api/questions/:id/pin`    | Yes  | Pin/unpin a question     |
| PUT    | `/api/questions/:id/note`   | Yes  | Update note on question  |

### AI
| Method | Endpoint                         | Auth | Description                    |
| ------ | -------------------------------- | ---- | ------------------------------ |
| POST   | `/api/ai/generate-questions`     | Yes  | Generate interview Q&A         |
| POST   | `/api/ai/generate-explanation`   | Yes  | Explain a concept in depth     |

## Troubleshooting

| Problem | Solution |
| ------- | -------- |
| `Something went wrong. Please try again.` on login/signup | Make sure `VITE_API_URL` in frontend `.env` matches the backend port and the backend is running |
| Backend shows `Server running on port 5000` but API calls return 404 | macOS AirPlay uses port 5000 — change `PORT` to `5001` in backend `.env` |
| `Failed to generate questions` | Your Gemini API key quota may be exhausted — the app will fall back to mock data automatically. Quota resets daily. |
| `EPERM` / permission errors with `npm` | Try running outside sandboxed environments, or use `sudo` for global installs |
| Profile photo upload fails | Cloudinary env vars are not set — skip photo upload during signup, or configure Cloudinary |

## Dev Mode (Skip Auth)

To bypass login entirely during development:

1. Set `BYPASS_AUTH=true` in `backend/.env`
2. Set `VITE_BYPASS_AUTH=true` in `frontend/interview-prep-ai/.env`
3. Restart both servers

This auto-creates a "Dev User" and skips the login screen.

## License

ISC
