import { Page } from '@playwright/test'

export const loginAs = async (
  page: Page,
  role: 'admin' | 'officer' | 'management'
) => {
  const credentials = {
    admin:      { email: 'admin@test.com',   password: 'password123', redirect: '/masters'    },
    officer:    { email: 'officer@test.com', password: 'password123', redirect: '/applicants' },
    management: { email: 'mgmt@test.com',    password: 'password123', redirect: '/dashboard'  },
  }
  const { email, password, redirect } = credentials[role]
  await page.goto('/login')
  await page.fill('[data-testid="email"]', email)
  await page.fill('[data-testid="password"]', password)
  await page.click('[data-testid="login-btn"]')
  await page.waitForURL(redirect, { timeout: 15000 })
}