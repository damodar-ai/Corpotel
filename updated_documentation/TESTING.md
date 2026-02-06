# Testing Guide

## Current Test Setup

The project uses:
- **Backend**: TypeScript with ts-node
- **Frontend**: Vite with React Testing Library (recommended)

## Running Tests

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

## Test Structure

### Backend Tests
```
backend/
├── __tests__/
│   ├── auth.test.ts
│   ├── bookings.test.ts
│   └── hotels.test.ts
```

### Frontend Tests
```
frontend/
├── src/
│   ├── __tests__/
│   │   ├── components/
│   │   └── pages/
│   └── setupTests.ts
```

## Writing Tests

### Backend API Test Example
```typescript
import request from 'supertest';
import app from '../server';

describe('POST /api/auth/login', () => {
  it('should return token for valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'TestPassword123'
      });
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should return 401 for invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
    
    expect(res.status).toBe(401);
  });
});
```

### Frontend Component Test Example
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { LoginPage } from '../pages/LoginPage';

describe('LoginPage', () => {
  it('renders login form', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('validates email format', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });
});
```

## Test Configuration

### Jest Config (jest.config.js)
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70
    }
  }
};
```

## Coverage Requirements

| Metric | Minimum |
|--------|---------|
| Branches | 70% |
| Functions | 70% |
| Lines | 70% |

## CI Integration

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm test -- --coverage
```
