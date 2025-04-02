# StudyHelperChatbot

## 📌 Overview
StudyHelperChatbot is an AI-powered chatbot designed to assist students by answering questions, providing study resources, and helping with academic topics.

## 🚀 Features
- AI-powered chat response
- Real-time interaction
- Supports multiple subjects
- User-friendly interface
- Open-source and customizable

## 🛠️ Tech Stack
- **Frontend**: React (JSX, CSS)
- **Backend**: Node.js, Express.js
- **AI Model**: LLaMA (Large Language Model Meta AI)
- **Database**: MongoDB (Optional, for user history)
- **API**: OpenAI API (or custom LLaMA integration)

## 🔧 Installation & Setup
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/rishugoyal805/StudyHelperChatbot.git
cd StudyHelperChatbot
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root directory and add:
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
```

### 4️⃣ Start the Backend Server
```bash
npm run server
```

### 5️⃣ Start the Frontend
```bash
npm start
```

## 📜 API Endpoints
### POST `/api/chat`
- **Request:**
```json
{
  "messages": [{ "role": "user", "content": "What is Machine Learning?" }]
}
```
- **Response:**
```json
{
  "content": "Machine Learning is a field of AI that enables computers to learn from data..."
}
```

## 🐞 Troubleshooting
- **Chatbot not responding?** Ensure API keys are correctly set.
- **Git push rejected?** Run:
  ```bash
  git pull origin main --rebase
  ```
- **Dependencies issue?** Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

## 🤝 Contributing
Feel free to contribute by submitting issues or pull requests!

## 📜 License
This project is open-source under the MIT License.

---
### 💡 Created by Rishu Goyal & Contributors 🚀
   
