import { test, expect } from '@playwright/test'

test.describe('Masters Setup', () => {

  test.beforeEach(async ({ page }) => {
    // Login as Admin
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'admin@test.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-btn"]')
    await expect(page).toHaveURL('/masters')
  })

  test('Admin can see masters page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Master Setup')
  })

  test('Admin can see institution tab', async ({ page }) => {
    await page.click('button:has-text("institution")')
    await expect(page.locator('text=Create Institution')).toBeVisible()
  })

  test('Admin can see quota tab', async ({ page }) => {
    await page.click('button:has-text("quota")')
    await expect(page.locator('text=Configure Quotas')).toBeVisible()
  })

  test('Management cannot access masters', async ({ page }) => {
    // Login as management
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'mgmt@test.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-btn"]')
    // Try to access masters
    await page.goto('/masters')
    await expect(page).toHaveURL('/unauthorized')
  })

})