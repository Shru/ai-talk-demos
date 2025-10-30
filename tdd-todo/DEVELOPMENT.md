# TDD Todo App - Development Guide

## Project Overview

This is a full-stack todo application built using **Test-Driven Development (TDD)** methodology. The project demonstrates a complete TDD workflow from planning to implementation.

### Tech Stack

**Backend:**
- Node.js + Express
- TypeScript
- Jest + Supertest (for testing)
- File-based JSON storage

**Frontend:**
- React 18
- TypeScript
- Vite (build tool)
- Vitest (unit testing)
- Playwright (E2E testing)

**Architecture:**
- Monorepo structure using npm workspaces
- RESTful API design
- Clean separation of concerns (Models, Storage, API, UI)

## Test Coverage Summary

### Backend Tests (42 passing)
- **Unit Tests (25):**
  - Todo Model (13 tests) - `packages/backend/src/models/Todo.test.ts`
  - Storage Layer (12 tests) - `packages/backend/src/storage/TodoStorage.test.ts`

- **API E2E Tests (17):**
  - GET /api/todos (3 tests)
  - GET /api/todos/:id (2 tests)
  - POST /api/todos (4 tests)
  - PUT /api/todos/:id (4 tests)
  - PATCH /api/todos/:id/toggle (2 tests)
  - DELETE /api/todos/:id (2 tests)

  Location: `packages/backend/src/api/todos.test.ts`

### Frontend Tests (8 passing + 10 E2E)
- **Unit Tests (8):**
  - Todo List Display (3 tests)
  - Add Todo (2 tests)
  - Toggle Todo (1 test)
  - Delete Todo (1 test)
  - Edit Todo (1 test)

  Location: `packages/frontend/src/App.test.tsx`

- **E2E Tests (10):**
  - Display app title
  - Empty state
  - Add single/multiple todos
  - Toggle completion
  - Delete todos
  - Edit todos with save/cancel
  - Persistence across reloads
  - Complete user workflow

  Location: `packages/frontend/e2e/todos.spec.ts`

## TDD Development Workflow

This project was built following strict TDD principles:

### Phase 1: Backend Foundation
1. **Red**: Write failing tests for Todo model
2. **Green**: Implement Todo model to pass tests
3. **Refactor**: Clean up code while keeping tests green

### Phase 2: Storage Layer
1. **Red**: Write failing tests for JSON storage
2. **Green**: Implement TodoStorage class
3. **Refactor**: Optimize file I/O operations

### Phase 3: API Layer
1. **Red**: Write API E2E tests for all endpoints
2. **Green**: Implement Express routes and handlers
3. **Refactor**: Extract common patterns, improve error handling

### Phase 4: Frontend
1. **Red**: Write component unit tests
2. **Green**: Implement React components
3. **Refactor**: Extract reusable logic, improve UX

### Phase 5: E2E Integration
1. **Red**: Write end-to-end user flow tests
2. **Green**: Ensure all integration points work
3. **Refactor**: Polish UI and fix edge cases

## Running the Application

### Installation
```bash
npm install
```

### Development Mode
Run backend and frontend in separate terminals:

```bash
# Terminal 1 - Backend (http://localhost:3001)
npm run dev:backend

# Terminal 2 - Frontend (http://localhost:3000)
npm run dev:frontend
```

### Testing

```bash
# Run all tests (backend + frontend unit tests)
npm test

# Run backend tests only
npm run test:backend

# Run frontend unit tests only
npm run test:frontend

# Run E2E tests (requires both servers running)
cd packages/frontend
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### Production Build

```bash
# Build both packages
npm run build

# Start production backend
npm run start:backend
```

## API Endpoints

### GET /api/todos
Get all todos.

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "title": "Buy groceries",
    "description": "Milk and eggs",
    "completed": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET /api/todos/:id
Get a single todo by ID.

**Response:** `200 OK` or `404 Not Found`

### POST /api/todos
Create a new todo.

**Request Body:**
```json
{
  "title": "Buy groceries",
  "description": "Milk and eggs"
}
```

**Response:** `201 Created`

### PUT /api/todos/:id
Update a todo's title and/or description.

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description"
}
```

