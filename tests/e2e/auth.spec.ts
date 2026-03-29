import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {

  test('Admin can login successfully', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'admin@test.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-btn"]')
    await expect(page).toHaveURL('/masters')
  })

  test('Officer redirected to applicants page', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'officer@test.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-btn"]')
    await expect(page).toHaveURL('/applicants')
  })

  test('Management redirected to dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'mgmt@test.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-btn"]')
    await expect(page).toHaveURL('/dashboard')
  })

  test('Invalid credentials shows error', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'wrong@test.com')
    await page.fill('[data-testid="password"]', 'wrongpass')
    await page.click('[data-testid="login-btn"]')
    await expect(page.locator('[data-testid="error-msg"]')).toBeVisible()
  })

})