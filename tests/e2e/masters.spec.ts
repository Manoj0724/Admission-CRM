import { test, expect } from '@playwright/test'
import { loginAs } from './helpers'

test.describe('Masters Setup — Admin Only', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin')
  })

  test('Masters page loads with all tabs', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Master Setup')
    await expect(
      page.getByRole('button', { name: 'institution', exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'campus', exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'department', exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'program', exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'quota', exact: true })
    ).toBeVisible()
  })

  test('Institution tab shows create form', async ({ page }) => {
    await page.getByRole('button', { name: 'institution', exact: true }).click()
    await expect(
      page.getByRole('heading', { name: 'Create Institution' })
    ).toBeVisible()
  })

  test('Institution form has name and code fields', async ({ page }) => {
    await page.getByRole('button', { name: 'institution', exact: true }).click()
    await expect(
      page.locator('input[placeholder="Institution Name"]')
    ).toBeVisible()
    await expect(
      page.locator('input[placeholder="Institution Code (e.g. INST)"]')
    ).toBeVisible()
  })

  test('Institution list is visible', async ({ page }) => {
    await page.getByRole('button', { name: 'institution', exact: true }).click()
    await expect(
      page.getByRole('heading', { name: /Institutions/ })
    ).toBeVisible()
  })

  test('Campus tab shows create form', async ({ page }) => {
    await page.getByRole('button', { name: 'campus', exact: true }).click()
    await expect(
      page.getByRole('heading', { name: 'Create Campus' })
    ).toBeVisible()
  })

  test('Campus form has name and institution dropdown', async ({ page }) => {
    await page.getByRole('button', { name: 'campus', exact: true }).click()
    await expect(
      page.locator('input[placeholder="Campus Name"]')
    ).toBeVisible()
    await expect(page.locator('select').first()).toBeVisible()
  })

  test('Department tab shows create form', async ({ page }) => {
    await page.getByRole('button', { name: 'department', exact: true }).click()
    await expect(
      page.getByRole('heading', { name: 'Create Department' })
    ).toBeVisible()
  })

  test('Department form has name, code, campus fields', async ({ page }) => {
    await page.getByRole('button', { name: 'department', exact: true }).click()
    await expect(
      page.locator('input[placeholder="Department Name"]')
    ).toBeVisible()
    await expect(
      page.locator('input[placeholder="Department Code (e.g. CSE)"]')
    ).toBeVisible()
  })

  test('Program tab shows create form', async ({ page }) => {
    await page.getByRole('button', { name: 'program', exact: true }).click()
    await expect(
      page.getByRole('heading', { name: 'Create Program' })
    ).toBeVisible()
  })

  test('Program form has all required fields', async ({ page }) => {
    await page.getByRole('button', { name: 'program', exact: true }).click()
    await expect(
      page.locator('input[placeholder="Program Name (e.g. B.E Computer Science)"]')
    ).toBeVisible()
    await expect(
      page.locator('input[placeholder="Total Intake (e.g. 60)"]')
    ).toBeVisible()
    await expect(
      page.locator('input[placeholder="Academic Year (e.g. 2025-26)"]')
    ).toBeVisible()
  })

  test('Quota tab shows configure form', async ({ page }) => {
    await page.getByRole('button', { name: 'quota', exact: true }).click()
    await expect(
      page.getByRole('heading', { name: 'Configure Quotas' })
    ).toBeVisible()
  })

  test('Quota form has KCET, COMEDK, Management fields', async ({ page }) => {
    await page.getByRole('button', { name: 'quota', exact: true }).click()
    await expect(
      page.locator('input[placeholder="KCET seats"]')
    ).toBeVisible()
    await expect(
      page.locator('input[placeholder="COMEDK seats"]')
    ).toBeVisible()
    await expect(
      page.locator('input[placeholder="Management seats"]')
    ).toBeVisible()
  })

  test('Quota tab shows quota sum warning', async ({ page }) => {
    await page.getByRole('button', { name: 'quota', exact: true }).click()
    await expect(
      page.locator('text=Sum of all quota seats must equal program total intake')
    ).toBeVisible()
  })

})

test.describe('Masters — Role Access Control', () => {

  test('Officer cannot access masters page', async ({ page }) => {
    await loginAs(page, 'officer')
    await page.goto('/masters')
    await page.waitForURL('/unauthorized', { timeout: 10000 })
    await expect(page).toHaveURL('/unauthorized')
  })

  test('Management cannot access masters page', async ({ page }) => {
    await loginAs(page, 'management')
    await page.goto('/masters')
    await page.waitForURL('/unauthorized', { timeout: 10000 })
    await expect(page).toHaveURL('/unauthorized')
  })

  test('Unauthorized page shows access denied message', async ({ page }) => {
    await loginAs(page, 'management')
    await page.goto('/masters')
    await page.waitForURL('/unauthorized', { timeout: 10000 })
    await expect(page.locator('text=Access Denied')).toBeVisible()
  })

})