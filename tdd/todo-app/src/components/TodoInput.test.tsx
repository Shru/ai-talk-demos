import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoInput from './TodoInput'

describe('TodoInput', () => {
  it('renders an input field', () => {
    render(<TodoInput onAddTodo={vi.fn()} />)
    expect(screen.getByPlaceholderText(/add a new todo/i)).toBeInTheDocument()
  })

  it('calls onAddTodo when form is submitted', async () => {
    const user = userEvent.setup()
    const mockAddTodo = vi.fn()
    render(<TodoInput onAddTodo={mockAddTodo} />)

    const input = screen.getByPlaceholderText(/add a new todo/i)
    await user.type(input, 'New todo item')
    await user.keyboard('{Enter}')

    expect(mockAddTodo).toHaveBeenCalledWith('New todo item')
  })

  it('clears input after submission', async () => {
    const user = userEvent.setup()
    render(<TodoInput onAddTodo={vi.fn()} />)

    const input = screen.getByPlaceholderText(/add a new todo/i) as HTMLInputElement
    await user.type(input, 'New todo item')
    await user.keyboard('{Enter}')

    expect(input.value).toBe('')
  })

  it('does not submit empty todos', async () => {
    const user = userEvent.setup()
    const mockAddTodo = vi.fn()
    render(<TodoInput onAddTodo={mockAddTodo} />)

    const input = screen.getByPlaceholderText(/add a new todo/i)
    await user.click(input)
    await user.keyboard('{Enter}')

    expect(mockAddTodo).not.toHaveBeenCalled()
  })
})
