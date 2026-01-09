# Aviator Commands Guide - Stacked PRs Setup

This document explains the Aviator commands used to create and manage the stacked PRs in this repository.

## Initial Setup

### 1. Initialize Git Repository
```bash
git init
git remote add origin git@github.com:AndreHeber/stacked-prs.git
git add .gitignore package.json
git commit -m "Initial commit: Add project setup files"
git branch -M main
git push -u origin main
```
**What it did:** Created a new git repository, added the remote, committed initial files, and pushed to GitHub.

### 2. Configure Git Remote HEAD
```bash
git remote set-head --auto origin
```
**What it did:** Set the default branch reference so Aviator can determine the repository's default branch.

### 3. Initialize Aviator
```bash
av init
```
**What it did:** Initialized the repository for use with Aviator CLI. This sets up internal tracking metadata that Aviator uses to manage stacked branches.

---

## Creating Stacked Branches

### 4. Create Branch for PR #1 (Database Schema)
```bash
av branch auth-schema
git add database/schema.sql database/migrate.js
git commit -m "PR #1: Add database schema for users table"
```
**What it did:** 
- Created a new branch `auth-schema` stacked on top of `main`
- Committed the database schema files
- Aviator automatically tracks this as the first branch in the stack

### 5. Create Branch for PR #2 (User Model)
```bash
av branch auth-model
git add models/User.js
git commit -m "PR #2: Add User model using database schema"
```
**What it did:**
- Created `auth-model` branch stacked on top of `auth-schema`
- Committed the User model file
- This branch depends on PR #1

### 6. Create Branch for PR #3 (Auth Service)
```bash
av branch auth-service
git add services/authService.js
git commit -m "PR #3: Add authentication service using User model"
```
**What it did:**
- Created `auth-service` branch stacked on top of `auth-model`
- Committed the authentication service file
- This branch depends on PR #2 (which depends on PR #1)

### 7. Create Branch for PR #4 (API Endpoints)
```bash
av branch auth-endpoints
git add routes/authRoutes.js
git commit -m "PR #4: Add API endpoints using AuthService"
```
**What it did:**
- Created `auth-endpoints` branch stacked on top of `auth-service`
- Committed the API routes file
- This branch depends on PR #3

### 8. Create Branch for PR #5 (Frontend UI)
```bash
av branch auth-ui
git add public/index.html server.js README.md
git commit -m "PR #5: Add frontend UI and server setup"
```
**What it did:**
- Created `auth-ui` branch stacked on top of `auth-endpoints`
- Committed frontend and server files
- This branch depends on PR #4

---

## Pushing Branches

### 9. Push All Branches to Remote
```bash
git push --all origin
```
**What it did:** Pushed all local branches (auth-schema, auth-model, auth-service, auth-endpoints, auth-ui) to GitHub so they're available for creating pull requests.

---

## Creating Pull Requests

### 10. Navigate to PR #1 Branch
```bash
av switch auth-schema
```
**What it did:** Switched to the `auth-schema` branch. `av switch` is Aviator's way to navigate between branches in the stack.

### 11. Create PR #1
```bash
av pr --title "PR #1: Add database schema for users table" \
      --body "This PR creates the database schema needed for user authentication.

- Creates users table with email, password_hash, and timestamps
- Adds migration script to set up the database
- This is the foundation for all subsequent authentication PRs"
```
**What it did:**
- Created pull request #1 on GitHub
- Automatically pushed the branch if needed
- Set the title and description
- **Result:** https://github.com/AndreHeber/stacked-prs/pull/1

### 12. Navigate to Next Branch
```bash
av next
```
**What it did:** Switched to the next branch in the stack (`auth-model`). This is Aviator's way to move forward through stacked branches.

