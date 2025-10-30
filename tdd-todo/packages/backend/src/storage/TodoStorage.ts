import { promises as fs } from 'fs';
import { Todo } from '../models/Todo';

interface TodoJSON {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export class TodoStorage {
  constructor(private filePath: string) {}

  async getAllTodos(): Promise<Todo[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      const todosJSON: TodoJSON[] = JSON.parse(data);
      return todosJSON.map(this.deserializeTodo);
    } catch (error) {
      // File doesn't exist or is empty, return empty array
      return [];
    }
  }

  async getTodoById(id: string): Promise<Todo | null> {
    const todos = await this.getAllTodos();
    const todo = todos.find(t => t.id === id);
    return todo || null;
  }

  async saveTodo(todo: Todo): Promise<void> {
    const todos = await this.getAllTodos();
    const existingIndex = todos.findIndex(t => t.id === todo.id);

    if (existingIndex >= 0) {
      todos[existingIndex] = todo;
    } else {
      todos.push(todo);
    }

    await this.writeTodos(todos);
  }

  async deleteTodo(id: string): Promise<boolean> {
    const todos = await this.getAllTodos();
    const initialLength = todos.length;
    const filteredTodos = todos.filter(t => t.id !== id);

    if (filteredTodos.length === initialLength) {
      return false;
    }

    await this.writeTodos(filteredTodos);
    return true;
  }

  private async writeTodos(todos: Todo[]): Promise<void> {
    const todosJSON = todos.map(this.serializeTodo);
    await fs.writeFile(this.filePath, JSON.stringify(todosJSON, null, 2));
  }

  private serializeTodo(todo: Todo): TodoJSON {
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
    };
  }

  private deserializeTodo(todoJSON: TodoJSON): Todo {
    return {
      id: todoJSON.id,
      title: todoJSON.title,
      description: todoJSON.description,
      completed: todoJSON.completed,
      createdAt: new Date(todoJSON.createdAt),
      updatedAt: new Date(todoJSON.updatedAt),
    };
  }
}
