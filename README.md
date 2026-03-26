# TaskPlanet Social

A full-stack MERN social feed application built as part of the 3W Business internship assignment. Inspired by the Social page of the TaskPlanet app.

## Live Demo

- **Frontend:** https://task-planet-social-gilt.vercel.app
- **Backend API:** https://task-planet-social-l5uu.onrender.com

## Features

- **Authentication** — Signup and login with email/password, JWT-based session
- **Create Post** — Post text, image, or both
- **Feed** — Public feed showing all posts, newest first
- **Filter Tabs** — All Posts | Most Liked | Most Commented
- **Like** — Toggle like on any post with instant UI update
- **Comment** — Add comments, view inline with collapsible section
- **Responsive UI** — Mobile-friendly layout built with React Bootstrap

## Tech Stack

**Frontend**
- React.js (Vite)
- React Bootstrap
- Axios
- React Router DOM

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication (jsonwebtoken)
- bcryptjs for password hashing
- Multer for image uploads

**Database**
- MongoDB Atlas

**Deployment**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Project Structure
```
task-planet-social/
├── backend/
│   ├── config/
│   │   └── upload.js         # Multer config
│   ├── middleware/
│   │   └── auth.js           # JWT middleware
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── posts.js
│   ├── uploads/
│   ├── .env.example
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── PostCard.jsx
    │   │   ├── CreatePost.jsx
    │   │   └── CommentSection.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   └── Feed.jsx
    │   ├── utils/
    │   │   ├── api.js
    │   │   └── timeAgo.js
    │   ├── App.jsx
    │   └── main.jsx
    └── vercel.json
```

## Database Collections

Only two collections used as per assignment guidelines:

- **users** — `username`, `email`, `password`, `createdAt`
- **posts** — `author`, `text`, `imageUrl`, `likes`, `comments`, `createdAt`

## API Endpoints

| Method | Endpoint                 | Auth | Description           |
| :----- | :----------------------- | :--: | :-------------------- |
| GET    | `/api/posts`             |  ✗   | Get all posts         |
| POST   | `/api/posts`             |  ✓   | Create post           |
| POST   | `/api/posts/:id/like`    |  ✓   | Toggle like           |
| POST   | `/api/posts/:id/comment` |  ✓   | Add comment           |
| POST   | `/api/auth/signup`       |  ✗   | Register, returns JWT |
| POST   | `/api/auth/login`        |  ✗   | Login, returns JWT    |

## Local Setup
```bash
# Clone the repo
git clone https://github.com/Mechtech001/task-planet-social.git
cd task-planet-social

# Backend
cd backend
npm install
# Add your .env variables (see .env.example)
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Environment Variables

**backend/.env**
```
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret
PORT=5000
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000
```
