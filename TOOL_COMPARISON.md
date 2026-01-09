# Stacked PR Tools Comparison

Yes, tools like `stack-pr`, `spr`, and others are similar to Aviator. They all help manage stacked pull requests, but each has its own approach and features. This document compares the main tools available.

## Overview

All these tools solve the same core problem: **managing dependent pull requests that build on each other**. They differ in:
- User interface (CLI vs GUI vs web)
- Integration depth (GitHub, GitLab, etc.)
- Feature set (auto-rebasing, PR management, etc.)
- Pricing model (open source vs paid)

---

## Tools Comparison

### 1. **Aviator** (`av`)

**Type:** CLI tool  
**Platform:** GitHub  
**Pricing:** Free (open source)  
**Language:** Go

**Key Features:**
- ✅ Branch stacking and dependency management
- ✅ Automatic rebasing with `av sync`
- ✅ PR creation and management
- ✅ Branch navigation (`av next`, `av prev`)
- ✅ Stack visualization (`av tree`)
- ✅ Branch reordering and reparenting

**Commands:**
```bash
av init              # Initialize repository
av branch <name>     # Create stacked branch
av pr                # Create pull request
av sync              # Sync/rebase stack
av tree              # Visualize stack
```

**Best For:**
- CLI-focused workflows
- GitHub repositories
- Teams wanting full control over the process
- Open source projects

**Website:** https://github.com/getaviator/cli

---

### 2. **Graphite** (`gt`)

**Type:** CLI + Web Dashboard  
**Platform:** GitHub  
**Pricing:** Free tier + Paid plans  
**Language:** TypeScript

**Key Features:**
- ✅ CLI for branch management
- ✅ Web dashboard for PR visualization
- ✅ Automatic PR creation and updates
- ✅ Smart rebasing and conflict resolution
- ✅ PR queue management
- ✅ Integration with GitHub

**Commands:**
```bash
gt stack create       # Create new branch in stack
gt stack submit       # Submit all PRs
gt stack sync         # Sync stack
gt stack restack      # Rebase stack
```

**Best For:**
- Teams wanting a visual dashboard
- Complex stacks with many PRs
- Need for PR queue management
- GitHub-focused workflows

**Website:** https://graphite.dev

---

### 3. **spr** (Stacked Pull Requests)

**Type:** CLI tool  
**Platform:** GitHub  
**Pricing:** Open source  
**Language:** Go

**Key Features:**
- ✅ Branch stacking
- ✅ PR creation and management
- ✅ Automatic rebasing
- ✅ Integration with GitHub API
- ✅ Simple, focused toolset

**Commands:**
```bash
spr checkout         # Checkout branch
spr submit           # Submit PRs
spr update           # Update stack
```

**Best For:**
- Simple workflows
- Minimal tooling preference
- GitHub repositories
- Open source projects

**Website:** https://github.com/getcord/spr (or similar implementations)

---

### 4. **stack-pr**

**Type:** CLI tool  
**Platform:** GitHub/GitLab  
**Pricing:** Open source  
**Language:** Various (Python, Node.js implementations exist)

**Key Features:**
- ✅ Basic branch stacking
- ✅ PR creation
- ✅ Dependency management
- ✅ Cross-platform support

**Best For:**
- Simple use cases
- Multi-platform needs (GitHub + GitLab)
- Custom workflows

---

### 5. **git-stack**

**Type:** CLI tool  
**Platform:** Git (platform agnostic)  
**Pricing:** Open source  
**Language:** Shell/Python

**Key Features:**
- ✅ Pure Git-based (no API dependencies)
- ✅ Works with any Git hosting
- ✅ Simple branch management
- ✅ No external dependencies

**Best For:**
- Platform-agnostic workflows
- Minimal dependencies
- Custom Git hosting solutions

---

## Feature Comparison Matrix

| Feature | Aviator | Graphite | spr | stack-pr | git-stack |
|---------|---------|----------|-----|----------|-----------|
| **CLI Interface** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Web Dashboard** | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Auto Rebase** | ✅ | ✅ | ✅ | ⚠️ | ⚠️ |
| **PR Creation** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Stack Visualization** | ✅ (tree) | ✅ (web) | ⚠️ | ❌ | ❌ |
| **GitHub Integration** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **GitLab Support** | ❌ | ❌ | ❌ | ⚠️ | ✅ |
| **Branch Navigation** | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ |
| **Open Source** | ✅ | ⚠️ (partially) | ✅ | ✅ | ✅ |
| **Pricing** | Free | Freemium | Free | Free | Free |

