# 🚀 ResumeAI — AI-Powered Resume Optimizer

A production-ready full-stack web application that uses Claude AI to optimize resumes for ATS systems and specific job descriptions.

---

## 📁 Project Structure

```
resume-optimizer/
├── server/                     # Node.js + Express backend
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── multer.js           # File upload config
│   ├── controllers/
│   │   ├── authController.js   # Register, login, getMe
│   │   ├── resumeController.js # AI optimization logic
│   │   └── adminController.js  # Admin dashboard
│   ├── middleware/
│   │   └── auth.js             # JWT protect + adminOnly
│   ├── models/
│   │   ├── User.js             # User schema
│   │   └── Resume.js           # Resume schema
│   ├── routes/
│   │   ├── auth.js             # /api/auth/*
│   │   ├── resume.js           # /api/resumes/*
│   │   └── admin.js            # /api/admin/*
│   ├── .env.example
│   ├── index.js                # Entry point
│   └── package.json
│
└── client/                     # React + Vite frontend
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── AtsScore.jsx
    │   │   ├── Skeleton.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx   # Main optimizer
    │   │   ├── History.jsx
    │   │   └── Admin.jsx
    │   ├── utils/
    │   │   └── api.js          # Axios instance
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- Gemini API key

### 1. Clone / extract the project

```bash
cd resume-optimizer
```

### 2. Setup the backend

```bash
cd server
npm install

# Copy and fill in environment variables
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume-optimizer
JWT_SECRET=your_super_secret_jwt_key_minimum_32_chars
GEMINI_API_KEY=sk-ant-your-key-here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Setup the frontend

```bash
cd ../client
npm install
```

### 4. Run in development

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# App starts on http://localhost:5173
```

---

## 👤 Creating an Admin Account

After starting the server, you can create an admin via MongoDB shell or Compass:

```javascript
// In MongoDB shell
use resume-optimizer
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Or register normally and then update the role in your database.

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Resumes (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resumes/optimize` | Upload + optimize resume |
| GET | `/api/resumes` | Get my resumes (paginated) |
| GET | `/api/resumes/:id` | Get resume by ID |
| DELETE | `/api/resumes/:id` | Delete resume |

### Admin (Admin Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Stats |
| GET | `/api/admin/users` | All users |
| DELETE | `/api/admin/users/:id` | Delete user + resumes |
| GET | `/api/admin/resumes` | All resumes |

---

## 🚀 Deployment

### Backend (e.g., Railway, Render, Heroku)

1. Set environment variables in your platform's dashboard
2. Set `NODE_ENV=production`
3. Start command: `npm start`

### Frontend (e.g., Vercel, Netlify)

1. Build: `npm run build`
2. Output directory: `dist`
3. Set environment variable: (no env vars needed — API calls go through Vite proxy in dev, or update `api.js` baseURL for production)

**For production**, update `client/src/utils/api.js`:
```javascript
const api = axios.create({
  baseURL: 'https://your-backend-url.com/api',
  // ...
});
```

### MongoDB Atlas
Replace `MONGODB_URI` with your Atlas connection string:
```
mongodb+srv://username:password@cluster.mongodb.net/resume-optimizer
```

---

## 🔒 Security Features

- JWT authentication with 7-day expiry
- bcrypt password hashing (12 rounds)
- Admin-only route middleware
- File type validation (PDF/DOCX only)
- 10MB file size limit
- Input validation with express-validator
- CORS restricted to CLIENT_URL

---

## 🧠 AI Logic

When a user uploads a resume:

1. File is parsed (pdf-parse for PDF, mammoth for DOCX)
2. Text + job description sent to Claude Sonnet with structured HR recruiter prompt
3. Claude returns optimized resume with:
   - Quantifiable achievements
   - Rewritten bullet points with action verbs
   - ATS-optimized keywords
4. Basic ATS score calculated (keyword match % between improved resume and job description)
5. Original + improved versions stored in MongoDB

---

## 🎨 UI Features

- Dark/light mode with system preference detection
- Drag & drop file upload
- Circular ATS score gauge
- Side-by-side original vs improved view
- Skeleton loaders during API calls
- Toast notifications
- Paginated history
- Responsive for mobile/tablet/desktop
