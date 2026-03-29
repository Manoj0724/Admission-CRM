import { test, expect } from '@playwright/test'

test.describe('Masters Setup', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'admin@test.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-btn"]')
    await page.waitForURL('/masters', { timeout: 10000 })
  })

  test('Admin can see masters page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Master Setup')
  })

  test('Admin can see institution tab', async ({ page }) => {
    await page.click('button:has-text("institution")')
    // Use heading role to avoid strict mode violation
    await expect(
      page.getByRole('heading', { name: 'Create Institution' })
    ).toBeVisible()
  })

  test('Admin can see quota tab', async ({ page }) => {
    await page.click('button:has-text("quota")')
    await expect(
      page.getByRole('heading', { name: 'Configure Quotas' })
    ).toBeVisible()
  })

  test('Admin can see program tab', async ({ page }) => {
    await page.click('button:has-text("program")')
    await expect(
      page.getByRole('heading', { name: 'Create Program' })
    ).toBeVisible()
  })

  test('Management cannot access masters page', async ({ page }) => {
    // Login as management in same test
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'mgmt@test.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-btn"]')
    await page.waitForURL('/dashboard', { timeout: 10000 })
    // Now try to access masters
    await page.goto('/masters')
    await page.waitForURL('/unauthorized', { timeout: 10000 })
    await expect(page).toHaveURL('/unauthorized')
  })

})