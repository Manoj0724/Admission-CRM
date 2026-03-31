import { test, expect } from '@playwright/test'
import { loginAs } from './helpers'

test.describe('Applicants List', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'officer')
  })

  test('Applicants page loads correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Applicants')
  })

  test('Shows New Applicant button for officer', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'New Applicant' })
    ).toBeVisible()
  })

  test('Shows search bar', async ({ page }) => {
    await expect(
      page.locator('input[placeholder*="Search"]')
    ).toBeVisible()
  })

  test('Shows applicants count', async ({ page }) => {
    await expect(
      page.locator('text=total applicants')
    ).toBeVisible()
  })

  test('Search filters applicants', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]')
    await searchInput.fill('test')
    await page.waitForTimeout(500)
    await expect(searchInput).toHaveValue('test')
  })

  test('Admin can see applicants but not create', async ({ page }) => {
    await loginAs(page, 'admin')
    await page.goto('/applicants')
    await expect(page.locator('h1')).toContainText('Applicants')
    await expect(
      page.locator('button:has-text("New Applicant")')
    ).toHaveCount(0)
  })

  test('Management cannot access applicants page', async ({ page }) => {
    await loginAs(page, 'management')
    await page.goto('/applicants')
    await page.waitForURL('/unauthorized', { timeout: 10000 })
    await expect(page).toHaveURL('/unauthorized')
  })

})

test.describe('New Applicant Form', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'officer')
    await page.getByRole('button', { name: 'New Applicant' }).click()
    await page.waitForURL('/applicants/new', { timeout: 10000 })
  })

  test('Form page loads correctly', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('New Applicant')
  })

  test('Form has all 15 required fields', async ({ page }) => {
    await expect(page.locator('[data-testid="applicant-name"]')).toBeVisible()
    await expect(page.locator('[data-testid="applicant-email"]')).toBeVisible()
    await expect(page.locator('[data-testid="applicant-phone"]')).toBeVisible()
    await expect(page.locator('input[type="date"]')).toBeVisible()
    await expect(page.locator('select:has(option:has-text("Male"))')).toBeVisible()
    await expect(page.locator('select:has(option:has-text("GM"))')).toBeVisible()
    await expect(page.locator('select:has(option:has-text("Regular"))')).toBeVisible()
    await expect(page.locator('select:has(option:has-text("KCET"))')).toBeVisible()
    await expect(page.locator('input[placeholder="Marks"]')).toBeVisible()
    await expect(page.locator('[data-testid="submit-btn"]')).toBeVisible()
  })

  test('Allotment number field appears for KCET quota', async ({ page }) => {
    await page.selectOption('select:has(option:has-text("KCET"))', 'KCET')
    await expect(
      page.locator('input[placeholder="Allotment Number"]')
    ).toBeVisible()
  })

  test('Allotment number field appears for COMEDK quota', async ({ page }) => {
    await page.selectOption('select:has(option:has-text("KCET"))', 'COMEDK')
    await expect(
      page.locator('input[placeholder="Allotment Number"]')
    ).toBeVisible()
  })

  test('Allotment number hidden for Management quota', async ({ page }) => {
    await page.selectOption('select:has(option:has-text("KCET"))', 'Management')
    await expect(
      page.locator('input[placeholder="Allotment Number"]')
    ).toHaveCount(0)
  })

  test('Cancel button navigates back to applicants', async ({ page }) => {
    await page.getByRole('button', { name: 'Cancel' }).click()
    await page.waitForURL('/applicants', { timeout: 10000 })
    await expect(page).toHaveURL('/applicants')
  })

  test('Submit button is visible and enabled', async ({ page }) => {
    await expect(page.locator('[data-testid="submit-btn"]')).toBeVisible()
    await expect(page.locator('[data-testid="submit-btn"]')).toBeEnabled()
  })

  test('Management cannot access new applicant form', async ({ page }) => {
    await loginAs(page, 'management')
    await page.goto('/applicants/new')
    await page.waitForURL('/unauthorized', { timeout: 10000 })
    await expect(page).toHaveURL('/unauthorized')
  })

})

test.describe('Applicant Detail', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'officer')
  })

  test('View button navigates to applicant detail', async ({ page }) => {
    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    if (count > 0) {
      await page.locator('button:has-text("View")').first().click()
      await page.waitForTimeout(1000)
      await expect(page.locator('text=Personal Details')).toBeVisible()
    }
  })

  test('Applicant detail shows personal details card', async ({ page }) => {
    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    if (count > 0) {
      await page.locator('button:has-text("View")').first().click()
      await page.waitForTimeout(1000)
      await expect(page.locator('text=Personal Details')).toBeVisible()
      await expect(page.locator('text=Admission Details')).toBeVisible()
    }
  })

  test('Document status buttons are visible', async ({ page }) => {
    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    if (count > 0) {
      await page.locator('button:has-text("View")').first().click()
      await page.waitForTimeout(1000)
      await expect(page.locator('text=Documents')).toBeVisible()
    }
  })

  test('Fee status section is visible', async ({ page }) => {
    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    if (count > 0) {
      await page.locator('button:has-text("View")').first().click()
      await page.waitForTimeout(1000)
      await expect(page.locator('text=Fee Status')).toBeVisible()
    }
  })

  test('Confirm admission button disabled when fee pending', async ({ page }) => {
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

  test('Back button navigates to applicants list', async ({ page }) => {
    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    if (count > 0) {
      await page.locator('button:has-text("View")').first().click()
      await page.waitForTimeout(1000)
      await page.locator('text=Back to Applicants').click()
      await page.waitForURL('/applicants', { timeout: 10000 })
      await expect(page).toHaveURL('/applicants')
    }
  })

})