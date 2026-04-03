# CampusConnect

## Prerequisites
- Node.js (v16 or higher)
- Git
- MongoDB (local or Atlas)

---

## Setup

### 1. Clone Repository
```bash
git clone <your-github-repo-url>
cd CampusConnect
```

---

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster...
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=gmail_app_password
ADMIN_PASSWORD=admin_password
FRONTEND_URL=http://localhost:5173
```

Start backend:
```bash
npm start
```

---

### 3. Frontend Setup
Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:

```env
VITE_API_BASE=http://localhost:5000
```

Start frontend:
```bash
npm run dev
```

---

## Run App
- Frontend: http://localhost:5173  
- Backend: http://localhost:5000  
