import { useState } from 'react'
import type { FormEvent } from 'react'

interface TodoInputProps {
  onAddTodo: (text: string) => void
}

export default function TodoInput({ onAddTodo }: TodoInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (inputValue.trim() === '') {
      return
    }

    onAddTodo(inputValue)
    setInputValue('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a new todo..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </form>
  )
}
