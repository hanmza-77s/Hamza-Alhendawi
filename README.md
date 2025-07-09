# AutoSocial

AutoSocial is a full-stack AI-powered automation platform that helps you generate and manage Instagram / TikTok accounts at scale.

## Features
1. AI-generated content strategy, posts, captions & hashtags using GPT-4 (mock fallback).
2. AI media generation (image, video, music) via DALL·E, Runway, Suno/Soundraw (mock placeholders).
3. Smart scheduler & human-like posting automation (proxy, delays, random behaviour – simulated for now).
4. Dashboard UI built with React + Tailwind.
5. FastAPI backend with SQLite storage (easy to swap for Postgres / Firebase).

## Local development

### Back-end
```bash
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn backend.main:app --reload
```
The API server starts on http://localhost:8000.

### Front-end
```bash
cd frontend
npm install
npm run dev
```
The front-end runs on http://localhost:5173 and proxies "/api" calls to the FastAPI server (configure in `vite.config.ts` if needed).

## Deployment

### Production build

1. Build frontend static assets:
```bash
cd frontend
npm install
npm run build
```
This outputs to `frontend/dist`.

2. Serve FastAPI with production server (uvicorn/gunicorn):
```bash
pip install -r requirements.txt
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

(Optionally use gunicorn with uvicorn workers.)

3. Configure a reverse proxy (Nginx) to:
   * Serve `/` from `frontend/dist/` (static files)
   * Proxy `/api` and `/media` to the FastAPI backend.

Example Nginx snippet:
```nginx
server {
  listen 80;
  server_name autosocial.example.com;

  root /var/www/autosocial/frontend/dist;
  index index.html;

  location /api/ {
    proxy_pass http://127.0.0.1:8000/api/;
    proxy_set_header Host $host;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection upgrade;
  }

  location /media/ {
    proxy_pass http://127.0.0.1:8000/media/;
  }

  # Fallback to SPA router
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

### Scheduler background worker

Run the scheduler periodically using cron or a systemd timer:
```bash
#!/bin/bash
curl -X POST http://localhost/api/scheduler/run
```
Or create a Python script importing `scheduler.run_pending` and schedule with supervisord.

### Environment variables
Set in production (e.g., systemd service):
```
OPENAI_API_KEY=sk-...
AUTOSOCIAL_PROXIES="http://proxy1:8000,http://proxy2:8000"
```

### Browser automation
After installing Python deps run:
```bash
playwright install chromium
```
Set `headless` in Settings page to false to debug browser sessions.

## Environment variables
Create a `.env` file (or export in your shell):
```
OPENAI_API_KEY=sk-...
```
If `OPENAI_API_KEY` is missing, the app falls back to mock AI responses so you can explore the UI without external services.

## Project structure
```
backend/
  main.py              # FastAPI application entry-point
  database.py          # SQLAlchemy engine + session
  models.py            # ORM models
  schemas.py           # Pydantic schemas
  routers/             # API route modules
  services/            # AI, scheduler, social automation logic
frontend/
  src/                 # React + Tailwind UI
```

Enjoy automating social media! 🚀