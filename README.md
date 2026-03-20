# NextStep-AI: LinuxONE Deployment & Administration Guide

This document outlines the specific procedures for deploying, managing, and troubleshooting the NextStep-AI full-stack application on the IBM LinuxONE (s390x architecture) environment.

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
NextStep-AI/
├── docker-compose.yml           # Main orchestration file
├── .gitignore                   # Files to exclude from Git (node_modules, .env)
│
├── backend/                     # Node.js Express API
│   ├── controllers/
│   │   └── aiController.js      # AI logic (Gemini API & PDF Parsing)
│   ├── models/
│   │   ├── User.js              # MongoDB User Schema
│   │   └── Session.js           # Interview Session Schema
│   ├── utils/
│   │   └── prompts.js           # AI Prompt Templates
│   ├── .env                     # API Keys (LOCAL ONLY - DO NOT GIT PUSH)
│   ├── Dockerfile               # Backend container instructions
│   ├── package.json             # Backend dependencies (pdf-parse, etc.)
│   └── server.js                # API Entry point
│
├── frontend/
│   └── interview-prep-ai/       # React Application
│       ├── src/                 # React components and logic
│       ├── public/              # Static assets
│       ├── nginx.conf           # Custom Nginx config (SPA routing fix)
│       ├── Dockerfile           # Frontend container instructions
│       ├── package.json         # Frontend dependencies
│       └── vite.config.js       # Build tool configuration
│
└── documentation/               # Guides and Manuals
    └── README.md       # LinuxONE deployment instructions
```

## Prerequisites

- **Node.js** v18+ (tested with v23)
- **npm** v9+
- **MongoDB** running locally or a MongoDB Atlas connection string
- **Gemini API key** (free) — get one at https://aistudio.google.com/apikey

## Deployment Process

Ensure your LinuxONE instance has the necessary runtimes:

### 1. Environment Preparation

```bash
sudo apt update
sudo apt install docker.io docker-compose-v2 git -y
```

### 2. Configuration (Essential)

Before building, ensure the following configuration files are in place to handle the Linux environment's networking:

### A. Nginx Routing Fix (Preventing 404s)

The file frontend/interview-prep-ai/nginx.conf must contain the try_files directive to support React Router on refresh:

```bash
location / {
    root /usr/share/nginx/html;
    index index.html index.htm;
    try_files $uri $uri/ /index.html;
}
```
### B. Backend Environment

Create backend/.env with your API keys:

```bash
PORT=5001
MONGO_URI=your_mongodb_uri
GEMINI_API_KEY=your_key_here
```

## Build & Execution Commands

On LinuxONE, we use targeted builds to ensure architecture compatibility.

### Full Stack Initial Start

```bash
sudo docker compose up -d --build --no-cache
```
### Targeted Service Updates

```bash
sudo docker compose build --no-cache nextstep-api
sudo docker compose up -d nextstep-api
sudo docker compose build --no-cache nextstep-ui
sudo docker compose up -d nextstep-ui
```

## Maintenance & Troubleshooting

```bash
# View backend logs
sudo docker logs -f nextstep-api

# View frontend/nginx logs
sudo docker logs -f frontend
```

## Common LinuxONE Issues

1. Service Names: Always use nextstep-ui and nextstep-api for build commands as defined in the docker-compose.yml services block.

2. Persistence: Ensure Docker volumes are mapped correctly if using a local MongoDB container to prevent data loss on container restarts.

3. Port Binding: Ensure ports 80 (Frontend) and 5001 (API) are open in your LinuxONE security groups/firewall.

## Git Workflow for LinuxONE

To keep your production environment in sync with your development:

1. Stage Changes: git add .

2. Commit: git commit -m "Description of LinuxONE optimization"

3. Push: git push origin main

4. Pull on Server: git pull origin main followed by the build commands above.

