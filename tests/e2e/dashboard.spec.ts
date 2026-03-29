import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {

  test('Management can view dashboard stats', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'mgmt@test.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-btn"]')
    await expect(page).toHaveURL('/dashboard')
    await expect(
      page.locator('[data-testid="dashboard-stats"]')
    ).toBeVisible()
  })

  test('Management cannot access applicant creation', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'mgmt@test.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-btn"]')
    await page.goto('/applicants/new')
    await expect(page).toHaveURL('/unauthorized')
  })

  test('Admin can see dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'admin@test.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-btn"]')
    await page.goto('/dashboard')
    await expect(
      page.locator('[data-testid="dashboard-stats"]')
    ).toBeVisible()
  })

  test('Dashboard shows quota stats table', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'admin@test.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-btn"]')
    await page.goto('/dashboard')
    await expect(
      page.locator('text=Quota Distribution')
    ).toBeVisible()
  })

})