---

## Detailed Comparison

### **Aviator vs Graphite**

**Aviator Advantages:**
- ✅ Fully open source
- ✅ No account required
- ✅ Simple, focused CLI
- ✅ Lightweight

**Graphite Advantages:**
- ✅ Visual dashboard
- ✅ Better conflict resolution
- ✅ PR queue management
- ✅ More polished UX

**When to Choose Aviator:**
- You prefer CLI-only workflows
- Want full control and transparency
- Don't need a web dashboard
- Working on open source projects

**When to Choose Graphite:**
- You want visual PR management
- Need better conflict resolution
- Working with large teams
- Want PR queue features

---

### **Aviator vs spr**

**Similarities:**
- Both are CLI tools
- Both are open source
- Both focus on GitHub
- Similar command structure

**Differences:**
- Aviator has more features (tree view, navigation)
- spr may be simpler/more minimal
- Aviator has better documentation
- spr may have different rebasing strategy

**When to Choose:**
- Both are good choices for CLI-focused workflows
- Choose based on specific feature needs
- Check community and maintenance status

---

## Migration Between Tools

### From Aviator to Graphite

```bash
# Aviator branches are just Git branches
# Graphite can adopt existing branches
gt stack adopt <branch-name>
```

### From Graphite to Aviator

```bash
# Graphite branches are standard Git branches
# Aviator can adopt them
av adopt <branch-name>
```

**Note:** Both tools use standard Git branches, so migration is usually straightforward. The main difference is in metadata/metadata storage.

---

## Which Tool Should You Use?

### Choose **Aviator** if:
- ✅ You want a simple, focused CLI tool
- ✅ You prefer open source solutions
- ✅ You don't need a web dashboard
- ✅ You want full control over the process
- ✅ You're working on GitHub

### Choose **Graphite** if:
- ✅ You want visual PR management
- ✅ You need better conflict resolution
- ✅ You work with large teams
- ✅ You want PR queue features
- ✅ You're okay with a freemium model

### Choose **spr** if:
- ✅ You want a minimal tool
- ✅ You prefer simplicity
- ✅ You're comfortable with fewer features
- ✅ You want open source

### Choose **git-stack** if:
- ✅ You need platform-agnostic solution
- ✅ You use custom Git hosting
- ✅ You want minimal dependencies
- ✅ You prefer pure Git workflows

---

## Common Workflow Patterns

All tools follow similar patterns:

### Pattern 1: Create Stack
```bash
# Aviator
av branch feature-1
av branch feature-2
av branch feature-3

# Graphite
gt stack create feature-1
gt stack create feature-2
gt stack create feature-3

# spr
spr checkout feature-1
spr checkout feature-2
spr checkout feature-3
```

### Pattern 2: Submit PRs
```bash
# Aviator
av pr --all

# Graphite
gt stack submit

# spr
spr submit
```

### Pattern 3: Sync Stack
```bash
# Aviator
av sync

# Graphite
gt stack sync

# spr
spr update
```

---

## Recommendations

### For This Project (stacked-prs example)

**Aviator** is a good choice because:
- ✅ It's what we're already using
- ✅ Fully open source
- ✅ Good documentation
- ✅ Simple workflow
- ✅ No account required

### For Teams

**Graphite** might be better if:
- Team members want visual PR management
- You need better conflict resolution
- You have complex stacks

**Aviator** is better if:
- Team prefers CLI workflows
- You want full transparency
- You're cost-conscious

---

## Conclusion

All these tools solve the same problem: **managing stacked pull requests**. They differ mainly in:
- **Interface** (CLI vs GUI)
- **Features** (basic vs advanced)
- **Integration** (GitHub-only vs multi-platform)
- **Pricing** (free vs freemium)

**Key Takeaway:** Choose based on your team's preferences and needs. For most projects, **Aviator** or **Graphite** are the best choices, with Aviator being more CLI-focused and Graphite offering more features and a web interface.

---

## Resources

- **Aviator:** https://github.com/getaviator/cli
- **Graphite:** https://graphite.dev
- **spr:** Search GitHub for "spr stacked pull requests"
- **git-stack:** Search GitHub for "git-stack"

---

## Notes

- Tool features and availability may change over time
- Check each tool's documentation for latest features
- Consider your team's workflow preferences
- Try multiple tools to see which fits best
