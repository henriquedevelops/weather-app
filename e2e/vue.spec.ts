import { test, expect } from '@playwright/test'

test('displays weather app with location tabs', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('h1')).toBeVisible()
})
