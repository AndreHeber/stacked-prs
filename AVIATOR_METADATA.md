# Aviator Metadata Storage

## Location

Aviator stores its metadata in:
```
.git/av/av.db
```

This file is created when you run `av init` and is stored directly in your Git repository's `.git` directory.

## File Format

The metadata file is stored as **JSON** (despite the `.db` extension). It contains information about:
- Branch relationships (parent-child dependencies)
- Pull request information
- Branch commit SHAs
- PR links and states

## Structure

The JSON structure looks like this:

```json
{
  "branches": {
    "branch-name": {
      "name": "branch-name",
      "parent": {
        "name": "parent-branch-name",
        "head": "commit-sha"
      },
      "pullRequest": {
        "id": "PR_kwDO...",
        "number": 1,
        "permalink": "https://github.com/.../pull/1",
        "state": ""
      }
    }
  }
}
```

## Example from This Repository

Here's the actual metadata from this repository:

```json
{
  "branches": {
    "auth-schema": {
      "name": "auth-schema",
      "parent": {
        "name": "main",
        "trunk": true
      },
      "pullRequest": {
        "id": "PR_kwDOQ2-RmM68a0um",
        "number": 1,
        "permalink": "https://github.com/AndreHeber/stacked-prs/pull/1",
        "state": ""
      }
    },
    "auth-model": {
      "name": "auth-model",
      "parent": {
        "name": "auth-schema",
        "head": "a28f4827c70cb213c41b000d8784e11a3aafedf3"
      },
      "pullRequest": {
        "id": "PR_kwDOQ2-RmM68a0wW",
        "number": 2,
        "permalink": "https://github.com/AndreHeber/stacked-prs/pull/2",
        "state": ""
      }
    },
    "auth-service": {
      "name": "auth-service",
      "parent": {
        "name": "auth-model",
        "head": "bfc7224e294d70b79ca8edfb74d3b3ad2d757240"
      },
      "pullRequest": {
        "id": "PR_kwDOQ2-RmM68a00V",
        "number": 3,
        "permalink": "https://github.com/AndreHeber/stacked-prs/pull/3",
        "state": ""
      }
    },
    "auth-endpoints": {
      "name": "auth-endpoints",
      "parent": {
        "name": "auth-service",
        "head": "432ed25be5c1a2928159e73ca86e6b0db8e0788c"
      },
      "pullRequest": {
        "id": "PR_kwDOQ2-RmM68a04m",
        "number": 4,
        "permalink": "https://github.com/AndreHeber/stacked-prs/pull/4",
        "state": ""
      }
    },
    "auth-ui": {
      "name": "auth-ui",
      "parent": {
        "name": "auth-endpoints",
        "head": "ebd5d70a57db7e59926cb0bd1d7b71bbe94c453b"
      },
      "pullRequest": {
        "id": "PR_kwDOQ2-RmM68a06H",
        "number": 5,
        "permalink": "https://github.com/AndreHeber/stacked-prs/pull/5",
        "state": ""
      }
    }
  },
  "repository": {
    "id": "R_kgDOQ2-RmA",
    "owner": "AndreHeber",
    "name": "stacked-prs"
  }
}
```

**Key observations:**
- The base branch (`main`) has `"trunk": true` instead of a `head` SHA
- Each branch stores its parent's commit SHA for precise dependency tracking
- Repository information is also stored at the top level

## What Gets Stored

### Branch Information
- **name**: The branch name
- **parent**: The parent branch this branch is stacked on
  - **name**: Parent branch name
  - **head**: Commit SHA of the parent branch's HEAD

### Pull Request Information
- **id**: GitHub PR ID (internal identifier)
- **number**: PR number
- **permalink**: Full URL to the PR
- **state**: PR state (open, closed, merged, etc.)

## Key Points

### 1. **Version Controlled**
The metadata is stored in `.git/av/`, which means:
- ✅ It's part of your repository
- ✅ It's versioned with Git
- ✅ It's shared when you clone/push the repo
- ⚠️ But `.git/` is typically not committed, so metadata stays local

### 2. **Local Storage**
Since it's in `.git/`, the metadata is:
- Stored locally on each developer's machine
- **NOT automatically synced** across team members
- **NOT committed to Git** (stays in `.git/` which is ignored)
- Must be recreated by each team member

