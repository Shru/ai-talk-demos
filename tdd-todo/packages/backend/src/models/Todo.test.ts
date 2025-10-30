import { Todo, createTodo, updateTodo, toggleTodoCompletion } from './Todo';

describe('Todo Model', () => {
  describe('createTodo', () => {
    it('should create a new todo with required fields', () => {
      const title = 'Buy groceries';
      const description = 'Milk, eggs, bread';

      const todo = createTodo(title, description);

      expect(todo.id).toBeDefined();
      expect(todo.title).toBe(title);
      expect(todo.description).toBe(description);
      expect(todo.completed).toBe(false);
      expect(todo.createdAt).toBeInstanceOf(Date);
      expect(todo.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a todo with unique IDs', () => {
      const todo1 = createTodo('Task 1', 'Description 1');
      const todo2 = createTodo('Task 2', 'Description 2');

      expect(todo1.id).not.toBe(todo2.id);
    });

    it('should create a todo with empty description', () => {
      const todo = createTodo('Task', '');

      expect(todo.description).toBe('');
    });

    it('should throw error if title is empty', () => {
      expect(() => createTodo('', 'Description')).toThrow('Title cannot be empty');
    });
  });

  describe('updateTodo', () => {
    it('should update todo title', async () => {
      const original = createTodo('Old Title', 'Description');
      await new Promise(resolve => setTimeout(resolve, 10));
      const updated = updateTodo(original, { title: 'New Title' });

      expect(updated.title).toBe('New Title');
      expect(updated.description).toBe('Description');
      expect(updated.updatedAt.getTime()).toBeGreaterThan(original.updatedAt.getTime());
    });

    it('should update todo description', () => {
      const original = createTodo('Title', 'Old Description');
      const updated = updateTodo(original, { description: 'New Description' });

      expect(updated.title).toBe('Title');
      expect(updated.description).toBe('New Description');
    });

    it('should update both title and description', () => {
      const original = createTodo('Old Title', 'Old Description');
      const updated = updateTodo(original, {
        title: 'New Title',
        description: 'New Description'
      });

      expect(updated.title).toBe('New Title');
      expect(updated.description).toBe('New Description');
    });

    it('should not change id or createdAt', () => {
      const original = createTodo('Title', 'Description');
      const updated = updateTodo(original, { title: 'New Title' });

      expect(updated.id).toBe(original.id);
      expect(updated.createdAt).toEqual(original.createdAt);
    });

    it('should throw error if updating title to empty string', () => {
      const original = createTodo('Title', 'Description');

      expect(() => updateTodo(original, { title: '' })).toThrow('Title cannot be empty');
    });
  });

  describe('toggleTodoCompletion', () => {
    it('should toggle completed from false to true', async () => {
      const todo = createTodo('Task', 'Description');
      await new Promise(resolve => setTimeout(resolve, 10));
      const toggled = toggleTodoCompletion(todo);

      expect(toggled.completed).toBe(true);
      expect(toggled.updatedAt.getTime()).toBeGreaterThan(todo.updatedAt.getTime());
    });

    it('should toggle completed from true to false', () => {
      const todo = createTodo('Task', 'Description');
      const completedTodo = toggleTodoCompletion(todo);
      const uncompletedTodo = toggleTodoCompletion(completedTodo);

      expect(uncompletedTodo.completed).toBe(false);
    });

    it('should not change other properties', () => {
      const todo = createTodo('Task', 'Description');
      const toggled = toggleTodoCompletion(todo);

      expect(toggled.id).toBe(todo.id);
      expect(toggled.title).toBe(todo.title);
      expect(toggled.description).toBe(todo.description);
      expect(toggled.createdAt).toEqual(todo.createdAt);
    });
  });

  describe('Todo type', () => {
    it('should have correct structure', () => {
      const todo: Todo = {
        id: '123',
        title: 'Task',
        description: 'Description',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(todo).toBeDefined();
    });
  });
});
