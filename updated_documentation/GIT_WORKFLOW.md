# Git Workflow

## Branch Strategy

```
main
  │
  ├── develop
  │     │
  │     ├── feature/add-booking-filter
  │     ├── feature/hotel-search
  │     └── fix/login-validation
  │
  └── release/v1.0.0
```

## Branch Types

| Branch | Purpose | Base | Merge To |
|--------|---------|------|----------|
| `main` | Production | - | - |
| `develop` | Integration | main | main |
| `feature/*` | New features | develop | develop |
| `fix/*` | Bug fixes | develop | develop |
| `hotfix/*` | Production fixes | main | main, develop |
| `release/*` | Release prep | develop | main, develop |

---

## Workflow

### Feature Development
```bash
# 1. Start from develop
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/your-feature

# 3. Work and commit
git add .
git commit -m "feat: add your feature"

# 4. Push and create PR
git push origin feature/your-feature
```

### Pull Request
1. Create PR to `develop`
2. Request review
3. Pass CI checks
4. Merge (squash preferred)

---

## Commit Convention

Format: `<type>: <description>`

### Types
| Type | When to use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Formatting (no code change) |
| `refactor` | Code restructure |
| `test` | Adding tests |
| `chore` | Build, config |

### Examples
```
feat: add hotel search filters
fix: resolve date validation bug
docs: update API documentation
refactor: simplify booking logic
test: add auth unit tests
```

---

## Release Process

```bash
# 1. Create release branch
git checkout develop
git checkout -b release/v1.1.0

# 2. Version bump, final fixes
# Update package.json versions

# 3. Merge to main
git checkout main
git merge release/v1.1.0
git tag v1.1.0
git push origin main --tags

# 4. Merge back to develop
git checkout develop
git merge release/v1.1.0
git push origin develop

# 5. Delete release branch
git branch -d release/v1.1.0
```

---

## Rules

1. Never commit directly to `main`
2. Always use PRs
3. Squash merge to keep history clean
4. Delete branches after merge
5. Tag all releases
