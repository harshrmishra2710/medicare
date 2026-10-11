# 🌿 MindCare AI (Medicare PBL) — Mental Health Support Platform

> **College Project-Based Learning (PBL)**  
> **Repository:** [https://github.com/harshrmishra2710/medicare.git](https://github.com/harshrmishra2710/medicare.git)  
> **Team Members:** Harsh, Sandeep, Shakti, Yusuf

---

## 📌 Project Overview

**MindCare AI** is a compassionate, student-centric mental health support web application designed to help young adults navigate daily stress, exam anxiety, and emotional challenges. Built for live offline and local demonstration, the platform provides:

1. **AI Emotional Companion:** Empathetic conversational AI powered by Google Gemini (with an automated rule-based smart local fallback engine).
2. **Deterministic Crisis Intervention:** Immediate detection of severe distress and self-harm keywords, providing instant verified emergency helplines for India (Tele-MANAS, KIRAN, AASRA) and global regions.
3. **Daily Mood Journal:** Log daily feelings (Happy, Calm, Okay, Sad, Anxious, Stressed) with personal notes and historical tracking.
4. **Personal Coping Toolkit:** Guided exercises for Box Breathing (visual timer), 5-4-3-2-1 Grounding, Progressive Muscle Relaxation (PMR), and Pomodoro time management.
5. **Verified Helpline Library:** Searchable, categorized emergency directory of professional mental health resources.

---

## 🏗️ Architecture & Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                   User Browser (Chrome/Edge)                │
└──────────────────────────────┬──────────────────────────────┘
                               │
                http://localhost:3000 (Vite Dev Server)
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               Frontend: React 18 + Vite (SPA)               │
│  - Lucide Icons, Pure CSS Design System                     │
│  - Vite Proxy: /api/* ──► http://localhost:8000/api/*       │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON REST API
                               ▼
┌─────────────────────────────────────────────────────────────┐
│          Backend: Python 3.10+ / FastAPI / Uvicorn          │
│  - Port 8000                                                │
│  - Endpoints: /api/chat, /api/moods, /api/coping-plan, etc. │
│  - Crisis Detector (Keyword Rule Engine)                    │
│  - Smart Response Engine (Fallback without API key)         │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│   MongoDB Database (Motor)   │ │      Google Gemini API     │
│  - Local: port 27017         │ │  - gemini-2.5-flash        │
│  - In-Memory Fallback if     │ │  - Smart local fallback if │
│    MongoDB is not installed  │ │    offline / key missing   │
└──────────────────────────────┘ └────────────────────────────┘
```

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite 5, Lucide React, Pure CSS | Responsive user interface and interactive tools |
| **Backend** | Python (3.10+), FastAPI, Uvicorn, Pydantic | High-performance asynchronous REST API |
| **Database** | MongoDB (via Motor async driver) | Persistent storage for moods and resources (with automatic in-memory fallback) |
| **AI Engine** | Google Gemini API (`gemini-2.5-flash`) | Context-aware empathetic conversational responses |
| **Safety Engine** | Python Regex & Keyword Matcher | Rule-based crisis interceptor for immediate helpline guidance |

---

## 📂 Project Directory Structure

```text
medicare/
├── frontend/                          # React + Vite frontend application
│   ├── .env.example                   # Frontend environment template
│   ├── index.html                     # HTML root entry point
│   ├── package.json                   # NPM dependencies and scripts
│   ├── package-lock.json              # NPM locked dependency versions
│   ├── vite.config.js                 # Vite proxy setup (proxies /api to :8000)
│   └── src/
│       ├── App.jsx                    # Root React component & navigation
│       ├── App.css                    # Design tokens and page styles
│       ├── index.css                  # Typography and global base rules
│       ├── main.jsx                   # React DOM render entry
│       ├── components/
│       │   ├── DisclaimerBanner.jsx   # Clinical disclaimer warning banner
│       │   ├── Footer.jsx             # Footer with helpline quick links
│       │   └── Navbar.jsx             # Top navigation bar
│       ├── data/
│       │   ├── seedActivities.js      # Predefined coping exercises dataset
│       │   └── seedResources.js       # Predefined crisis helplines dataset
│       ├── pages/
│       │   ├── Chat.jsx               # AI Support Chatbot interface
│       │   ├── CopingToolkit.jsx      # Interactive guided exercises & timer
│       │   ├── Home.jsx               # Landing page with feature highlights
│       │   ├── MoodTracker.jsx        # Daily mood logger with history
│       │   └── Resources.jsx          # Emergency helplines directory
│       └── utils/
│           ├── api.js                 # API base URL helper
│           └── copingEngine.js        # Rule-based exercise filtering logic
│
├── backend-python/                    # FastAPI backend service
│   ├── .env.example                   # Backend environment template
│   ├── requirements.txt               # Python package dependencies
│   ├── run.py                         # Server launch script (python run.py)
│   ├── test_backend.py                # Automated backend test suite (32 tests)
│   ├── README.md                      # Backend technical documentation
│   └── app/
│       ├── __init__.py
│       ├── config.py                  # Pydantic settings & CORS configuration
│       ├── database.py                # Motor MongoDB connection & fallback
│       ├── main.py                    # FastAPI application initialization
│       ├── data/
│       │   ├── seed_activities.py     # Coping exercises seed dataset
│       │   └── seed_resources.py      # Helplines seed dataset
│       ├── models/
│       │   ├── activity.py            # Activity Pydantic model
│       │   ├── mood.py                # Mood Pydantic model
│       │   └── resource.py            # Resource Pydantic model
│       ├── routes/
│       │   ├── activities.py          # GET /api/activities
│       │   ├── chat.py                # POST /api/chat (Gemini + Local AI)
│       │   ├── coping_plan.py         # POST /api/coping-plan
│       │   ├── health.py              # GET /api/health status check
│       │   ├── moods.py               # GET / POST / DELETE /api/moods
│       │   └── resources.py           # GET /api/resources
│       └── services/
│           ├── crisis_detector.py     # Rule-based crisis detector
│           └── smart_response_engine.py # Empathetic local response generator
│
├── .gitignore                         # Strict exclusion for secrets, node_modules, caches
└── README.md                          # Main project guide (this file)
```

---

## 💻 Step-by-Step Local Setup Guide (Windows)

Follow these exact steps to run the application on your friend's laptop during the live college demonstration.

### Prerequisites to Check First
Open PowerShell or Command Prompt on the laptop and verify:
```powershell
python --version    # Requires Python 3.10 or higher
node -v             # Requires Node.js 18 or higher
npm -v              # Requires npm 9 or higher
```
*(If Python or Node.js are missing, download them from [python.org](https://www.python.org) and [nodejs.org](https://nodejs.org). When installing Python on Windows, make sure to check **"Add python.exe to PATH"**).*

---

### Step 1: Clone the Repository
```powershell
git clone https://github.com/harshrmishra2710/medicare.git
cd medicare
```

---

### Step 2: Start the Python Backend (Terminal 1)

Open your **first PowerShell terminal** in the `medicare` directory:

```powershell
# 1. Navigate to backend-python
cd backend-python

# 2. (Optional but recommended) Create and activate a Python virtual environment
python -m venv venv
venv\Scripts\activate

# 3. Install required Python packages
pip install -r requirements.txt

# 4. Create your local .env configuration from the example
copy .env.example .env

# 5. Run the server
python run.py
```

You will see:
```text
==================================================
🌿 MindCare AI — FastAPI Backend Server
==================================================
🚀 Starting on port 8000...
📚 Interactive Swagger Docs: http://localhost:8000/docs
🩺 Health Check Endpoint: http://localhost:8000/api/health
==================================================
INFO:     Uvicorn running on http://0.0.0.0:8000
```

> **Database Note:**  
> If MongoDB is installed locally on the laptop, the backend connects to `mongodb://127.0.0.1:27017/mindcare_ai`.  
> **If MongoDB is NOT installed, do not worry!** The backend automatically switches to **In-Memory Fallback Mode** so all routes, mood logging, activities, and chatbot features work completely without crashing.

> **AI Key Note:**  
> In `backend-python/.env`, you can add your `GEMINI_API_KEY=your_key_here`.  
> If an API key is not provided or if the laptop is offline, the chatbot seamlessly uses the built-in **Smart Local Response Engine**!

---

### Step 3: Start the React Frontend (Terminal 2)

Open a **second PowerShell terminal** in the `medicare` directory:

```powershell
# 1. Navigate to frontend
cd frontend

# 2. Install Node dependencies
npm install

# 3. Start Vite local development server
npm run dev
```

You will see:
```text
  VITE v5.2.0  ready in 250 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

---

### Step 4: Open in Web Browser
Open Google Chrome or Microsoft Edge and navigate to:
```text
http://localhost:3000
```

---

## 🧪 Testing & Verification

To verify that all backend routes, models, crisis keyword detection, and response engines are functioning correctly, run the automated test suite in `backend-python`:

```powershell
cd backend-python
python test_backend.py
```

Expected output:
```text
============================================================
🧪 MindCare AI Backend Test Suite
============================================================
[1] Testing Crisis Detector...
  ✅ PASS: Crisis detected: suicide
  ✅ PASS: Crisis detected: kill myself
  ✅ PASS: Crisis detected: self harm / cut
  ✅ PASS: Crisis detected: end my life
  ✅ PASS: Non-crisis passed cleanly
  ✅ PASS: Empty string handled safely

[2] Testing Local Smart Response Engine...
  ✅ PASS: Greeting response generated
  ✅ PASS: Stress response generated
  ✅ PASS: Sleep response generated
  ✅ PASS: Breathing exercise response generated
  ✅ PASS: Helpline referral generated
  ✅ PASS: Default fallback response generated

[3] Testing Seed Datasets...
  ✅ PASS: Activities seed count >= 9
  ✅ PASS: Resources seed count >= 8
  ✅ PASS: Activity has title, duration, category, steps
  ✅ PASS: Resource has title, category, contact, region

[4] Testing Pydantic Schemas...
  ✅ PASS: MoodCreate valid
  ✅ PASS: ChatRequest valid with history
  ✅ PASS: CopingPlanRequest valid

[5] Testing Configuration & Origins...
  ✅ PASS: mongodb_uri property exists and returns string
  ✅ PASS: gemini_model configured
  ✅ PASS: allowed_origins contains local dev ports
  ✅ PASS: Fallback coping plan generated with correct structure

[6] Testing FastAPI App Route Registration...
  ✅ PASS: Route registered: /
  ✅ PASS: Route registered: /health
  ✅ PASS: Route registered: /api/health
  ✅ PASS: Route registered: /api/list-models
  ✅ PASS: Route registered: /api/chat/
  ✅ PASS: Route registered: /api/moods/
  ✅ PASS: Route registered: /api/resources/
  ✅ PASS: Route registered: /api/activities/
  ✅ PASS: Route registered: /api/coping-plan/

============================================================
🏁 Test Results: 32 PASSED, 0 FAILED
============================================================
```

---

## 🛡️ Safety & Crisis Protocols

MindCare AI is designed with strict ethical guidelines:
- **Clinical Disclaimer:** A persistent disclaimer informs users that MindCare AI is an automated wellness companion, not a licensed therapist or emergency medical service.
- **Immediate Keyword Interception:** Phrases indicating suicidal ideation, self-harm, or severe crisis bypass standard conversation and trigger an emergency response banner.
- **Verified 24/7 Helplines:**
  - 🇮🇳 **India:** Tele-MANAS (`14416` / `1800-891-4416`), KIRAN (`1800-599-0019`), Vandrevala Foundation (`+91 9999 666 555`), AASRA (`+91 98204 66726`).
  - 🌐 **International:** US/Canada (`988`), UK (`111` / `116 123`), Emergency Services (`112` / `911`).

---

## 📄 License & Academic Attribution
Developed for academic presentation and educational evaluation as part of College Project-Based Learning (PBL).
