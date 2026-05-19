# Project Report: AI-Based Smart Complaint Management System

## 1. Introduction
The **AI-Based Smart Complaint Management System** is a robust web application designed to streamline the process of submitting, tracking, and resolving user complaints. By leveraging Artificial Intelligence, the system automatically categorizes complaints, assigns priority levels, and generates initial auto-responses, significantly reducing administrative overhead and improving response times.

## 2. System Architecture
The application follows a standard client-server architecture:
- **Client (Frontend):** React.js single-page application handling user interactions, form submissions, and data visualization.
- **Server (Backend):** Node.js and Express.js REST API facilitating business logic, authentication, and database communication.
- **Database:** MongoDB for persistent, schema-less data storage, managed via Mongoose ORM.
- **AI Service:** OpenRouter API (OpenAI compatible SDK) used for Natural Language Processing of complaint descriptions.

## 3. Features
- **User Authentication:** Secure JWT-based login and registration with hashed passwords.
- **Role-Based Access Control:** Differentiates between standard users (who submit complaints) and admins (who update complaint statuses).
- **Complaint Registration:** Detailed form capturing user information, complaint category, location, and description.
- **AI Analysis:** Automatically parses complaint descriptions to determine urgency (High/Medium/Low), suggest the relevant department, generate a summary, and craft a polite auto-response.
- **Dashboard & Search:** A central dashboard with status badges and a location-based search functionality.
- **Responsive Premium UI:** A modern, glassmorphism-inspired user interface built with Vanilla CSS.

## 4. Tech Stack
- **Frontend:** React.js, Vite, Axios, React Router DOM, Lucide Icons, Vanilla CSS.
- **Backend:** Node.js, Express.js, JSON Web Tokens (JWT), bcryptjs.
- **Database:** MongoDB, Mongoose.
- **AI Integration:** OpenAI Node.js SDK pointing to OpenRouter API (LLaMA 3 8B Instruct model).

## 5. Code Snippets

### AI Analysis Controller (Backend)
```javascript
const prompt = `Analyze the complaint and output JSON with priority, department, summary, and autoResponse. Complaint: "${description}"`;
const completion = await openai.chat.completions.create({
  model: "meta-llama/llama-3-8b-instruct",
  messages: [{ role: "user", content: prompt }],
  response_format: { type: "json_object" }
});
const aiData = JSON.parse(completion.choices[0].message.content);
res.json(aiData);
```

### Authentication Middleware (Backend)
```javascript
const token = req.headers.authorization.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = await User.findById(decoded.id).select('-password');
```

## 6. API Screenshots
*(Placeholder for Postman testing screenshots: Login success, Create Complaint, Search Complaint)*

## 7. MongoDB Screenshots
*(Placeholder for MongoDB Atlas screenshots showing the 'users' and 'complaints' collections)*

## 8. Render Deployment Screenshots
*(Placeholder for Render dashboard showing successful deployment of Frontend Static Site and Backend Web Service)*

## 9. Conclusion
The developed system successfully meets all requirements for a modern, AI-enhanced MERN stack application. It securely handles user data, elegantly processes complaints through a responsive UI, and utilizes artificial intelligence to triage incoming issues effectively. The codebase is modular, well-documented, and fully prepared for cloud deployment on platforms like Render.
