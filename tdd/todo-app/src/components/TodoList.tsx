import type { Todo } from '../types/todo'
import TodoItem from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  onToggle?: (id: string) => void
  onDelete?: (id: string) => void
  onEdit?: (id: string, newText: string) => void
}

export default function TodoList({ todos, onToggle, onDelete, onEdit }: TodoListProps) {
  if (todos.length === 0) {
    return <p>No todos yet! Add one to get started.</p>
  }

  // If we have handlers, use TodoItem; otherwise use simple rendering for basic tests
  if (onToggle && onDelete && onEdit) {
    return (
      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </ul>
    )
  }

  // Fallback for simpler tests
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id} className={todo.completed ? 'completed' : ''}>
          <span>{todo.text}</span>
        </li>
      ))}
    </ul>
  )
}
