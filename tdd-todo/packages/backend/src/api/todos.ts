import { Router, Request, Response } from 'express';
import { TodoStorage } from '../storage/TodoStorage';
import { createTodo, updateTodo, toggleTodoCompletion } from '../models/Todo';

export const todosRouter = Router();

function getStorage(req: Request): TodoStorage {
  const filePath = req.app.locals.dataFilePath;
  return new TodoStorage(filePath);
}

// GET /api/todos - Get all todos
todosRouter.get('/', async (req: Request, res: Response) => {
  try {
    const storage = getStorage(req);
    const todos = await storage.getAllTodos();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// GET /api/todos/:id - Get single todo
todosRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const storage = getStorage(req);
    const todo = await storage.getTodoById(req.params.id);

    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
});

// POST /api/todos - Create new todo
todosRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim() === '') {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const todo = createTodo(title, description || '');
    const storage = getStorage(req);
    await storage.saveTodo(todo);

    res.status(201).json(todo);
  } catch (error) {
    if (error instanceof Error && error.message === 'Title cannot be empty') {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// PUT /api/todos/:id - Update todo
todosRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const storage = getStorage(req);
    const existingTodo = await storage.getTodoById(req.params.id);

    if (!existingTodo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    const { title, description } = req.body;

    if (title !== undefined && (!title || title.trim() === '')) {
      res.status(400).json({ error: 'Title cannot be empty' });
      return;
    }

    const updatedTodo = updateTodo(existingTodo, { title, description });
    await storage.saveTodo(updatedTodo);

    res.json(updatedTodo);
  } catch (error) {
    if (error instanceof Error && error.message === 'Title cannot be empty') {
      res.status(400).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// PATCH /api/todos/:id/toggle - Toggle completion
todosRouter.patch('/:id/toggle', async (req: Request, res: Response) => {
  try {
    const storage = getStorage(req);
    const existingTodo = await storage.getTodoById(req.params.id);

    if (!existingTodo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    const toggledTodo = toggleTodoCompletion(existingTodo);
    await storage.saveTodo(toggledTodo);

    res.json(toggledTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle todo' });
  }
});

// DELETE /api/todos/:id - Delete todo
todosRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const storage = getStorage(req);
    const deleted = await storage.deleteTodo(req.params.id);

    if (!deleted) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});
