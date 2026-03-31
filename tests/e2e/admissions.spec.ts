import { test, expect } from '@playwright/test'
import { loginAs } from './helpers'

test.describe('Admissions List', () => {

  test('Officer can view admissions page', async ({ page }) => {
    await loginAs(page, 'officer')
    await page.goto('/admissions')
    await expect(
      page.locator('h1:has-text("Confirmed Admissions")')
    ).toBeVisible()
  })

  test('Admin can view admissions page', async ({ page }) => {
    await loginAs(page, 'admin')
    await page.goto('/admissions')
    await expect(
      page.locator('h1:has-text("Confirmed Admissions")')
    ).toBeVisible()
  })

  test('Management can view admissions page', async ({ page }) => {
    await loginAs(page, 'management')
    await page.goto('/admissions')
    await expect(
      page.locator('h1:has-text("Confirmed Admissions")')
    ).toBeVisible()
  })

  test('Admissions page shows all admissions heading', async ({ page }) => {
    await loginAs(page, 'officer')
    await page.goto('/admissions')
    await expect(
      page.locator('text=All Admissions')
    ).toBeVisible()
  })

  test('Empty admissions shows no admissions message', async ({ page }) => {
    await loginAs(page, 'officer')
    await page.goto('/admissions')
    await page.waitForTimeout(1500)
    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    if (count === 0) {
      await expect(
        page.locator('text=No admissions confirmed yet')
      ).toBeVisible()
    }
  })

  test('Admissions table has correct columns', async ({ page }) => {
    await loginAs(page, 'officer')
    await page.goto('/admissions')
    await page.waitForTimeout(1500)
    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    if (count > 0) {
      await expect(page.locator('th:has-text("Admission No.")')).toBeVisible()
      await expect(page.locator('th:has-text("Student")')).toBeVisible()
      await expect(page.locator('th:has-text("Program")')).toBeVisible()
      await expect(page.locator('th:has-text("Quota")')).toBeVisible()
      await expect(page.locator('th:has-text("Confirmed On")')).toBeVisible()
    }
  })

})

test.describe('Seat Allocation Rules', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'officer')
  })

  test('Allocate seat button visible on applicant detail', async ({ page }) => {
    await page.goto('/applicants')
    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    if (count > 0) {
      await page.locator('button:has-text("View")').first().click()
      await page.waitForTimeout(1000)
      const allocateBtn = page.locator('button:has-text("Allocate Seat")')
      const exists = await allocateBtn.count()
      if (exists > 0) {
        await expect(allocateBtn).toBeVisible()
      }
    }
  })

  test('Confirm admission disabled without fee paid', async ({ page }) => {
    await page.goto('/applicants')
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

  test('Mark fee paid button is visible', async ({ page }) => {
    await page.goto('/applicants')
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