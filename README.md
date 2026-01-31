# 🤖 AI Chatbot Application

An AI-powered chatbot web application built using **FastAPI** and **Groq LLM**, featuring secure authentication, chat history, and an interactive frontend with a live animated wallpaper.

---

## 🚀 Features

- 💬 AI-powered chatbot using Groq LLM for real-time responses  
- 🔐 JWT-based authentication for secure user sessions  
- 🕒 Chat history support to maintain conversation context  
- 🌌 Interactive UI with **Vanta.js** live animated background  
- 🌐 Fully deployed backend on cloud (Render)

---

## 🛠️ Tech Stack

### Frontend
- HTML  
- CSS  
- JavaScript  
- Vanta.js (live animated wallpaper)

### Backend
- FastAPI  
- Groq API (LLM integration)  
- JWT (JSON Web Tokens) for authentication  

### Deployment
- Backend deployed on **Render**

---

## ⚙️ Application Flow

1. User authenticates using JWT-based login  
2. Frontend sends user prompts to FastAPI backend  
3. Backend processes prompts and sends them to Groq LLM  
4. AI-generated responses are returned to the frontend  
5. Chat history is stored and retrieved for continuity  

---

## 🔐 Authentication

- Implemented **JWT (JSON Web Tokens)** for secure authentication  
- Tokens are generated on login and verified on protected routes  
- Ensures only authenticated users can access chat functionality  

---
## 🌍 Deployment
- Backend deployed on Render  
- Environment variables configured securely on the cloud platform  

## 📚 Learnings & Takeaways
- Hands-on experience integrating LLM APIs into backend services  
- Understanding of JWT-based authentication workflows  
- Building RESTful APIs with FastAPI  
- Managing environment variables and cloud deployment  
- Connecting frontend and backend in a full-stack AI application  

## 🔗 Links
- Live Demo: https://iamsan06.github.io/AI-Chatbot/
- GitHub Repository: https://github.com/iamsan06/AI-Chatbot

## 📌 Future Improvements
- Add database support for persistent chat history  
- Improve UI/UX and mobile responsiveness  
- Add user profile management  
- Implement rate limiting and logging  

## 👨‍💻 Author
**Sankar**  
Second-year Computer Science student exploring AI, backend development, and cloud technologies.

