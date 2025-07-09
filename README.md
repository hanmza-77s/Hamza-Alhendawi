# AutoSocial - AI-Powered Social Media Automation

A full-stack web application that automates the creation and management of Instagram/TikTok accounts using AI.

## Features

- **AI Content Generation**: GPT-4 powered content strategy, captions, and hashtags
- **Media Generation**: DALL·E images, AI-generated videos, and music
- **Smart Scheduling**: Automated post scheduling and publishing
- **Human Behavior Simulation**: Proxy rotation, random delays, and realistic interactions
- **Analytics Dashboard**: Track performance and engagement metrics
- **Modular Architecture**: Easy to extend with real APIs and services

## Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: SQLite
- **AI Services**: OpenAI GPT-4, DALL·E
- **Automation**: Playwright (simulated)
- **Media Processing**: MoviePy, Runway API (mock)

## Quick Start

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   cd frontend && npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Add your OpenAI API key to .env
   ```

3. Run the application:
   ```bash
   # Start backend
   python main.py
   
   # Start frontend (in another terminal)
   cd frontend && npm start
   ```

4. Open http://localhost:3000 in your browser

## Project Structure

```
autosocial/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   └── services/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
└── README.md
```

## Configuration

The application uses modular design for easy integration with real services:

- **AI Services**: Replace mock functions with real OpenAI API calls
- **Browser Automation**: Replace simulated Playwright with real automation
- **Proxy Management**: Add real proxy rotation services
- **Media Storage**: Integrate with Firebase or other cloud storage

## License

MIT License