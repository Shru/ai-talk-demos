import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import * as todosApi from './api/todos';

vi.mock('./api/todos');

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Todo List Display', () => {
    it('should display empty state when no todos', async () => {
      vi.mocked(todosApi.fetchTodos).mockResolvedValue([]);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
      });
    });

    it('should display list of todos', async () => {
      const mockTodos = [
        {
          id: '1',
          title: 'Buy groceries',
          description: 'Milk and eggs',
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Walk the dog',
          description: '',
          completed: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      vi.mocked(todosApi.fetchTodos).mockResolvedValue(mockTodos);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Buy groceries')).toBeInTheDocument();
        expect(screen.getByText('Walk the dog')).toBeInTheDocument();
      });
    });

    it('should display loading state', () => {
      vi.mocked(todosApi.fetchTodos).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<App />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe('Add Todo', () => {
    it('should add a new todo', async () => {
      const user = userEvent.setup();
      vi.mocked(todosApi.fetchTodos).mockResolvedValue([]);

      const newTodo = {
        id: '1',
        title: 'New Task',
        description: 'Task description',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vi.mocked(todosApi.createTodo).mockResolvedValue(newTodo);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument();
      });

      const titleInput = screen.getByPlaceholderText(/title/i);
      const descInput = screen.getByPlaceholderText(/description/i);
      const addButton = screen.getByRole('button', { name: /add/i });

      await user.type(titleInput, 'New Task');
      await user.type(descInput, 'Task description');
      await user.click(addButton);

      await waitFor(() => {
        expect(todosApi.createTodo).toHaveBeenCalledWith({
          title: 'New Task',
          description: 'Task description',
        });
      });
    });

    it('should clear form after adding todo', async () => {
      const user = userEvent.setup();
      vi.mocked(todosApi.fetchTodos).mockResolvedValue([]);

      vi.mocked(todosApi.createTodo).mockResolvedValue({
        id: '1',
        title: 'Test',
        description: 'Desc',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument();
      });

      const titleInput = screen.getByPlaceholderText(/title/i) as HTMLInputElement;
      const descInput = screen.getByPlaceholderText(/description/i) as HTMLInputElement;
      const addButton = screen.getByRole('button', { name: /add/i });

      await user.type(titleInput, 'Test');
      await user.type(descInput, 'Desc');
      await user.click(addButton);

      await waitFor(() => {
        expect(titleInput.value).toBe('');
        expect(descInput.value).toBe('');
      });
    });
  });

  describe('Toggle Todo', () => {
    it('should toggle todo completion', async () => {
      const user = userEvent.setup();
      const mockTodo = {
        id: '1',
        title: 'Test Todo',
        description: 'Description',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vi.mocked(todosApi.fetchTodos).mockResolvedValue([mockTodo]);
      vi.mocked(todosApi.toggleTodo).mockResolvedValue({
        ...mockTodo,
        completed: true,
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Test Todo')).toBeInTheDocument();
      });

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      await waitFor(() => {
        expect(todosApi.toggleTodo).toHaveBeenCalledWith('1');
      });
    });
  });

  describe('Delete Todo', () => {
    it('should delete todo', async () => {
      const user = userEvent.setup();
      const mockTodo = {
        id: '1',
        title: 'To Delete',
        description: 'Description',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vi.mocked(todosApi.fetchTodos).mockResolvedValue([mockTodo]);
      vi.mocked(todosApi.deleteTodo).mockResolvedValue(undefined);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('To Delete')).toBeInTheDocument();
      });

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);

      await waitFor(() => {
        expect(todosApi.deleteTodo).toHaveBeenCalledWith('1');
      });
    });
  });

  describe('Edit Todo', () => {
    it('should edit todo', async () => {
      const user = userEvent.setup();
      const mockTodo = {
        id: '1',
        title: 'Original Title',
        description: 'Original Description',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vi.mocked(todosApi.fetchTodos).mockResolvedValue([mockTodo]);
      vi.mocked(todosApi.updateTodo).mockResolvedValue({
        ...mockTodo,
        title: 'Updated Title',
        description: 'Updated Description',
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Original Title')).toBeInTheDocument();
      });

      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      const titleInput = screen.getByDisplayValue('Original Title') as HTMLInputElement;
      const descInput = screen.getByDisplayValue('Original Description') as HTMLInputElement;

      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Title');
      await user.clear(descInput);
      await user.type(descInput, 'Updated Description');

      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(todosApi.updateTodo).toHaveBeenCalledWith('1', {
          title: 'Updated Title',
          description: 'Updated Description',
        });
      });
    });
  });
});
