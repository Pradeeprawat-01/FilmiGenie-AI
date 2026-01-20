# 🎬 FilmiGenie AI – Intelligent Movie Recommendation System

FilmiGenie AI is a full-stack AI-powered movie recommendation web application that suggests personalized movies based on user preferences using Generative AI. The project demonstrates real-world backend API integration, error handling, and modern full-stack development practices.

---

## 🚀 Features

* 🎥 AI-based personalized movie recommendations
* 🧠 Uses Generative AI for natural-language understanding
* ⚡ Fast and responsive user interface
* 🔐 Secure API key handling using environment variables
* ❌ Graceful error handling for third-party API failures

---

## 🛠️ Tech Stack

### Frontend

* React.js
* HTML5, CSS3
* JavaScript (ES6+)

### Backend

* Node.js
* Express.js
* TypeScript

### AI Integration

* Google Gemini API (Generative AI)

### Tools & Utilities

* Git & GitHub
* dotenv
* REST APIs

---

## 📂 Project Structure

```
FilmiGenie-AI/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── recommendations.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Pradeeprawat-01/FilmiGenie-AI.git
cd FilmiGenie-AI
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

Start the backend:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

This project uses environment variables for security.

* `.env` → **NOT committed to GitHub**
* `.env.example` → Included for reference

```env
GEMINI_API_KEY=your_api_key_here
```

---

## ❗ Error Handling

* Handles expired or invalid API keys gracefully
* Prevents application crashes due to third-party API failures
* Returns meaningful HTTP status codes and error messages

Example handled error:

```
API_KEY_INVALID – Gemini API key expired
```

---

## 🧪 API Endpoint

### POST `/api/recommend`

**Request Body**

```json
{
  "prompt": "Recommend sci-fi movies with time travel"
}
```

**Response**

```json
{
  "recommendations": "Interstellar, Inception, Predestination..."
}
```

---

## 📈 Learning Outcomes

* Integrated Generative AI APIs in a real application
* Implemented secure backend architecture
* Learned error handling for external services
* Improved full-stack debugging skills
* Gained experience deploying AI-powered features

---

## 🧠 Future Improvements

* User authentication
* Movie database integration (TMDB / IMDb)
* Caching AI responses
* Deployment using Docker & Cloud services

---

## 👨‍💻 Author

**Pradeep Rawat**





