import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TodoList from './TodoList'

describe('TodoList', () => {
  it('renders empty state when no todos are provided', () => {
    render(<TodoList todos={[]} />)
    expect(screen.getByText(/no todos/i)).toBeInTheDocument()
  })

  it('renders a list of todos', () => {
    const todos = [
      { id: '1', text: 'Buy groceries', completed: false },
      { id: '2', text: 'Walk the dog', completed: false },
    ]
    render(<TodoList todos={todos} />)

    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
    expect(screen.getByText('Walk the dog')).toBeInTheDocument()
  })

  it('displays completed status for completed todos', () => {
    const todos = [
      { id: '1', text: 'Completed task', completed: true },
    ]
    render(<TodoList todos={todos} />)

    const todoElement = screen.getByText('Completed task')
    expect(todoElement).toBeInTheDocument()
    // We'll check for visual indication of completion
    expect(todoElement.closest('li')).toHaveClass('completed')
  })
})
