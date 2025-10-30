import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoItem from './TodoItem'

describe('TodoItem', () => {
  const mockTodo = { id: '1', text: 'Test todo', completed: false }

  it('renders todo text', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    )
    expect(screen.getByText('Test todo')).toBeInTheDocument()
  })

  it('calls onToggle when checkbox is clicked', async () => {
    const user = userEvent.setup()
    const mockToggle = vi.fn()
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockToggle}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    )

    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)

    expect(mockToggle).toHaveBeenCalledWith('1')
  })

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup()
    const mockDelete = vi.fn()
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={vi.fn()}
        onDelete={mockDelete}
        onEdit={vi.fn()}
      />
    )

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    await user.click(deleteButton)

    expect(mockDelete).toHaveBeenCalledWith('1')
  })

  it('shows edit input when edit button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    )

    const editButton = screen.getByRole('button', { name: /edit/i })
    await user.click(editButton)

    expect(screen.getByDisplayValue('Test todo')).toBeInTheDocument()
  })

  it('calls onEdit when edit is submitted', async () => {
    const user = userEvent.setup()
    const mockEdit = vi.fn()
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={mockEdit}
      />
    )

    // Click edit button
    const editButton = screen.getByRole('button', { name: /edit/i })
    await user.click(editButton)

    // Edit the text
    const input = screen.getByDisplayValue('Test todo')
    await user.clear(input)
    await user.type(input, 'Updated todo')
    await user.keyboard('{Enter}')

    expect(mockEdit).toHaveBeenCalledWith('1', 'Updated todo')
  })

  it('shows completed style when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: true }
    render(
      <TodoItem
        todo={completedTodo}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    )

    const listItem = screen.getByText('Test todo').closest('li')
    expect(listItem).toHaveClass('completed')
  })
})
