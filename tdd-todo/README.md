# TDD Todo App

A test-driven development (TDD) todo application built with React, TypeScript, and Node.js in a monorepo structure.

## Project Structure

```
tdd-todo/
├── packages/
│   ├── backend/          # Express API server
│   └── frontend/         # React application
└── package.json          # Monorepo root
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Node.js, Express, TypeScript
- **Testing**: Jest (backend), Vitest (frontend unit), Playwright (E2E)
- **Storage**: File-based JSON

## Getting Started

### Installation

```bash
npm install
```

### Development

Run both backend and frontend in development mode:

```bash
# Backend (runs on port 3001)
npm run dev:backend

# Frontend (runs on port 3000)
npm run dev:frontend
```

### Testing

```bash
# Run all tests
npm test

# Backend tests only
npm run test:backend

# Frontend tests only
npm run test:frontend

# E2E tests
npm run test:e2e -w @tdd-todo/frontend
```

## MVP Features

- Add new todos
- Edit existing todos
- Mark todos as complete/incomplete
- Delete todos
- Persist todos to JSON file

## TDD Approach

This project follows a strict test-driven development approach:
1. Write failing tests first
2. Implement minimum code to pass tests
3. Refactor while keeping tests green
4. Repeat
