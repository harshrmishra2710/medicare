# MindCare AI — Python FastAPI Backend

This is the Python FastAPI backend for **MindCare AI**, migrated from the original Node.js/Express backend while preserving full compatibility with the React frontend and MongoDB database.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.9 or higher
- MongoDB (running locally on port 27017, or MongoDB Atlas connection string)
  > *Note: If MongoDB is offline, MindCare AI automatically switches to in-memory fallback mode.*

### 2. Set Up Virtual Environment (Recommended)
```bash
# Navigate to the backend directory
cd backend-python

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Create a `.env` file from the provided example:
```bash
copy .env.example .env
```
Ensure your `.env` contains:
```env
PORT=8000
MONGO_URI=mongodb://127.0.0.1:27017/mindcare_ai
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### 5. Run the Server
You can start the server using either method:

**Method A: Using the Launcher Script**
```bash
python run.py
```

**Method B: Using Uvicorn Directly**
```bash
uvicorn app.main:app --reload --port 8000
```

---

## 🧪 Run Automated Tests
MindCare AI includes a standalone test suite covering crisis detection, the smart response engine, seed datasets, schemas, and route registrations:
```bash
python test_backend.py
```

---

## 📚 Interactive API Documentation
Once running, open your browser:
- **Interactive Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc UI:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check:** [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

## 🗺️ API Endpoint Mapping

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Welcome message |
| `GET` | `/api/health` | Service health and DB status |
| `GET` | `/api/list-models` | List available Gemini models |
| `POST` | `/api/chat` | AI Chatbot (Gemini → OpenAI → Local Fallback) |
| `GET` | `/api/moods` | Get all logged moods |
| `POST` | `/api/moods` | Log new mood entry |
| `DELETE` | `/api/moods/{id}` | Delete a mood entry |
| `GET` | `/api/resources` | Get verified mental health resources |
| `GET` | `/api/activities` | Get coping toolkit exercises |
| `POST` | `/api/coping-plan` | AI Personalized Coping Plan |

---

## 📁 Project Structure

```
backend-python/
├── app/
│   ├── config.py             # Pydantic Settings & environment variables
│   ├── database.py           # Async Motor MongoDB connection & fallback
│   ├── main.py               # FastAPI app, CORS, lifespan & route mounts
│   ├── data/
│   │   ├── seed_activities.py# 9 evidence-based coping exercises
│   │   └── seed_resources.py # 8 verified emergency helplines
│   ├── models/
│   │   ├── activity.py       # Activity Pydantic schema
│   │   ├── mood.py           # Mood Pydantic schema
│   │   └── resource.py       # Resource Pydantic schema
│   ├── routes/
│   │   ├── activities.py     # Coping exercises routes
│   │   ├── chat.py           # AI Chatbot endpoint
│   │   ├── coping_plan.py    # AI personalized coping plan endpoint
│   │   ├── health.py         # Health check and model list
│   │   ├── moods.py          # Mood journal routes
│   │   └── resources.py      # Verified helplines routes
│   └── services/
│       ├── crisis_detector.py      # Regex crisis detection (988, AASRA, Vandrevala)
│       └── smart_response_engine.py# Evidence-based offline AI fallback responses
├── run.py                    # Server launcher
├── test_backend.py           # Automated unit/integration test suite
├── requirements.txt          # Python dependencies
├── .env.example              # Environment variables template
└── .env                      # Local environment configuration
```