**Important:** When a colleague clones your repository:
- ✅ They can see the branches on GitHub
- ✅ They can see the PRs on GitHub
- ❌ They **cannot** see your Aviator metadata automatically
- ✅ They can use `av adopt` to recreate the stack structure

### 3. **Automatic Updates**
Aviator automatically updates this file when you:
- Create branches (`av branch`)
- Create PRs (`av pr`)
- Sync branches (`av sync`)
- Reparent branches (`av reparent`)

## Inspecting Metadata

### View the File
```bash
cat .git/av/av.db | python3 -m json.tool
# or
cat .git/av/av.db | jq .
```

### Check if Aviator is Initialized
```bash
ls -la .git/av/av.db
```

### View Stack Structure
```bash
av tree
```

## Sharing Metadata with Team Members

### The Problem
When a colleague clones your repository:
- They see branches on GitHub ✅
- They see PRs on GitHub ✅
- They **don't** see your Aviator metadata ❌

### Solution 1: Adopt Remote Branches (Recommended)

Your colleague can recreate the stack structure using `av adopt`:

```bash
# Initialize Aviator
av init

# Adopt branches from remote PRs, starting from the base branch
av adopt --remote auth-schema

# This will:
# - Detect the PR chain from GitHub
# - Recreate the parent-child relationships
# - Build the metadata automatically
```

**How it works:**
- Aviator queries GitHub API to find PR dependencies
- It reconstructs the stack based on PR base branches
- Creates the metadata file automatically

### Solution 2: Manual Adoption

If automatic adoption doesn't work, adopt branches manually:

```bash
av init

# Switch to base branch
git checkout auth-schema
av adopt --parent main

# Switch to next branch
git checkout auth-model
av adopt --parent auth-schema

# Continue for each branch...
```

### Solution 3: Share Metadata File (Not Recommended)

You could manually share the `.git/av/av.db` file, but:
- ⚠️ Requires manual file sharing
- ⚠️ May have commit SHA mismatches
- ⚠️ Can cause conflicts if both people are working
- ✅ `av adopt` is the better approach

## Backup and Migration

### Backup Metadata
```bash
cp .git/av/av.db .git/av/av.db.backup
```

### Restore Metadata
```bash
cp .git/av/av.db.backup .git/av/av.db
```

### Manual Editing (Not Recommended)
You can manually edit `.git/av/av.db`, but:
- ⚠️ Risk of corrupting the stack
- ⚠️ Aviator may overwrite changes
- ✅ Better to use Aviator commands

## Comparison with Other Tools

### Graphite
- Stores metadata in `.graphite/` directory
- Uses similar JSON structure
- Also local to each repository

### git-stack
- Uses Git notes or branch naming conventions
- No separate metadata file
- More Git-native approach

## Troubleshooting

### Metadata Corrupted
If metadata gets corrupted:
```bash
# Remove and reinitialize
rm -rf .git/av/
av init
# Then recreate branches or use `av adopt` to adopt existing branches
```

### Missing Metadata
If `.git/av/av.db` doesn't exist:
```bash
av init
```

### Metadata Out of Sync
If branches exist but metadata is wrong:
```bash
# Adopt existing branches
av adopt <branch-name>
# Or sync everything
av sync
```

## Security Considerations

### What's Stored
- Branch names (public)
- Commit SHAs (public)
- PR numbers and links (public)
- No sensitive data (no tokens, passwords, etc.)

### Privacy
- Metadata is local to your machine
- Not committed to Git (stays in `.git/`)
- Safe to share repository without exposing metadata

## File Size

The metadata file is typically very small:
- Small stacks (5-10 branches): ~1-2 KB
- Medium stacks (20-30 branches): ~5-10 KB
- Large stacks (50+ branches): ~20-50 KB

## Summary

- **Location**: `.git/av/av.db`
- **Format**: JSON (despite `.db` extension)
- **Content**: Branch relationships, PR info, commit SHAs
- **Scope**: Local to repository, not committed to Git
- **Updates**: Automatic via Aviator commands
- **Size**: Small (typically < 10 KB)

This design allows Aviator to:
- Track dependencies without modifying Git history
- Work offline (no API calls needed for basic operations)
- Keep metadata local and private
- Maintain consistency across operations