### 13. Create PR #2
```bash
av pr --title "PR #2: Add User model using database schema" \
      --body "This PR adds the User model that interacts with the database schema from PR #1.

- Implements User.create(), findByEmail(), and findById() methods
- Adds password hashing using bcrypt
- Provides password verification functionality
- Depends on PR #1 (database schema)"
```
**What it did:**
- Created pull request #2 on GitHub
- **Result:** https://github.com/AndreHeber/stacked-prs/pull/2

### 14. Continue Creating PRs
```bash
av next  # Switch to auth-service
av pr --title "PR #3: Add authentication service using User model" --body "..."
av next  # Switch to auth-endpoints
av pr --title "PR #4: Add API endpoints using AuthService" --body "..."
av next  # Switch to auth-ui
av pr --title "PR #5: Add frontend UI and server setup" --body "..."
```
**What it did:** Created PRs #3, #4, and #5 following the same pattern.

---

## Useful Aviator Commands

### View Stack Structure
```bash
av tree
```
**What it does:** Shows a visual tree of all branches in the stack with their PR links.

**Example output:**
```
  * auth-ui (HEAD)                                  
  │ https://github.com/AndreHeber/stacked-prs/pull/5
  │                                                 
  * auth-endpoints                                  
  │ https://github.com/AndreHeber/stacked-prs/pull/4
  │                                                 
  * auth-service                                    
  │ https://github.com/AndreHeber/stacked-prs/pull/3
  │                                                 
  * auth-model                                      
  │ https://github.com/AndreHeber/stacked-prs/pull/2
  │                                                 
  * auth-schema                                     
  │ https://github.com/AndreHeber/stacked-prs/pull/1
  │                                                 
  * main
```

### Navigate Between Branches
```bash
av next        # Move to next branch in stack
av prev        # Move to previous branch in stack
av switch <branch-name>  # Switch to specific branch
```

### Sync Stack After Changes
```bash
av sync
```
**What it does:** If you make changes to an earlier PR (e.g., PR #2), this automatically rebases all dependent PRs (#3, #4, #5) on top of the updated branch. This is one of Aviator's most powerful features!

### Create PRs for All Branches at Once
```bash
av pr --all
```
**What it does:** Creates pull requests for every branch in the stack (up to the current branch). Useful when you want to create all PRs at once without custom titles/descriptions.

### View PR Status
```bash
av pr status
```
**What it does:** Shows the status of the pull request associated with the current branch.

---

## Key Concepts

### Branch Stacking
When you use `av branch <name>`, Aviator:
1. Creates a new branch based on the current branch
2. Tracks the parent-child relationship internally
3. Maintains the dependency chain automatically

### Dependency Chain
The branches form a dependency chain:
```
main → auth-schema → auth-model → auth-service → auth-endpoints → auth-ui
```

Each PR depends on the previous one, and Aviator ensures they stay in sync.

### Automatic Rebasing
When you run `av sync` or `av restack`, Aviator:
1. Detects which branches need updating
2. Automatically rebases dependent branches
3. Updates pull requests if they already exist

This means if you fix a bug in PR #2, PRs #3-5 automatically get the fix!

---

## Workflow Summary

1. **Setup:** `av init` to initialize Aviator
2. **Create branches:** Use `av branch <name>` to create stacked branches
3. **Make commits:** Use regular `git add` and `git commit` on each branch
4. **Push:** `git push --all origin` to push all branches
5. **Create PRs:** Use `av pr` on each branch to create pull requests
6. **Navigate:** Use `av next`/`av prev` to move between branches
7. **Update:** Use `av sync` to rebase dependent PRs after changes

---

## Created Pull Requests

- [PR #1](https://github.com/AndreHeber/stacked-prs/pull/1): Database schema
- [PR #2](https://github.com/AndreHeber/stacked-prs/pull/2): User model
- [PR #3](https://github.com/AndreHeber/stacked-prs/pull/3): Auth service
- [PR #4](https://github.com/AndreHeber/stacked-prs/pull/4): API endpoints
- [PR #5](https://github.com/AndreHeber/stacked-prs/pull/5): Frontend UI

All PRs are properly linked with dependencies and ready for review!
