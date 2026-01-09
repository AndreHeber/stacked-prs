# Team Collaboration with Aviator

## Can Colleagues See Your Stacked PRs?

**Short answer:** Yes, but with a caveat.

### What They Can See ✅
- **Pull Requests on GitHub** - All PRs are visible to anyone with repo access
- **Branches on GitHub** - All branches are visible
- **PR relationships** - GitHub shows which branch each PR is based on
- **Code changes** - All code in PRs is visible

### What They Cannot See Automatically ❌
- **Aviator metadata** - The `.git/av/av.db` file is local only
- **Stack structure in Aviator** - They won't see `av tree` output until they set it up
- **Local branch relationships** - Aviator's internal tracking

## Setting Up Aviator for a Shared Repository

### Scenario: You Created Stacked PRs, Colleague Wants to Work With Them

**Step 1: Colleague Clones Repository**
```bash
git clone git@github.com:AndreHeber/stacked-prs.git
cd stacked-prs
```

**Step 2: Colleague Initializes Aviator**
```bash
av init
```

**Step 3: Colleague Adopts Remote Branches**

Option A: Automatic adoption (if Aviator can detect PR chain):
```bash
# Adopt starting from the base branch
av adopt --remote auth-schema
```

This will:
- Query GitHub API for PR information
- Detect which PRs depend on which
- Recreate the stack structure automatically
- Build the metadata file

Option B: Manual adoption (if automatic doesn't work):
```bash
# Fetch all branches
git fetch --all

# Adopt each branch in order
git checkout auth-schema
av adopt --parent main

git checkout auth-model
av adopt --parent auth-schema

git checkout auth-service
av adopt --parent auth-model

git checkout auth-endpoints
av adopt --parent auth-service

git checkout auth-ui
av adopt --parent auth-endpoints
```

**Step 4: Verify Stack Structure**
```bash
av tree
```

Should show the same structure you see!

## Working Together on Stacked PRs

### Scenario 1: You Update PR #2, Colleague Needs Updates

**You:**
```bash
av switch auth-model
# Make changes
git commit -am "Add email validation"
av sync  # Updates dependent PRs
```

**Colleague:**
```bash
# Fetch your changes
git fetch origin

# Update their local branches
av sync  # Rebuilds stack with your changes
```

### Scenario 2: Colleague Wants to Add a New PR

**Colleague:**
```bash
# Make sure they're on the latest
av sync

# Create new branch
av branch new-feature

# Work on it, commit, create PR
git add ...
git commit -m "New feature"
av pr --title "New feature" --body "..."
```

**You:**
```bash
# Fetch their new branch
git fetch origin

# Adopt it into your stack
av adopt --remote new-feature
# or manually:
git checkout new-feature
av adopt --parent auth-ui  # or whatever parent it should have
```

### Scenario 3: Colleague Reviews and Merges PR #1

**Colleague (or you) merges PR #1 on GitHub**

**Everyone:**
```bash
# Fetch merged changes
git fetch origin
git checkout main
git pull

# Sync stack (updates all dependent PRs)
av sync
```

This automatically:
- Updates PR #2 to base on updated `main`
- Updates PR #3 to base on updated PR #2
- And so on...

## Best Practices for Team Collaboration

### 1. **Always Use `av sync` After Merges**
When any PR in the stack is merged:
```bash
av sync
```

### 2. **Communicate Stack Changes**
If you:
- Add a new PR to the stack
- Reorder PRs
- Reparent a branch

Let your team know so they can update their local metadata.

### 3. **Use Descriptive Branch Names**
Good names help colleagues understand the stack:
```bash
# Good
auth-schema
auth-model
auth-service

# Bad
feature-1
feature-2
feature-3
```

### 4. **Document PR Dependencies**
Always mention dependencies in PR descriptions:
```
Depends on PR #1
Blocks PR #3
```

### 5. **Regular Syncs**
Encourage team members to run `av sync` regularly:
```bash
# At start of day
av sync

# After pulling changes
git pull
av sync

# Before creating new PRs
av sync
```

## Troubleshooting

### Issue: Colleague's `av tree` Shows Different Structure

**Solution:**
```bash
# Remove old metadata
rm -rf .git/av/

# Reinitialize
av init

# Re-adopt branches
av adopt --remote auth-schema
```

### Issue: `av adopt --remote` Doesn't Work

**Possible causes:**
- GitHub API rate limiting
- Missing GitHub token/permissions
- PRs not properly linked on GitHub

**Solution:** Use manual adoption (see above)

### Issue: Metadata Conflicts

If two people modify the same branch:
- Git handles the merge normally
- Run `av sync` after resolving conflicts
- Aviator will rebuild metadata

### Issue: Missing PR Links

If `av tree` shows "No pull request" for a branch:
```bash
# Create PR if it doesn't exist
av pr --title "..." --body "..."

# Or link existing PR
av pr  # This should detect existing PR
```

## Alternative: Commit Metadata (Not Recommended)

You *could* commit the metadata file, but it's not recommended:

```bash
# Add to .gitignore removal (don't do this)
git add -f .git/av/av.db
git commit -m "Share Aviator metadata"
```

**Why not recommended:**
- ⚠️ Commit SHAs may differ between developers
- ⚠️ Can cause merge conflicts
- ⚠️ Metadata can get out of sync
- ✅ `av adopt` is the proper way

## Summary

**Question:** Can a colleague see your stacked PRs?

**Answer:**
- ✅ **Yes** - They can see PRs on GitHub
- ✅ **Yes** - They can see branches on GitHub  
- ❌ **No** - They cannot see your local Aviator metadata automatically
- ✅ **Yes** - They can recreate it using `av adopt --remote`

**Workflow:**
1. You create stacked PRs
2. Colleague clones repo
3. Colleague runs `av init`
4. Colleague runs `av adopt --remote <base-branch>`
5. Both of you can now work with the same stack structure!

The key is that **Aviator can reconstruct the stack from GitHub PR information**, so you don't need to manually share metadata files.
