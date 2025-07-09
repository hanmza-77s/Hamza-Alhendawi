# AutoSocial - AI-Powered Social Media Automation

AutoSocial is a full-stack web application that allows users to fully automate the creation and management of Instagram and TikTok accounts using AI.

## Features

- **AI Content Strategy**: Generate complete content strategies using GPT-4
- **Automated Content Creation**: Generate captions, hashtags, images (DALL-E), videos, and music
- **Smart Scheduling**: Intelligent post scheduling system
- **Human-like Automation**: Simulate human behavior with proxy rotation and random delays
- **Auto-engagement**: Automated comment replies with sentiment analysis
- **Analytics Dashboard**: Track performance and engagement metrics

## Tech Stack

- **Frontend**: React + Tailwind CSS + Vite
- **Backend**: FastAPI + SQLite + SQLAlchemy
- **AI Services**: OpenAI GPT-4, DALL-E, and mock APIs for video/music generation
- **Automation**: Playwright for browser automation

## Quick Start

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your OpenAI API key to .env
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173` with the API at `http://localhost:8000`.

## Project Structure

```
autosocial/
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── api/       # API routes
│   │   ├── services/  # Business logic
│   │   ├── ai/        # AI integration
│   │   └── models/    # Database models
├── frontend/          # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
└── README.md
```

## Environment Variables

Create a `.env` file in the backend directory:
```
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=sqlite:///./autosocial.db
SECRET_KEY=your_secret_key_here
```