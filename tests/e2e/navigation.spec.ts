import { test, expect } from '@playwright/test'
import { loginAs } from './helpers'

test.describe('Sidebar Navigation', () => {

  test('Admin sees Master Setup in sidebar', async ({ page }) => {
    await loginAs(page, 'admin')
    await expect(
      page.locator('nav').locator('text=Master Setup')
    ).toBeVisible()
  })

  test('Admin sees Applicants in sidebar', async ({ page }) => {
    await loginAs(page, 'admin')
    await expect(
      page.locator('nav').locator('text=Applicants')
    ).toBeVisible()
  })

  test('Admin sees Admissions in sidebar', async ({ page }) => {
    await loginAs(page, 'admin')
    await expect(
      page.locator('nav').locator('text=Admissions')
    ).toBeVisible()
  })

  test('Admin sees Dashboard in sidebar', async ({ page }) => {
    await loginAs(page, 'admin')
    await expect(
      page.locator('nav').locator('text=Dashboard')
    ).toBeVisible()
  })

  test('Management only sees Dashboard in sidebar', async ({ page }) => {
    await loginAs(page, 'management')
    await expect(
      page.locator('nav').locator('text=Dashboard')
    ).toBeVisible()
    await expect(
      page.locator('nav').locator('text=Master Setup')
    ).toHaveCount(0)
    await expect(
      page.locator('nav').locator('text=Applicants')
    ).toHaveCount(0)
  })

  test('Sidebar shows user name and role', async ({ page }) => {
    await loginAs(page, 'admin')
    await page.waitForTimeout(3500)
    await expect(
      page.getByText('Admin User', { exact: true })
    ).toBeVisible()
    await expect(
      page.locator('text=ADMIN').first()
    ).toBeVisible()
  })

  test('Sidebar collapse button works', async ({ page }) => {
    await loginAs(page, 'admin')
    await page.waitForTimeout(3500)
    const xButton = page.locator('button').filter({
      has: page.locator('svg[class*="lucide-x"], svg[class*="X"]')
    })
    const xCount = await xButton.count()
    if (xCount > 0) {
      await xButton.first().click()
    } else {
      await page.locator('aside button').last().click()
    }
    await page.waitForTimeout(800)
    await expect(
      page.locator('nav').locator('text=Master Setup')
    ).toHaveCount(0)
  })

  test('Admin can navigate to Dashboard from sidebar', async ({ page }) => {
    await loginAs(page, 'admin')
    await page.locator('nav').locator('text=Dashboard').click()
    await page.waitForURL('/dashboard', { timeout: 10000 })
    await expect(page).toHaveURL('/dashboard')
  })

  test('Admin can navigate to Applicants from sidebar', async ({ page }) => {
    await loginAs(page, 'admin')
    await page.locator('nav').locator('text=Applicants').click()
    await page.waitForURL('/applicants', { timeout: 10000 })
    await expect(page).toHaveURL('/applicants')
  })

  test('Admin can navigate to Admissions from sidebar', async ({ page }) => {
    await loginAs(page, 'admin')
    await page.locator('nav').locator('text=Admissions').click()
    await page.waitForURL('/admissions', { timeout: 10000 })
    await expect(page).toHaveURL('/admissions')
  })

})