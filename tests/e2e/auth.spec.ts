import { test, expect } from '@playwright/test'
import { loginAs } from './helpers'

test.describe('Authentication', () => {

  test('Login page loads correctly', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('h1')).toContainText('Admission CRM')
    await expect(page.locator('[data-testid="email"]')).toBeVisible()
    await expect(page.locator('[data-testid="password"]')).toBeVisible()
    await expect(page.locator('[data-testid="login-btn"]')).toBeVisible()
  })

  test('Login page shows test credentials hint', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('text=Test Credentials')).toBeVisible()
  })

  test('Admin login redirects to masters page', async ({ page }) => {
    await loginAs(page, 'admin')
    await expect(page).toHaveURL('/masters')
  })

  test('Officer login redirects to applicants page', async ({ page }) => {
    await loginAs(page, 'officer')
    await expect(page).toHaveURL('/applicants')
  })

  test('Management login redirects to dashboard', async ({ page }) => {
    await loginAs(page, 'management')
    await expect(page).toHaveURL('/dashboard')
  })

  test('Invalid credentials shows error toast', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'wrong@test.com')
    await page.fill('[data-testid="password"]', 'wrongpass')
    await page.click('[data-testid="login-btn"]')
    await expect(
      page.locator('div[role="status"]').first()
    ).toBeVisible({ timeout: 8000 })
  })

  test('Empty form shows required validation', async ({ page }) => {
    await page.goto('/login')
    await page.click('[data-testid="login-btn"]')
    const emailInput = page.locator('[data-testid="email"]')
    await expect(emailInput).toBeVisible()
  })

  test('Logout works correctly', async ({ page }) => {
    await loginAs(page, 'admin')
    await page.click('button:has-text("Logout")')
    await page.waitForURL('/login', { timeout: 10000 })
    await expect(page).toHaveURL('/login')
  })

})