**Response:** `200 OK` or `404 Not Found`

### PATCH /api/todos/:id/toggle
Toggle a todo's completion status.

**Response:** `200 OK` or `404 Not Found`

### DELETE /api/todos/:id
Delete a todo.

**Response:** `204 No Content` or `404 Not Found`

## Project Structure

```
tdd-todo/
├── packages/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── models/
│   │   │   │   ├── Todo.ts            # Todo model with business logic
│   │   │   │   └── Todo.test.ts       # Model unit tests
│   │   │   ├── storage/
│   │   │   │   ├── TodoStorage.ts     # JSON file persistence
│   │   │   │   └── TodoStorage.test.ts # Storage unit tests
│   │   │   ├── api/
│   │   │   │   ├── todos.ts           # Express routes
│   │   │   │   └── todos.test.ts      # API E2E tests
│   │   │   ├── app.ts                 # Express app setup
│   │   │   └── index.ts               # Server entry point
│   │   ├── data/                      # JSON storage directory
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── jest.config.js
│   │
│   └── frontend/
│       ├── src/
│       │   ├── api/
│       │   │   └── todos.ts           # API client
│       │   ├── types/
│       │   │   └── todo.ts            # TypeScript interfaces
│       │   ├── App.tsx                # Main component
│       │   ├── App.test.tsx           # Component unit tests
│       │   ├── App.css                # Styles
│       │   └── main.tsx               # React entry point
│       ├── e2e/
│       │   └── todos.spec.ts          # Playwright E2E tests
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       └── playwright.config.ts
│
├── package.json                       # Workspace root
├── README.md
└── DEVELOPMENT.md                     # This file
```

## MVP Features Implemented

- ✅ Add new todos with title and description
- ✅ View all todos in a list
- ✅ Mark todos as complete/incomplete
- ✅ Edit existing todos
- ✅ Delete todos
- ✅ Persist todos to JSON file
- ✅ Load todos on app startup
- ✅ Responsive UI with visual feedback

## TDD Best Practices Demonstrated

1. **Write tests first** - All features have tests written before implementation
2. **Small increments** - Each feature built in small, testable units
3. **Red-Green-Refactor** - Follow the TDD cycle religiously
4. **Test coverage** - Comprehensive coverage across all layers
5. **Clean architecture** - Separation of concerns makes testing easier
6. **Mock dependencies** - Frontend tests mock API calls
7. **E2E validation** - Full user workflows tested end-to-end

## Next Steps / Future Enhancements

- Add todo filtering (all, active, completed)
- Add todo sorting by date or priority
- Implement user authentication
- Add due dates and reminders
- Support for categories/tags
- Bulk operations (delete all completed, etc.)
- Search functionality
- Dark mode
- Mobile responsive improvements
- Database migration (SQLite/PostgreSQL)

## Troubleshooting

### Tests failing?
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Run tests individually
npm run test:backend
npm run test:frontend
```

### E2E tests not running?
Make sure both servers are running before running E2E tests. The Playwright config automatically starts them, but if you're running manually:

```bash
# Terminal 1
npm run dev:backend

# Terminal 2
npm run dev:frontend

# Terminal 3
cd packages/frontend
npm run test:e2e
```

### Port already in use?
Change ports in:
- Backend: `packages/backend/src/index.ts` (default: 3001)
- Frontend: `packages/frontend/vite.config.ts` (default: 3000)

## Contributing

This project follows TDD methodology. When adding new features:

1. Write failing tests first
2. Implement minimum code to pass
3. Refactor while keeping tests green
4. Update documentation
5. Ensure all tests pass before committing

## License

MIT
