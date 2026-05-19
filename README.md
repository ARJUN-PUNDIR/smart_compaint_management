# AI-Based Smart Complaint Management System

A complete MERN stack application with AI integration for registering, analyzing, and managing complaints.

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB URI
- OpenRouter/OpenAI API Key

### 1. Backend Setup
```bash
cd backend
npm install
# Ensure .env is configured with MONGO_URI, JWT_SECRET, AI_API_KEY
node index.js
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables
Create a `.env` in the `/backend` folder:
```env
PORT=5000
MONGO_URI=mongodb+srv://<db_user>:<password>@cluster0.qw51kbw.mongodb.net/smart_management_db
JWT_SECRET=your_jwt_secret_here
AI_API_KEY=your_openrouter_api_key_here
```

## API Endpoints

### Authentication
- `POST /api/auth/register` (name, email, password, role)
- `POST /api/auth/login` (email, password)

### Complaints
- `POST /api/complaints` - Register new complaint
- `GET /api/complaints` - Get all complaints
- `GET /api/complaints/search?location=` - Search complaints
- `GET /api/complaints/:id` - Get single complaint
- `PUT /api/complaints/:id` - Update status or save AI data (Admin/App)

### AI Analysis
- `POST /api/ai/analyze` - Analyze complaint description

## Deployment (Render)

### Backend
1. Create a new Web Service on Render.
2. Connect this GitHub repository.
3. Set Build Command: `npm install`
4. Set Start Command: `node index.js`
5. Root Directory: `backend`
6. Add Environment Variables (MONGO_URI, JWT_SECRET, AI_API_KEY).

### Frontend
1. Create a new Static Site on Render.
2. Connect this GitHub repository.
3. Set Build Command: `npm run build`
4. Set Publish Directory: `dist`
5. Root Directory: `frontend`
6. Note: Ensure Axios API calls point to the deployed Backend URL, not `localhost:5000`.

## Screenshots
_Placeholder for Login Page_
_Placeholder for Dashboard_
_Placeholder for AI Analysis_
_Placeholder for Admin Controls_
