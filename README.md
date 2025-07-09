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