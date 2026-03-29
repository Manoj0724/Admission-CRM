import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {

  test('Admin can login successfully', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'admin@test.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-btn"]')
    await page.waitForURL('/masters', { timeout: 10000 })
    await expect(page).toHaveURL('/masters')
  })

  test('Officer redirected to applicants page', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'officer@test.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-btn"]')
    await page.waitForURL('/applicants', { timeout: 10000 })
    await expect(page).toHaveURL('/applicants')
  })

  test('Management redirected to dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'mgmt@test.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-btn"]')
    await page.waitForURL('/dashboard', { timeout: 10000 })
    await expect(page).toHaveURL('/dashboard')
  })

  test('Invalid credentials shows toast error', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'wrong@test.com')
    await page.fill('[data-testid="password"]', 'wrongpass')
    await page.click('[data-testid="login-btn"]')
    // react-hot-toast renders in a div with role="status"
    await expect(
      page.locator('div[role="status"]').first()
    ).toBeVisible({ timeout: 8000 })
  })

})