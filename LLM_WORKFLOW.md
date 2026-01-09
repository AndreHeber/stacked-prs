# LLM-Assisted Development Workflow with Stacked PRs

This document describes how to use an LLM (like Cursor's Composer, GitHub Copilot, or ChatGPT) to implement features using stacked PRs. This workflow combines AI assistance with best practices for code review and incremental development.

## Overview

The workflow follows this pattern:
1. **Plan** - LLM analyzes the feature and breaks it into logical PRs
2. **Implement** - LLM creates code for each PR incrementally
3. **Stack** - Use Aviator to create stacked branches
4. **Review** - Each PR can be reviewed independently
5. **Iterate** - Make changes and let Aviator handle rebasing

---

## Workflow Steps

### Phase 1: Planning & Design

**You (Human):**
```
"Implement user authentication with email/password. Include registration, 
login, password reset, and JWT tokens."
```

**LLM Response:**
```
I'll break this into 5 stacked PRs:

PR #1: Database schema (users table, password_reset_tokens table)
PR #2: User model with password hashing
PR #3: Authentication service (register, login, token generation)
PR #4: Password reset service
PR #5: API endpoints (register, login, reset-password, reset-confirm)
PR #6: Frontend UI (login, register, forgot password forms)
```

**Action:** Review the plan, adjust if needed, then proceed.

---

### Phase 2: Implementation - PR by PR

#### Step 1: Create Stack Structure

**You (Human):**
```
"Create the stacked branches for the authentication feature"
```

**LLM Actions:**
```bash
# Initialize if needed
av init

# Create all branches upfront
av branch auth-schema
av branch auth-model  
av branch auth-service
av branch auth-password-reset
av branch auth-endpoints
av branch auth-ui
```

**Why:** Creating branches upfront helps the LLM understand the full scope and dependencies.

---

#### Step 2: Implement PR #1 (Foundation)

**You (Human):**
```
"Implement PR #1: Database schema"
```

**LLM Actions:**
1. Switch to `auth-schema` branch: `av switch auth-schema`
2. Create database files:
   - `database/schema.sql` - SQL schema
   - `database/migrate.js` - Migration script
3. Commit: `git add database/ && git commit -m "PR #1: Add database schema"`
4. Create PR: `av pr --title "PR #1: Database schema" --body "..."`

**LLM Code Output:**
- Creates schema.sql with users and password_reset_tokens tables
- Creates migration script
- Adds appropriate indexes

**You Review:** Check the schema design, then approve or request changes.

---

#### Step 3: Implement PR #2 (Model Layer)

**You (Human):**
```
"Now implement PR #2: User model"
```

**LLM Actions:**
1. Switch to next branch: `av next` (or `av switch auth-model`)
2. Read PR #1 files to understand the schema
3. Create `models/User.js`:
   - Uses schema from PR #1
   - Implements create, findByEmail, findById
   - Adds password hashing with bcrypt
4. Commit: `git add models/User.js && git commit -m "PR #2: Add User model"`
5. Create PR: `av pr --title "PR #2: User model" --body "Depends on PR #1"`

**LLM Code Output:**
- User model that references the database schema
- Password hashing logic
- Helper methods

**You Review:** Check model implementation, test password hashing.

---

#### Step 4: Implement PR #3 (Business Logic)

**You (Human):**
```
"Implement PR #3: Authentication service"
```

**LLM Actions:**
1. Switch: `av next`
2. Read User model from PR #2
3. Create `services/authService.js`:
   - Uses User model from PR #2
   - Implements register(), login()
   - Adds JWT token generation
4. Commit and create PR

**LLM Code Output:**
- Service that uses the User model
- JWT token logic
- Error handling

**You Review:** Check business logic, security considerations.

---

#### Step 5: Continue Pattern

The LLM continues this pattern for each PR:
- Switch to next branch
- Read dependencies from previous PRs
- Implement new code
- Commit and create PR
- Wait for review feedback

---

### Phase 3: Review & Iteration

#### Scenario A: Request Changes to PR #2

**You (Human):**
```
"PR #2 needs to add email validation"
```

**LLM Actions:**
1. Switch to PR #2: `av switch auth-model`
2. Add email validation to User model
3. Commit: `git commit -am "Add email validation"`
4. **Critical:** Run `av sync` to rebase dependent PRs

**What `av sync` does:**
- Automatically rebases PR #3, #4, #5, #6 on top of updated PR #2
- Updates all dependent PRs with the changes
- No manual rebasing needed!

**You Review:** Check that dependent PRs still work with the updated model.

---

#### Scenario B: Add New PR Mid-Stack

**You (Human):**
```
"We need to add rate limiting. Insert it between PR #4 and PR #5"
```

**LLM Actions:**
1. Switch to PR #4: `av switch auth-password-reset`
2. Create new branch: `av branch auth-rate-limit --parent auth-password-reset`
3. Reparent PR #5: `av reparent auth-endpoints auth-rate-limit`
4. Implement rate limiting middleware
5. Commit and create PR

**Result:** New PR #5 (rate limiting), old PR #5 becomes PR #6 (endpoints), PR #6 becomes PR #7 (UI)

---

### Phase 4: Merging

**You (Human):**
```
"Merge PR #1"
```

**Action:** Merge PR #1 on GitHub

**LLM/You:**
```bash
# After PR #1 is merged
av sync  # Updates all dependent PRs to base on updated main
```

**Continue:** Merge PRs in order (#1 → #2 → #3 → #4 → #5 → #6)

After each merge:
- Aviator automatically updates dependent PRs
- No manual rebasing needed
- PRs stay clean and reviewable

---

## Example: Complete Feature Implementation

### Feature Request
```
"Add a comments system to blog posts. Users can comment, edit their own 
comments, and moderators can delete any comment."
```

### LLM Planning Phase

**LLM Analysis:**
```
Breaking this into stacked PRs:

PR #1: Database schema
  - comments table (id, post_id, user_id, content, created_at, updated_at)
  - comment_edits table (for edit history)

PR #2: Comment model
  - Comment.create(), findByPost(), findById()
  - Comment.update(), Comment.delete()
  - Edit history tracking

PR #3: Comment service
  - createComment(), updateComment(), deleteComment()
  - Permission checks (user can edit own, moderator can delete any)
  - Edit history management

PR #4: API endpoints
  - POST /api/posts/:id/comments
  - PUT /api/comments/:id
  - DELETE /api/comments/:id
  - GET /api/posts/:id/comments

PR #5: Frontend components
  - CommentForm component
  - CommentList component
  - Edit/Delete buttons with permission checks
```

### Implementation Flow

```bash
# 1. Create branches
av branch comments-schema
av branch comments-model
av branch comments-service
av branch comments-endpoints
av branch comments-ui

# 2. Implement PR #1
av switch comments-schema
# LLM creates database/schema.sql, database/migrate.js
git add database/ && git commit -m "PR #1: Add comments schema"
av pr --title "PR #1: Comments database schema" --body "..."

# 3. Implement PR #2
av next
# LLM creates models/Comment.js using schema from PR #1
git add models/Comment.js && git commit -m "PR #2: Add Comment model"
av pr --title "PR #2: Comment model" --body "Depends on PR #1"

# 4. Continue pattern...
```

---

## Benefits of This Workflow

### 1. **Incremental Review**
- Each PR is small and focused
- Reviewers can understand changes easily
- Can merge independently when ready

### 2. **Parallel Work**
- Frontend team can review PR #5 while backend reviews PR #3
- Database team reviews PR #1 while others work on later PRs

### 3. **Easy Iteration**
- Changes to PR #2 automatically propagate via `av sync`
- No manual rebasing headaches
- LLM can fix issues without breaking dependent PRs

### 4. **Clear Dependencies**
- Explicit dependency chain
- Easy to understand what depends on what
- Can test each layer independently

### 5. **Better Git History**
- Clean, linear history
- Each commit is meaningful
- Easy to understand feature evolution

---

## LLM Prompt Templates

### Initial Feature Request
```
Implement [feature description]. Break it down into stacked PRs and 
implement them one by one. Use Aviator to manage the stack.
```

### Request Changes
```
PR #[number] needs [change description]. Update it and sync dependent PRs.
```

### Add New PR
```
We need to add [feature] between PR #[X] and PR #[Y]. Insert a new PR 
in the stack.
```

### Review Feedback
```
PR #[number] looks good, but [specific feedback]. Update and sync.
```

---

## Common Patterns

### Pattern 1: Database-First Features
```
PR #1: Schema
PR #2: Models
PR #3: Services
PR #4: API
PR #5: Frontend
```

### Pattern 2: API-First Features
```
PR #1: API contracts/types
PR #2: Service implementation
PR #3: API endpoints
PR #4: Frontend integration
```

### Pattern 3: Frontend Features
```
PR #1: Component structure
PR #2: Styling/theming
PR #3: State management
PR #4: API integration
PR #5: Tests
```

---

## Best Practices

### 1. **Plan Before Coding**
- Have LLM break down the feature first
- Review the plan before implementation
- Adjust PR boundaries if needed

### 2. **One PR at a Time**
- Implement and review PR #1 before moving to PR #2
- Don't create all PRs at once (unless you're confident in the plan)

### 3. **Use `av sync` Frequently**
- After any change to an earlier PR
- After merging a PR
- Before creating new PRs

### 4. **Keep PRs Focused**
- Each PR should do one thing well
- If a PR is getting too large, split it
- Use `av branch --split` if needed

### 5. **Test Each Layer**
- Test PR #1 independently (database)
- Test PR #2 with PR #1 (model + database)
- Continue testing incrementally

### 6. **Document Dependencies**
- Always mention dependencies in PR descriptions
- Use "Depends on PR #X" format
- Link to dependent PRs

---

## Troubleshooting

### Issue: PR #3 is broken after updating PR #2
**Solution:** Run `av sync` to rebase PR #3 on updated PR #2

### Issue: Need to reorder PRs
**Solution:** Use `av reorder` to interactively reorder the stack

### Issue: PR has too many changes
**Solution:** Use `av branch --split` to split the last commit into a new branch

### Issue: Want to abandon a PR
**Solution:** Use `av orphan <branch>` to remove it from the stack

---

## Tools Integration

### With Cursor/Composer
- Use Composer to implement each PR
- Composer understands the codebase context
- Can read previous PRs to understand dependencies

### With GitHub Copilot
- Use Copilot Chat to plan PRs
- Use inline suggestions for implementation
- Review each PR before committing

### With ChatGPT/Claude
- Provide full context of previous PRs
- Ask for implementation of specific PR
- Review output before committing

---

## Conclusion

This workflow combines:
- **AI assistance** for faster implementation
- **Stacked PRs** for better code review
- **Aviator** for dependency management
- **Incremental development** for safer changes

The result: Faster development with better code quality and easier reviews.
