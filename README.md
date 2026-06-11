# DevConnect – Developer Social Platform

A full-stack developer networking platform where developers can connect, share posts, follow each other, and interact.

## Tech Stack

**Frontend:** React.js, React Router v6, Axios, React Hot Toast, React Icons  
**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, Cloudinary, Multer  
**Deployment:** Vercel (frontend) + Render (backend) + MongoDB Atlas

---

## Project Structure

```
devconnect/
├── backend/
│   ├── config/         # DB & Cloudinary config
│   ├── controllers/    # Business logic
│   ├── middleware/     # Auth middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # Express routes
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
│   ├── components/   # Reusable UI components
│   ├── context/      # AuthContext
│   ├── pages/        # Route pages
│   └── utils/        # Axios API instance
    ├── index.html
    └── vite.config.js
```

---

## Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/devconnect.git
cd devconnect
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values (see below)
npm run dev
```

### Backend `.env` values
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/devconnect
JWT_SECRET=any_long_random_string
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api
npm run dev
```

App runs at: http://localhost:5173

---

## Deployment

### Backend → Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo, select the `backend/` folder as root directory
4. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add all environment variables from `.env.example` under **Environment**
6. Set `CLIENT_URL` to your Vercel frontend URL (get it after deploying frontend)
7. Click **Deploy** — Render gives you a URL like `https://devconnect-api.onrender.com`

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → Import from GitHub
2. Set **Root Directory** to `frontend`
3. Under **Environment Variables**, add:
   ```
   VITE_API_URL=https://devconnect-api.onrender.com/api
   ```
4. Click **Deploy** — Vercel gives you a URL like `https://devconnect.vercel.app`
5. Go back to Render and update `CLIENT_URL` to the Vercel URL, then redeploy

### MongoDB Atlas Setup
1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Under **Network Access**, add `0.0.0.0/0` (allow all IPs — needed for Render)
3. Under **Database Access**, create a user with read/write access
4. Copy the connection string and use it as `MONGO_URI`

---

## Features

- ✅ JWT Authentication (Register / Login / Protected Routes)
- ✅ User Profiles with bio, skills, social links
- ✅ Profile picture upload via Cloudinary
- ✅ Create posts with images and hashtags
- ✅ Like and comment on posts
- ✅ Follow / Unfollow users
- ✅ Personalized feed (posts from followed users)
- ✅ Explore page (all posts)
- ✅ Search developers by name/username
- ✅ Suggested users to follow
- ✅ Responsive dark-themed UI

---

## API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (protected) |

### Users
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/users/:username` | Get user by username |
| PUT | `/api/users/profile` | Update profile (protected) |
| PUT | `/api/users/:id/follow` | Follow/Unfollow user (protected) |
| GET | `/api/users/search?q=` | Search users (protected) |
| GET | `/api/users/suggestions` | Get follow suggestions (protected) |

### Posts
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/posts/feed` | Get personalized feed (protected) |
| GET | `/api/posts` | Get all posts (protected) |
| POST | `/api/posts` | Create post (protected) |
| GET | `/api/posts/user/:userId` | Get posts by user |
| PUT | `/api/posts/:id/like` | Like/Unlike post (protected) |
| POST | `/api/posts/:id/comment` | Add comment (protected) |
| DELETE | `/api/posts/:id` | Delete post (protected) |

---

## Author

**Sanket Kumar** — MCA Graduate, Full Stack Developer  
[GitHub] https://github.com/SanketKumarDev · [LinkedIn] https://www.linkedin.com/in/sanket-kumar-dev/
