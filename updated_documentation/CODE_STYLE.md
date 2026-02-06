# Code Style Guide

## General Principles

1. **Readability** over cleverness
2. **Consistency** across codebase
3. **Self-documenting** code with clear names
4. **DRY** (Don't Repeat Yourself)

---

## TypeScript/JavaScript

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Variables | camelCase | `userEmail` |
| Constants | SCREAMING_SNAKE | `MAX_RETRIES` |
| Functions | camelCase | `getUserById` |
| Classes | PascalCase | `HotelService` |
| Interfaces | PascalCase | `BookingRequest` |
| React Components | PascalCase | `BrowseHotelsPage` |

### Files

| Type | Convention | Example |
|------|------------|---------|
| React Pages | PascalCase | `BookingsPage.tsx` |
| React Components | PascalCase | `Header.tsx` |
| Routes | camelCase | `bookings.ts` |
| Utils | camelCase | `helpers.ts` |

### Code Structure

```typescript
// Imports first (external, then internal)
import express from 'express';
import { authMiddleware } from '../middleware/auth';

// Constants
const MAX_RESULTS = 50;

// Interfaces/Types
interface User {
  id: number;
  email: string;
}

// Functions
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Exports
export { validateEmail };
```

---

## React Conventions

### Component Structure
```tsx
// 1. Imports
import React, { useState, useEffect } from 'react';

// 2. Types/Interfaces
interface Props {
  title: string;
}

// 3. Component
export const MyComponent: React.FC<Props> = ({ title }) => {
  // 4. Hooks
  const [data, setData] = useState([]);
  
  // 5. Effects
  useEffect(() => {
    // ...
  }, []);
  
  // 6. Handlers
  const handleClick = () => {
    // ...
  };
  
  // 7. Render
  return <div>{title}</div>;
};
```

### Hooks
- Custom hooks start with `use`: `useAuth`, `useBookings`
- Keep hooks at top of component

---

## SQL

- Keywords: UPPERCASE (`SELECT`, `FROM`, `WHERE`)
- Table names: PascalCase (`HotelDetails`)
- Column names: PascalCase (`BookingStatus`)
- Use parameterized queries (never string interpolation)

---

## Comments

```typescript
// Single line: Explain non-obvious logic

/**
 * Multi-line: For function documentation
 * @param userId - The user's ID
 * @returns The user object or null
 */
function getUser(userId: number): User | null {
  // ...
}
```

---

## Formatting

- Indent: 2 spaces
- Max line length: 100 characters
- Semicolons: Required
- Quotes: Single quotes
- Trailing commas: ES5 style
