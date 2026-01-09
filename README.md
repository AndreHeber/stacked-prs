# Stacked PRs Example - User Authentication

This project demonstrates how to structure a feature using **stacked PRs** (also called "stacked diffs"). Each PR builds on the previous one, creating a clear dependency chain.

## 📋 PR Structure

### PR #1: Database Schema
**Files:**
- `database/schema.sql` - SQL schema for users table
- `database/migrate.js` - Migration script

**What it does:** Creates the database structure needed for user authentication.

**Why separate:** Database changes should be reviewed independently and can be deployed separately.

---

### PR #2: User Model
**Files:**
- `models/User.js` - User model class

**What it does:** Adds a User model that interacts with the database schema from PR #1.

**Depends on:** PR #1 (needs the `users` table)

**Why separate:** Model layer can be tested independently before adding business logic.

---

### PR #3: Authentication Service
**Files:**
- `services/authService.js` - Authentication business logic

**What it does:** Implements registration, login, and token verification using the User model from PR #2.

**Depends on:** PR #2 (needs the User model)

**Why separate:** Business logic can be reviewed and tested independently of API routes.

---

### PR #4: API Endpoints
**Files:**
- `routes/authRoutes.js` - Express routes for authentication

**What it does:** Exposes REST API endpoints (`/register`, `/login`, `/me`) using AuthService from PR #3.

**Depends on:** PR #3 (needs AuthService)

**Why separate:** API layer can be reviewed separately, and frontend can start working once this is merged.

---

### PR #5: Frontend UI
**Files:**
- `public/index.html` - Login/Register UI

**What it does:** Provides a beautiful web interface that calls the API endpoints from PR #4.

**Depends on:** PR #4 (needs the API endpoints)

**Why separate:** Frontend can be reviewed by UI/UX team independently.

---

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Setup Database

```bash
npm run migrate
```

This creates `auth.db` with the users table.

### Run the Server

```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will start on `http://localhost:3000`

### Test the Application

1. Open `http://localhost:3000` in your browser
2. Register a new user
3. Login with your credentials
4. View your user info

## 🧪 Testing Each PR

### PR #1: Test Database Schema
```bash
npm run migrate
sqlite3 auth.db "SELECT * FROM users;"
```

### PR #2: Test User Model
```bash
node -e "const User = require('./models/User'); User.create('test@example.com', 'password123').then(u => console.log(u));"
```

### PR #3: Test Auth Service
```bash
node -e "const auth = require('./services/authService'); auth.register('test@example.com', 'password123').then(r => console.log(r));"
```

### PR #4: Test API Endpoints
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### PR #5: Test Frontend
Open `http://localhost:3000` and use the UI.

## 📚 How Stacked PRs Work

1. **Create PR #1** → Review → Merge to `main`
2. **Create PR #2** based on `main` (which now includes PR #1) → Review → Merge
3. **Create PR #3** based on `main` (which includes PR #1 + PR #2) → Review → Merge
4. Continue this pattern...

### Using Aviator

With Aviator, you can manage this entire stack:

```bash
# Create all branches at once
av stack create auth-schema
av stack create auth-model
av stack create auth-service
av stack create auth-endpoints
av stack create auth-ui

# Submit all PRs
av submit

# If you need to update PR #2, Aviator automatically rebases PRs #3-5
av sync
```

## 🎯 Benefits

- **Smaller PRs**: Each PR is focused and easy to review (~50-200 lines vs 1000+)
- **Parallel work**: Different teams can review different PRs simultaneously
- **Faster reviews**: Smaller diffs = faster feedback
- **Easier rollbacks**: If PR #3 has issues, you can fix it without affecting PR #1 and #2
- **Better git history**: Clear progression of the feature

## 📁 Project Structure

```
stacked_prs/
├── database/
│   ├── schema.sql          # PR #1
│   └── migrate.js          # PR #1
├── models/
│   └── User.js             # PR #2
├── services/
│   └── authService.js      # PR #3
├── routes/
│   └── authRoutes.js       # PR #4
├── public/
│   └── index.html          # PR #5
├── server.js               # Main server (uses all PRs)
├── package.json
└── README.md
```

## 🔐 Environment Variables

Create a `.env` file (optional):

```
JWT_SECRET=your-secret-key-here
PORT=3000
```

## 📝 Notes

- This is a simplified example for demonstration purposes
- In production, use proper environment variables for secrets
- Consider adding input validation, rate limiting, and error handling
- Database migrations should be more robust in production
