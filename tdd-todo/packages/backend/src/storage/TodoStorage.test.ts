import { promises as fs } from 'fs';
import path from 'path';
import { TodoStorage } from './TodoStorage';
import { createTodo } from '../models/Todo';

const TEST_DATA_PATH = path.join(__dirname, '../../test-data');
const TEST_FILE = path.join(TEST_DATA_PATH, 'todos-test.json');

describe('TodoStorage', () => {
  let storage: TodoStorage;

  beforeEach(async () => {
    // Create test data directory
    await fs.mkdir(TEST_DATA_PATH, { recursive: true });
    storage = new TodoStorage(TEST_FILE);
  });

  afterEach(async () => {
    // Clean up test file
    try {
      await fs.unlink(TEST_FILE);
    } catch (error) {
      // File might not exist, that's okay
    }
  });

  afterAll(async () => {
    // Clean up test directory
    try {
      await fs.rmdir(TEST_DATA_PATH);
    } catch (error) {
      // Directory might not be empty or not exist, that's okay
    }
  });

  describe('getAllTodos', () => {
    it('should return empty array when file does not exist', async () => {
      const todos = await storage.getAllTodos();
      expect(todos).toEqual([]);
    });

    it('should return empty array when file is empty', async () => {
      await fs.writeFile(TEST_FILE, '[]');
      const todos = await storage.getAllTodos();
      expect(todos).toEqual([]);
    });

    it('should return todos from file', async () => {
      const todo = createTodo('Test Todo', 'Description');
      await fs.writeFile(TEST_FILE, JSON.stringify([todo]));

      const todos = await storage.getAllTodos();

      expect(todos).toHaveLength(1);
      expect(todos[0].id).toBe(todo.id);
      expect(todos[0].title).toBe(todo.title);
      expect(todos[0].description).toBe(todo.description);
      expect(todos[0].completed).toBe(todo.completed);
    });

    it('should deserialize dates correctly', async () => {
      const todo = createTodo('Test', 'Desc');
      await fs.writeFile(TEST_FILE, JSON.stringify([todo]));

      const todos = await storage.getAllTodos();

      expect(todos[0].createdAt).toBeInstanceOf(Date);
      expect(todos[0].updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('getTodoById', () => {
    it('should return null when todo not found', async () => {
      const todo = await storage.getTodoById('nonexistent-id');
      expect(todo).toBeNull();
    });

    it('should return todo when found', async () => {
      const todo = createTodo('Test Todo', 'Description');
      await fs.writeFile(TEST_FILE, JSON.stringify([todo]));

      const foundTodo = await storage.getTodoById(todo.id);

      expect(foundTodo).not.toBeNull();
      expect(foundTodo?.id).toBe(todo.id);
      expect(foundTodo?.title).toBe(todo.title);
    });
  });

  describe('saveTodo', () => {
    it('should create new todo when file is empty', async () => {
      const todo = createTodo('New Todo', 'Description');

      await storage.saveTodo(todo);

      const todos = await storage.getAllTodos();
      expect(todos).toHaveLength(1);
      expect(todos[0].id).toBe(todo.id);
    });

    it('should add todo to existing todos', async () => {
      const todo1 = createTodo('First', 'Desc1');
      await storage.saveTodo(todo1);

      const todo2 = createTodo('Second', 'Desc2');
      await storage.saveTodo(todo2);

      const todos = await storage.getAllTodos();
      expect(todos).toHaveLength(2);
    });

    it('should update existing todo', async () => {
      const todo = createTodo('Original', 'Original Desc');
      await storage.saveTodo(todo);

      const updatedTodo = { ...todo, title: 'Updated', description: 'Updated Desc' };
      await storage.saveTodo(updatedTodo);

      const todos = await storage.getAllTodos();
      expect(todos).toHaveLength(1);
      expect(todos[0].title).toBe('Updated');
      expect(todos[0].description).toBe('Updated Desc');
    });
  });

  describe('deleteTodo', () => {
    it('should return false when todo not found', async () => {
      const result = await storage.deleteTodo('nonexistent-id');
      expect(result).toBe(false);
    });

    it('should delete todo and return true', async () => {
      const todo = createTodo('To Delete', 'Description');
      await storage.saveTodo(todo);

      const result = await storage.deleteTodo(todo.id);

      expect(result).toBe(true);
      const todos = await storage.getAllTodos();
      expect(todos).toHaveLength(0);
    });

    it('should only delete specified todo', async () => {
      const todo1 = createTodo('Keep This', 'Desc1');
      const todo2 = createTodo('Delete This', 'Desc2');
      await storage.saveTodo(todo1);
      await storage.saveTodo(todo2);

      await storage.deleteTodo(todo2.id);

      const todos = await storage.getAllTodos();
      expect(todos).toHaveLength(1);
      expect(todos[0].id).toBe(todo1.id);
    });
  });
});
