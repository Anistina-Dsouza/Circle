# 🌐 Circle – Full-Stack Social App (MERN)

**Circle** is a modern **full-stack social networking platform** built using the **MERN stack**.  
The project is maintained as a **single monorepo** containing both **frontend (React)** and **backend (Node.js + Express)**.

---

## 🧠 About the Project

Circle allows users to create communities, chat in real time, share stories, and host video meetings.

This project demonstrates **end-to-end system design**, from UI to backend APIs, real-time communication, authentication, and deployment.

---

## 🗂 Monorepo Structure

```text
circle-app/
├── client/          # React frontend
├── server/          # Node.js + Express backend
├── docs/            # Documentation
└── README.md
🚀 Local Development Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/circle-app.git
cd circle-app
2️⃣ Backend Setup
cd server
npm install
cp .env.example .env
npm run dev
Backend runs on:

http://localhost:5000
3️⃣ Frontend Setup
cd client
npm install
npm start
Frontend runs on:

http://localhost:3000
🛠 Tech Stack
Frontend
React.js

Context API / Hooks

Deployed on Vercel

Backend
Node.js

Express.js

REST APIs

Deployed on Render

Database
MongoDB Atlas (Free Tier)

Real-time
Socket.IO

Media Storage
Cloudinary (Free Tier)

📦 Core Features
Circles & Sub-circles – Structured communities

Huddles – Real-time group chats with reactions

Moments – 24-hour stories

RoundTables – Video meetings

Follow System – User connections

🔧 Environment Variables
Backend (server/.env)
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:3000
Frontend (client/.env.local)
REACT_APP_API_URL=http://localhost:5000/api
📞 API Overview
Method	Endpoint	Description
POST	/api/auth/register	User registration
POST	/api/auth/login	User login
GET	/api/circles	Fetch circles
GET	/api/huddles/:id/messages	Chat messages
🔒 Security
JWT-based authentication

Password hashing using bcrypt

Input validation

CORS protection

🚢 Deployment
Service	Platform
Frontend	Vercel
Backend	Render
Database	MongoDB Atlas
Media	Cloudinary
📈 Placement & Interview Value
This project showcases:

Full-stack MERN architecture

REST API design

Real-time systems (Socket.IO)

Authentication & authorization

Scalable monorepo structure

Deployment & CI/CD understanding

📌 Project Status
🚧 Active Development

📜 License
MIT License

