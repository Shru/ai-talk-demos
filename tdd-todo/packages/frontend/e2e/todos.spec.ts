import { test, expect } from '@playwright/test';

test.describe('Todo App E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the app title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Todo App' })).toBeVisible();
  });

  test('should display empty state when no todos', async ({ page }) => {
    await expect(page.getByText(/no todos yet/i)).toBeVisible();
  });

  test('should add a new todo', async ({ page }) => {
    // Fill in the form
    await page.getByPlaceholder(/title/i).fill('Buy groceries');
    await page.getByPlaceholder(/description/i).fill('Milk, eggs, and bread');

    // Submit
    await page.getByRole('button', { name: /add todo/i }).click();

    // Verify todo appears
    await expect(page.getByText('Buy groceries')).toBeVisible();
    await expect(page.getByText('Milk, eggs, and bread')).toBeVisible();

    // Verify form is cleared
    await expect(page.getByPlaceholder(/title/i)).toHaveValue('');
    await expect(page.getByPlaceholder(/description/i)).toHaveValue('');
  });

  test('should add multiple todos', async ({ page }) => {
    // Add first todo
    await page.getByPlaceholder(/title/i).fill('Task 1');
    await page.getByPlaceholder(/description/i).fill('Description 1');
    await page.getByRole('button', { name: /add todo/i }).click();

    // Add second todo
    await page.getByPlaceholder(/title/i).fill('Task 2');
    await page.getByPlaceholder(/description/i).fill('Description 2');
    await page.getByRole('button', { name: /add todo/i }).click();

    // Verify both todos appear
    await expect(page.getByText('Task 1')).toBeVisible();
    await expect(page.getByText('Task 2')).toBeVisible();
  });

  test('should toggle todo completion', async ({ page }) => {
    // Add a todo
    await page.getByPlaceholder(/title/i).fill('Complete me');
    await page.getByPlaceholder(/description/i).fill('Test description');
    await page.getByRole('button', { name: /add todo/i }).click();

    // Find the checkbox
    const checkbox = page.getByRole('checkbox');

    // Initially unchecked
    await expect(checkbox).not.toBeChecked();

    // Click to complete
    await checkbox.click();
    await expect(checkbox).toBeChecked();

    // Click to uncomplete
    await checkbox.click();
    await expect(checkbox).not.toBeChecked();
  });

  test('should delete a todo', async ({ page }) => {
    // Add a todo
    await page.getByPlaceholder(/title/i).fill('Delete me');
    await page.getByPlaceholder(/description/i).fill('Will be deleted');
    await page.getByRole('button', { name: /add todo/i }).click();

    // Verify it exists
    await expect(page.getByText('Delete me')).toBeVisible();

    // Delete it
    await page.getByRole('button', { name: /delete/i }).click();

    // Verify it's gone
    await expect(page.getByText('Delete me')).not.toBeVisible();
    await expect(page.getByText(/no todos yet/i)).toBeVisible();
  });

  test('should edit a todo', async ({ page }) => {
    // Add a todo
    await page.getByPlaceholder(/title/i).fill('Original Title');
    await page.getByPlaceholder(/description/i).fill('Original Description');
    await page.getByRole('button', { name: /add todo/i }).click();

    // Click edit
    await page.getByRole('button', { name: /edit/i }).click();

    // Edit form should appear with current values
    const editTitleInput = page.locator('input[value="Original Title"]');
    const editDescInput = page.locator('input[value="Original Description"]');

    await expect(editTitleInput).toBeVisible();
    await expect(editDescInput).toBeVisible();

    // Change values
    await editTitleInput.clear();
    await editTitleInput.fill('Updated Title');
    await editDescInput.clear();
    await editDescInput.fill('Updated Description');

    // Save changes
    await page.getByRole('button', { name: /save/i }).click();

    // Verify changes
    await expect(page.getByText('Updated Title')).toBeVisible();
    await expect(page.getByText('Updated Description')).toBeVisible();
    await expect(page.getByText('Original Title')).not.toBeVisible();
  });

  test('should cancel editing a todo', async ({ page }) => {
    // Add a todo
    await page.getByPlaceholder(/title/i).fill('Original');
    await page.getByPlaceholder(/description/i).fill('Description');
    await page.getByRole('button', { name: /add todo/i }).click();

    // Click edit
    await page.getByRole('button', { name: /edit/i }).click();

    // Make changes
    const editTitleInput = page.locator('input[value="Original"]');
    await editTitleInput.clear();
    await editTitleInput.fill('Changed');

    // Cancel
    await page.getByRole('button', { name: /cancel/i }).click();

    // Verify original values remain
    await expect(page.getByText('Original')).toBeVisible();
    await expect(page.getByText('Changed')).not.toBeVisible();
  });

  test('should persist todos across page reloads', async ({ page }) => {
    // Add a todo
    await page.getByPlaceholder(/title/i).fill('Persistent Todo');
    await page.getByPlaceholder(/description/i).fill('Should survive reload');
    await page.getByRole('button', { name: /add todo/i }).click();

    // Verify it's there
    await expect(page.getByText('Persistent Todo')).toBeVisible();

    // Reload the page
    await page.reload();

    // Todo should still be there
    await expect(page.getByText('Persistent Todo')).toBeVisible();
    await expect(page.getByText('Should survive reload')).toBeVisible();
  });

  test('complete user workflow', async ({ page }) => {
    // 1. Add first todo
    await page.getByPlaceholder(/title/i).fill('Buy milk');
    await page.getByPlaceholder(/description/i).fill('2 gallons');
    await page.getByRole('button', { name: /add todo/i }).click();

    // 2. Add second todo
    await page.getByPlaceholder(/title/i).fill('Walk dog');
    await page.getByPlaceholder(/description/i).fill('30 minutes');
    await page.getByRole('button', { name: /add todo/i }).click();

    // 3. Complete first todo
    const firstCheckbox = page.getByRole('checkbox').first();
    await firstCheckbox.click();
    await expect(firstCheckbox).toBeChecked();

    // 4. Edit second todo
    const editButtons = page.getByRole('button', { name: /edit/i });
    await editButtons.last().click();

    const titleInput = page.locator('input').filter({ hasText: 'Walk dog' });
    await titleInput.clear();
    await titleInput.fill('Walk dog in park');

    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByText('Walk dog in park')).toBeVisible();

    // 5. Delete completed todo
    const deleteButtons = page.getByRole('button', { name: /delete/i });
    await deleteButtons.first().click();

    await expect(page.getByText('Buy milk')).not.toBeVisible();
    await expect(page.getByText('Walk dog in park')).toBeVisible();
  });
});
