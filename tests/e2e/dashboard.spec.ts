import { test, expect } from '@playwright/test'
import { loginAs } from './helpers'

test.describe('Dashboard — All Roles', () => {

  test('Admin can view dashboard', async ({ page }) => {
    await loginAs(page, 'admin')
    await page.goto('/dashboard')
    await expect(
      page.locator('[data-testid="dashboard-stats"]')
    ).toBeVisible({ timeout: 10000 })
  })

  test('Officer can view dashboard', async ({ page }) => {
    await loginAs(page, 'officer')
    await page.goto('/dashboard')
    await expect(
      page.locator('[data-testid="dashboard-stats"]')
    ).toBeVisible({ timeout: 10000 })
  })

  test('Management can view dashboard', async ({ page }) => {
    await loginAs(page, 'management')
    await expect(page).toHaveURL('/dashboard')
    await expect(
      page.locator('[data-testid="dashboard-stats"]')
    ).toBeVisible({ timeout: 10000 })
  })

  test('Dashboard shows header correctly', async ({ page }) => {
    await loginAs(page, 'admin')
    await page.goto('/dashboard')
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible()
    await expect(
      page.locator('text=Real-time admission statistics')
    ).toBeVisible()
  })

  test('Dashboard shows 4 stat cards', async ({ page }) => {
    await loginAs(page, 'admin')
    await page.goto('/dashboard')
    await page.waitForTimeout(2000)
    await expect(page.locator('text=Total Intake')).toBeVisible()
    await expect(page.locator('text=Total Admitted')).toBeVisible()
    await expect(page.locator('text=Remaining Seats')).toBeVisible()
    // Fix: use span specifically to avoid strict mode
    await expect(
      page.locator('span:has-text("Pending Fees")').first()
    ).toBeVisible()
  })

  test('Dashboard shows quota wise seat status table', async ({ page }) => {
    await loginAs(page, 'admin')
    await page.goto('/dashboard')
    await page.waitForTimeout(2000)
    await expect(
      page.locator('h2:has-text("Quota-wise Seat Status")')
    ).toBeVisible()
  })

  test('Dashboard shows quota table rows', async ({ page }) => {
    await loginAs(page, 'admin')
    await page.goto('/dashboard')
    await page.waitForTimeout(2000)
    await expect(page.locator('td:has-text("KCET")')).toBeVisible()
    await expect(page.locator('td:has-text("COMEDK")')).toBeVisible()
    await expect(page.locator('td:has-text("Management")')).toBeVisible()
  })

  test('Dashboard shows quota fill progress section', async ({ page }) => {
    await loginAs(page, 'admin')
    await page.goto('/dashboard')
    await page.waitForTimeout(2000)
    await expect(
      page.locator('h2:has-text("Quota Fill Progress")')
    ).toBeVisible()
  })

  test('Dashboard shows pending documents section', async ({ page }) => {
    await loginAs(page, 'admin')
    await page.goto('/dashboard')
    await page.waitForTimeout(2000)
    await expect(
      page.locator('h3:has-text("Pending Documents")')
    ).toBeVisible()
  })

  test('Dashboard shows pending fees section', async ({ page }) => {
    await loginAs(page, 'admin')
    await page.goto('/dashboard')
    await page.waitForTimeout(2000)
    await expect(
      page.locator('h3:has-text("Pending Fees")')
    ).toBeVisible()
  })

  test('Dashboard shows live data indicator', async ({ page }) => {
    await loginAs(page, 'admin')
    await page.goto('/dashboard')
    await page.waitForTimeout(2000)
    await expect(page.locator('text=Live data').first()).toBeVisible()
  })

})

test.describe('Dashboard — Role Based Access', () => {

  test('Management cannot access applicants', async ({ page }) => {
    await loginAs(page, 'management')
    await page.goto('/applicants')
    await page.waitForURL('/unauthorized', { timeout: 10000 })
    await expect(page).toHaveURL('/unauthorized')
  })

  test('Management cannot access new applicant form', async ({ page }) => {
    await loginAs(page, 'management')
    await page.goto('/applicants/new')
    await page.waitForURL('/unauthorized', { timeout: 10000 })
    await expect(page).toHaveURL('/unauthorized')
  })

  test('Management cannot access masters', async ({ page }) => {
    await loginAs(page, 'management')
    await page.goto('/masters')
    await page.waitForURL('/unauthorized', { timeout: 10000 })
    await expect(page).toHaveURL('/unauthorized')
  })

  test('Unauthenticated user redirected to login', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL('/login', { timeout: 10000 })
    await expect(page).toHaveURL('/login')
  })

  test('Unauthenticated user cannot access masters', async ({ page }) => {
    await page.goto('/masters')
    await page.waitForURL('/login', { timeout: 10000 })
    await expect(page).toHaveURL('/login')
  })

})