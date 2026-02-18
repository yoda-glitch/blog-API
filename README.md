# blog-API
Full-featured blogging API with JWT authentication, role-based access control, and MongoDB database. Supports creating, editing, publishing blogs with search and filter capabilities. Altschool Africa Backend Engineering project.


# Blog API - Backend

A RESTful API for a blogging platform built with Node.js, Express, and MongoDB. Features user authentication, blog management, and advanced filtering capabilities.

## Features

- **JWT Authentication** - Secure user registration and login
- **Blog CRUD Operations** - Create, read, update, and delete blogs
- **Draft & Publish System** - Save blogs as drafts before publishing
- **Advanced Filtering** - Search by title, author, tags
- **Automatic Calculations** - Reading time based on word count
- **View Tracking** - Track blog read counts
- **Owner Authorization** - Users can only edit/delete their own blogs

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

## API Endpoints

### Authentication

```
POST   /api/auth/register    Register a new user
POST   /api/auth/login       Login user and get token
```

### Blogs

```
POST   /api/blogs            Create a new blog (requires auth)
GET    /api/blogs            Get all published blogs
GET    /api/blogs/:id        Get a single blog by ID
GET    /api/blogs/user/me    Get logged-in user's blogs (requires auth)
PATCH  /api/blogs/:id        Update a blog (requires auth, owner only)
DELETE /api/blogs/:id        Delete a blog (requires auth, owner only)
```

## Installation & Setup

### Prerequisites

- Node.js
- MongoDB

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/yoda-glitch/blog-api.git
cd blog-api
```

1. **Install dependencies**

```bash
npm install
```

1. **Create `.env` file in root directory**

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

1. **Start the server**

```bash
npm start
```

Server runs on `http://localhost:5000`

## API Usage Examples

### 1. Register a User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d5f...",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com"
  }
}
```

### 2. Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. Create a Blog

```bash
POST /api/blogs
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Getting Started with Node.js",
  "description": "A beginner's guide to Node.js",
  "tags": ["nodejs", "javascript", "backend"],
  "body": "Node.js is a powerful runtime for building server-side applications...",
  "state": "published"
}
```

**Response:**

```json
{
  "blog": {
    "_id": "60d5f...",
    "title": "Getting Started with Node.js",
    "description": "A beginner's guide to Node.js",
    "author": "60d5e...",
    "state": "published",
    "read_count": 0,
    "reading_time": 5,
    "tags": ["nodejs", "javascript", "backend"],
    "body": "Node.js is a powerful runtime...",
    "createdAt": "2024-02-18T10:30:00.000Z"
  }
}
```

### 4. Get All Published Blogs

```bash
GET /api/blogs?order_by=createdAt&title=nodejs&tags=javascript
```

### 5. Get My Blogs

```bash
GET /api/blogs/user/me?state=draft
Authorization: Bearer YOUR_JWT_TOKEN
```

### 6. Update a Blog

```bash
PATCH /api/blogs/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Updated Title",
  "state": "published"
}
```

### 7. Delete a Blog

```bash
DELETE /api/blogs/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

**Example:**

```
GET /api/blogs?order_by=read_count&tags=javascript,nodejs&title=beginner
```

## Project Structure

```
blog-api/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   └── blogController.js     # Blog CRUD operations
├── middleware/
│   └── authMiddleware.js     # JWT verification
├── models/
│   ├── User.js               # User schema
│   └── Blog.js               # Blog schema
├── routes/
│   ├── authRoutes.js         # Auth endpoints
│   └── blogRoutes.js         # Blog endpoints
├── .env                      # Environment variables (not in repo)
├── .gitignore               # Git ignore file
├── server.js                # Entry point
├── package.json             # Dependencies
└── README.md                # Documentation
```

## Security Features

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT token-based authentication
- ✅ Protected routes with auth middleware
- ✅ Owner-only blog modifications
- ✅ Email uniqueness validation
- ✅ Password minimum length (6 characters)

## Deployment

This API can be deployed to:

- **Render** (Recommended for free tier)
- **Heroku**

### Environment Variables Required:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/blogdb
JWT_SECRET=your_super_secret_key
PORT=5000
NODE_ENV=production
```

## Testing the API

You can test using:

- **Postman** - Import collection and test endpoints
- **Thunder Client** - VS Code extension
- **REST Client** - VS Code extension

## Author

Vondee MIchael

- GitHub: [@yoda-glitch](https://github.com/yoda-glitch)
- Project: Backend Engineering - Altschool Africa

---
