# Contributing Guide

Thank you for considering contributing to CorpHotel!

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch: `git checkout -b feature/your-feature`
4. Make your changes
5. Run tests: `npm test`
6. Commit: `git commit -m "feat: add your feature"`
7. Push: `git push origin feature/your-feature`
8. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/corp-hotel.git
cd corp-hotel

# Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install

# Setup environment
cp updated_documentation/env.example backend/.env

# Start development
npm run dev
```

## Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Use meaningful variable/function names
- Add JSDoc comments for public functions
- Keep components small and focused

## Commit Convention

We use [Conventional Commits](https://conventionalcommits.org/):

```
feat: add user authentication
fix: resolve booking date validation
docs: update API documentation
refactor: simplify hotel search logic
test: add unit tests for booking service
```

## Pull Request Guidelines

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Keep PRs focused and small
5. Reference related issues

## Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation only
- `refactor/` - Code refactoring

## Questions?

Open an issue or contact the maintainers.
