import { test, expect } from '@playwright/test';

test.describe('Dimesmastist Navigation E2E', () => {

  test('1 — homepage loads, navbar visible, 4 nav items, no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('nav').first()).toBeVisible();
    await expect(page.locator('nav a:has-text("Catálogo")')).toBeVisible();
    await expect(page.locator('nav a:has-text("Mi colección")')).toBeVisible();
    await expect(page.locator('nav a:has-text("Favoritos")')).toBeVisible();
    await expect(page.locator('nav a:has-text("Acerca")')).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('2 — landing page shows catalog hero, not personal greeting', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('text=Hola')).not.toBeVisible();
  });

  test('3 — SPA navigation: no full page reload between routes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('nav');

    await page.evaluate(() => {
      (window as any).__navTest = 'survived';
    });

    await page.locator('nav a:has-text("Catálogo")').click();
    await page.waitForURL('**/catalogo');

    const marker = await page.evaluate(() => (window as any).__navTest);
    expect(marker).toBe('survived');
  });

  test('4 — performance API: no new navigation entries on SPA route change', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('nav');

    const initialNavs = await page.evaluate(() =>
      performance.getEntriesByType('navigation').length
    );

    await page.locator('nav a:has-text("Mi colección")').click();
    await page.waitForURL('**/mi-coleccion');

    const finalNavs = await page.evaluate(() =>
      performance.getEntriesByType('navigation').length
    );

    expect(finalNavs).toBe(initialNavs);
  });

  test('5 — navbar active state reflects current route', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('nav');

    const catalogLink = page.locator('nav a:has-text("Catálogo") span').first();
    await expect(catalogLink).toHaveClass(/text-brand-text/);

    await page.locator('nav a:has-text("Mi colección")').click();
    await page.waitForURL('**/mi-coleccion');

    const collectionLink = page.locator('nav a:has-text("Mi colección") span').first();
    await expect(collectionLink).toHaveClass(/text-brand-text/);
  });

  test('6 — catalog page loads with seed coins', async ({ page }) => {
    await page.goto('/catalogo');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('text=1 Sucre').first()).toBeVisible();
  });

  test('7 — my collection page loads with greeting', async ({ page }) => {
    await page.goto('/mi-coleccion');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=Hola')).toBeVisible();
    await expect(page.locator('text=Cristian')).toBeVisible();
  });

  test('8 — instance form wizard: step 1 shows catalog grid', async ({ page }) => {
    await page.goto('/mi-coleccion/registrar');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1:has-text("Nueva instancia")')).toBeVisible();
    await expect(page.locator('text=Selecciona una moneda del catálogo')).toBeVisible();
    await expect(page.locator('text=1 Sucre').first()).toBeVisible();
  });

  test('9 — instance form wizard: select coin advances to step 2', async ({ page }) => {
    await page.goto('/mi-coleccion/registrar');
    await page.waitForLoadState('networkidle');

    await page.locator('button:has-text("1 Sucre")').first().click();
    await expect(page.locator('h1:has-text("Nueva instancia")')).toBeVisible();
    await expect(page.locator('text=Estado de conservación')).toBeVisible();
  });

  test('10 — instance form wizard: deep-link with catalogId pre-selects', async ({ page }) => {
    await page.goto('/mi-coleccion/registrar?catalogId=km-88');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=Estado de conservación')).toBeVisible();
  });

  test('11 — instance form: cancel returns to /mi-coleccion', async ({ page }) => {
    await page.goto('/mi-coleccion/registrar');
    await page.waitForLoadState('networkidle');

    // Step 1: select a coin to advance to step 2
    await page.locator('button:has-text("1 Sucre")').first().click();
    await expect(page.locator('text=Estado de conservación')).toBeVisible();

    // Step 2: click cancel
    await page.locator('button:has-text("Cancelar")').click();
    await page.waitForURL('**/mi-coleccion');
  });

  test('12 — about page loads', async ({ page }) => {
    await page.goto('/acerca');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1:has-text("Acerca de Dimesmatist")')).toBeVisible();
  });

  test('13 — favorites page loads with placeholder', async ({ page }) => {
    await page.goto('/favoritos');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1:has-text("Favoritos")')).toBeVisible();
    await expect(page.locator('text=Próximamente')).toBeVisible();
  });

});
