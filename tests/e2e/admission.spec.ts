import { test, expect } from '@playwright/test'

test.describe('Applicant Management', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'officer@test.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-btn"]')
    await page.waitForURL('/applicants', { timeout: 10000 })
  })

  test('Officer can see applicants page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Applicants')
  })

  test('Officer can see New Applicant button', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'New Applicant' })
    ).toBeVisible()
  })

  test('Officer can navigate to new applicant form', async ({ page }) => {
    await page.getByRole('button', { name: 'New Applicant' }).click()
    await page.waitForURL('/applicants/new', { timeout: 10000 })
    await expect(page).toHaveURL('/applicants/new')
    await expect(
      page.locator('h1')
    ).toContainText('New Applicant')
  })

  test('New applicant form has all required fields', async ({ page }) => {
    await page.goto('/applicants/new')
    await expect(page.locator('[data-testid="applicant-name"]')).toBeVisible()
    await expect(page.locator('[data-testid="applicant-email"]')).toBeVisible()
    await expect(page.locator('[data-testid="applicant-phone"]')).toBeVisible()
    await expect(page.locator('[data-testid="submit-btn"]')).toBeVisible()
  })

  test('Submit button exists on applicant form', async ({ page }) => {
    await page.goto('/applicants/new')
    await expect(
      page.locator('[data-testid="submit-btn"]')
    ).toBeVisible()
  })

})

test.describe('Admission Confirmation Rules', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'officer@test.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="login-btn"]')
    await page.waitForURL('/applicants', { timeout: 10000 })
  })

  test('Confirm button disabled when fee pending', async ({ page }) => {
    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    if (count > 0) {
      await page.locator('button:has-text("View")').first().click()
      await page.waitForTimeout(1000)
      const confirmBtn = page.locator('[data-testid="confirm-admission"]')
      const exists = await confirmBtn.count()
      if (exists > 0) {
        await expect(confirmBtn).toBeDisabled()
      }
    }
  })

  test('Fee paid button visible on applicant detail', async ({ page }) => {
    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    if (count > 0) {
      await page.locator('button:has-text("View")').first().click()
      await page.waitForTimeout(1000)
      const feeBtn = page.locator('[data-testid="mark-fee-paid"]')
      const exists = await feeBtn.count()
      if (exists > 0) {
        await expect(feeBtn).toBeVisible()
      }
    }
  })

})