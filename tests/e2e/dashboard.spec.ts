import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {

  test('Management can view dashboard stats', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'mgmt@test.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-btn"]')
    await page.waitForURL('/dashboard', { timeout: 10000 })
    await expect(page).toHaveURL('/dashboard')
    await expect(
      page.locator('[data-testid="dashboard-stats"]')
    ).toBeVisible({ timeout: 10000 })
  })

  test('Management cannot access applicant creation', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'mgmt@test.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-btn"]')
    await page.waitForURL('/dashboard', { timeout: 10000 })
    await page.goto('/applicants/new')
    await page.waitForURL('/unauthorized', { timeout: 10000 })
    await expect(page).toHaveURL('/unauthorized')
  })

  test('Admin can see dashboard', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'admin@test.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-btn"]')
    await page.waitForURL('/masters', { timeout: 10000 })
    await page.goto('/dashboard')
    await expect(
      page.locator('[data-testid="dashboard-stats"]')
    ).toBeVisible({ timeout: 10000 })
  })

  test('Dashboard shows quota wise seat status', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'admin@test.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-btn"]')
    await page.waitForURL('/masters', { timeout: 10000 })
    await page.goto('/dashboard')
    await page.waitForTimeout(2000)
    await expect(
      page.locator('h2:has-text("Quota-wise Seat Status")')
    ).toBeVisible({ timeout: 10000 })
  })

  test('Dashboard shows pending documents section', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'admin@test.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-btn"]')
    await page.waitForURL('/masters', { timeout: 10000 })
    await page.goto('/dashboard')
    await page.waitForTimeout(2000)
    await expect(
      page.locator('h3:has-text("Pending Documents")')
    ).toBeVisible({ timeout: 10000 })
  })

  test('Dashboard shows pending fees section', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'admin@test.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-btn"]')
    await page.waitForURL('/masters', { timeout: 10000 })
    await page.goto('/dashboard')
    await page.waitForTimeout(2000)
    await expect(
      page.locator('h3:has-text("Pending Fees")')
    ).toBeVisible({ timeout: 10000 })
  })

  test('Dashboard shows stat cards', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'admin@test.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-btn"]')
    await page.waitForURL('/masters', { timeout: 10000 })
    await page.goto('/dashboard')
    await page.waitForTimeout(2000)
    await expect(
      page.locator('text=Total Intake')
    ).toBeVisible({ timeout: 10000 })
    await expect(
      page.locator('text=Total Admitted')
    ).toBeVisible({ timeout: 10000 })
    await expect(
      page.locator('text=Remaining Seats')
    ).toBeVisible({ timeout: 10000 })
  })

})