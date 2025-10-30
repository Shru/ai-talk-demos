import { randomUUID } from 'crypto';

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function createTodo(title: string, description: string): Todo {
  if (!title || title.trim() === '') {
    throw new Error('Title cannot be empty');
  }

  const now = new Date();

  return {
    id: randomUUID(),
    title,
    description,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
}

export interface TodoUpdate {
  title?: string;
  description?: string;
}

export function updateTodo(todo: Todo, updates: TodoUpdate): Todo {
  if (updates.title !== undefined && (!updates.title || updates.title.trim() === '')) {
    throw new Error('Title cannot be empty');
  }

  return {
    ...todo,
    title: updates.title !== undefined ? updates.title : todo.title,
    description: updates.description !== undefined ? updates.description : todo.description,
    updatedAt: new Date(),
  };
}

export function toggleTodoCompletion(todo: Todo): Todo {
  return {
    ...todo,
    completed: !todo.completed,
    updatedAt: new Date(),
  };
}
