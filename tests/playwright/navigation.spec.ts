import { test, expect } from '@playwright/test';

test.describe('Dimesmastist Navigation E2E', () => {

  test('1 — homepage loads, navbar visible, no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

    await page.goto('/home');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('nav').first()).toBeVisible();
    await expect(page.locator('a:has-text("Catálogo")')).toBeVisible();
    await expect(page.locator('a:has-text("Registrar")')).toBeVisible();
    await expect(page.locator('a:has-text("Colecciones")')).toBeVisible();
    await expect(page.locator('a:has-text("Favoritos")')).toBeVisible();
    await expect(page.locator('a:has-text("Acerca")')).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('2 — SPA navigation: no full page reload between routes', async ({ page }) => {
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('nav');

    // Set a marker that only survives if there's no full reload
    await page.evaluate(() => {
      (window as any).__navTest = 'survived';
    });

    // Click "Registrar" link in navbar
    await page.locator('a:has-text("Registrar")').click();

    // Wait for the new route to render
    await page.waitForURL('**/coins');
    await page.waitForSelector('h1:has-text("Registrar moneda")');

    // Verify marker survived — this PROVES SPA navigation (no full reload)
    const marker = await page.evaluate(() => (window as any).__navTest);
    expect(marker).toBe('survived');
  });

  test('3 — performance API: no new navigation entries on SPA route change', async ({ page }) => {
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('nav');

    const initialNavs = await page.evaluate(() =>
      performance.getEntriesByType('navigation').length
    );

    await page.locator('a:has-text("Registrar")').click();
    await page.waitForURL('**/coins');
    await page.waitForSelector('h1:has-text("Registrar moneda")');

    const finalNavs = await page.evaluate(() =>
      performance.getEntriesByType('navigation').length
    );

    expect(finalNavs).toBe(initialNavs);
  });

  test('4 — navbar active state reflects current route', async ({ page }) => {
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('nav');

    // "Catálogo" should be active on /home
    const catalogLink = page.locator('a:has-text("Catálogo") span').first();
    await expect(catalogLink).toHaveClass(/text-brand-text/);

    // Click "Registrar" and verify it becomes active
    await page.locator('a:has-text("Registrar")').click();
    await page.waitForURL('**/coins');
    await page.waitForSelector('h1:has-text("Registrar moneda")');

    const registerLink = page.locator('a:has-text("Registrar") span').first();
    await expect(registerLink).toHaveClass(/text-brand-text/);
  });

  test('5 — Cancel button in CoinForm navigates back to /home', async ({ page }) => {
    await page.goto('/home');
    await page.waitForLoadState('networkidle');

    // Navigate to /coins
    await page.locator('a:has-text("Registrar")').click();
    await page.waitForURL('**/coins');
    await page.waitForSelector('h1:has-text("Registrar moneda")');

    // Click cancel
    await page.locator('button:has-text("Cancelar")').click();
    await page.waitForURL('**/home');

    // Verify we're back on landing page
    await expect(page.locator('h1:has-text("colección")')).toBeVisible();
  });

});
