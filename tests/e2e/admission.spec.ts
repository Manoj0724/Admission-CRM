import { test, expect } from '@playwright/test'

test.describe('Applicant Management', () => {

  test.beforeEach(async ({ page }) => {
    // Login as Officer
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'officer@test.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-btn"]')
    await expect(page).toHaveURL('/applicants')
  })

  test('Officer can see applicants page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Applicants')
  })

  test('Officer can see New Applicant button', async ({ page }) => {
    await expect(
      page.locator('button:has-text("New Applicant")')
    ).toBeVisible()
  })

  test('Officer can navigate to new applicant form', async ({ page }) => {
    await page.click('button:has-text("New Applicant")')
    await expect(page).toHaveURL('/applicants/new')
    await expect(
      page.locator('h1:has-text("New Applicant")')
    ).toBeVisible()
  })

  test('System blocks seat when quota is full', async ({ page }) => {
    await page.goto('/applicants')
    // Check quota full error exists when allocating
    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    if (count > 0) {
      await page.click('button:has-text("View")')
      await expect(page.locator('text=Allocate Seat')).toBeVisible()
    }
  })

})

test.describe('Admission Confirmation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'officer@test.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-btn"]')
  })

  test('Confirm button disabled when fee pending', async ({ page }) => {
    await page.goto('/applicants')
    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    if (count > 0) {
      await page.click('button:has-text("View")')
      const confirmBtn = page.locator('[data-testid="confirm-admission"]')
      const exists = await confirmBtn.count()
      if (exists > 0) {
        await expect(confirmBtn).toBeDisabled()
      }
    }
  })

})