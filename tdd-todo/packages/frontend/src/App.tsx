import { useState, useEffect } from 'react';
import { Todo, CreateTodoDto, UpdateTodoDto } from './types/todo';
import * as todosApi from './api/todos';
import './App.css';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    try {
      const data = await todosApi.fetchTodos();
      setTodos(data);
    } catch (error) {
      console.error('Failed to load todos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTodo(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      const dto: CreateTodoDto = { title, description };
      const newTodo = await todosApi.createTodo(dto);
      setTodos([...todos, newTodo]);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  }

  async function handleToggleTodo(id: string) {
    try {
      const updatedTodo = await todosApi.toggleTodo(id);
      setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  }

  async function handleDeleteTodo(id: string) {
    try {
      await todosApi.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  }

  function startEditing(todo: Todo) {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  }

  async function handleSaveEdit(id: string) {
    try {
      const dto: UpdateTodoDto = {
        title: editTitle,
        description: editDescription,
      };
      const updatedTodo = await todosApi.updateTodo(id, dto);
      setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
      setEditingId(null);
      setEditTitle('');
      setEditDescription('');
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  }

  if (loading) {
    return <div className="app">Loading...</div>;
  }

  return (
    <div className="app">
      <h1>Todo App</h1>

      <form onSubmit={handleAddTodo} className="add-todo-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button type="submit">Add Todo</button>
      </form>

      {todos.length === 0 ? (
        <p className="empty-state">No todos yet. Add one above!</p>
      ) : (
        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              {editingId === todo.id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                  />
                  <input
                    type="text"
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                  />
                  <button onClick={() => handleSaveEdit(todo.id)}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </div>
              ) : (
                <>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id)}
                  />
                  <div className="todo-content">
                    <h3>{todo.title}</h3>
                    {todo.description && <p>{todo.description}</p>}
                  </div>
                  <div className="todo-actions">
                    <button onClick={() => startEditing(todo)}>Edit</button>
                    <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
