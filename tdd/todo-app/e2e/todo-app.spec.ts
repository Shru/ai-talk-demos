import { test, expect } from '@playwright/test'

test.describe('Todo App E2E', () => {
  test('should display the todo app', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText(/todo/i)
  })

  test('should add a new todo', async ({ page }) => {
    await page.goto('/')

    const input = page.getByPlaceholder(/add a new todo/i)
    await input.fill('Buy groceries')
    await input.press('Enter')

    await expect(page.getByText('Buy groceries')).toBeVisible()
  })

  test('should toggle todo completion', async ({ page }) => {
    await page.goto('/')

    // Add a todo
    const input = page.getByPlaceholder(/add a new todo/i)
    await input.fill('Complete this task')
    await input.press('Enter')

    // Find and click the checkbox
    const todoItem = page.getByText('Complete this task')
    const checkbox = todoItem.locator('xpath=ancestor::li').locator('input[type="checkbox"]')
    await checkbox.click()

    // Verify it's marked as completed
    const todoLi = todoItem.locator('xpath=ancestor::li')
    await expect(todoLi).toHaveClass(/completed/)
  })

  test('should delete a todo', async ({ page }) => {
    await page.goto('/')

    // Add a todo
    const input = page.getByPlaceholder(/add a new todo/i)
    await input.fill('Delete me')
    await input.press('Enter')

    // Delete the todo
    const todoItem = page.getByText('Delete me')
    const deleteButton = todoItem.locator('xpath=ancestor::li').getByRole('button', { name: /delete/i })
    await deleteButton.click()

    // Verify it's gone
    await expect(todoItem).not.toBeVisible()
  })

  test('should edit a todo', async ({ page }) => {
    await page.goto('/')

    // Add a todo
    const input = page.getByPlaceholder(/add a new todo/i)
    await input.fill('Original text')
    await input.press('Enter')

    // Click edit button
    const listItem = page.locator('li').filter({ hasText: 'Original text' })
    const editButton = listItem.getByRole('button', { name: /edit/i })
    await editButton.click()

    // Wait for edit input to appear and edit the text
    const editInput = page.locator('li form input[type="text"]')
    await editInput.waitFor({ state: 'visible' })
    await editInput.clear()
    await editInput.fill('Updated text')
    await editInput.press('Enter')

    // Verify the text is updated
    await expect(page.getByText('Updated text')).toBeVisible()
    await expect(page.getByText('Original text')).not.toBeVisible()
  })
})
