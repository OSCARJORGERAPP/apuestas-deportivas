import { test, expect } from '@playwright/test';

test.describe('Apuestas', () => {
  test('debe mostrar apuestas en landing', async ({ page }) => {
    await page.goto('/');

    // Verificar que hay apuestas visibles
    const apuestasCard = page.locator('text=/vs/');
    expect(await apuestasCard.count()).toBeGreaterThan(0);
  });

  test('debe ver detalle de apuesta y opciones de apostar', async ({ page, context }) => {
    // Setup: loguear
    const user = { id: '507f1f77bcf86cd799439011', email: 'test@example.com', role: 'participant' };
    await page.evaluate((u) => localStorage.setItem('user', JSON.stringify(u)), user);

    // Ir a /app
    await page.goto('/app');

    // Hacer click en una apuesta
    const apuestaLink = page.locator('a').filter({ hasText: /vs/ }).first();
    await apuestaLink.click();

    // Debe estar en /app/apuesta/[id]
    await page.waitForURL(/\/app\/apuesta\//, { timeout: 5000 });

    // Verificar que se ve el formulario de apostar
    expect(await page.locator('text=Apuesta por').isVisible()).toBeTruthy();
    expect(await page.locator('input[name="valor_apostado"]').isVisible()).toBeTruthy();

    // Seleccionar opción y monto
    await page.click('input[value="equipo1"]');
    await page.fill('input[name="valor_apostado"]', '50');

    // Click en botón apostar
    await page.click('button:has-text("Apostar")');

    // Esperar confirmación (debería aparecer en la tabla)
    await expect(page.locator('text=equipo1')).toBeVisible({ timeout: 5000 });
  });

  test('no debe permitir apostar en apuesta cerrada', async ({ page }) => {
    const user = { id: '507f1f77bcf86cd799439011', email: 'test@example.com', role: 'participant' };
    await page.evaluate((u) => localStorage.setItem('user', JSON.stringify(u)), user);

    // Ir a /app
    await page.goto('/app');

    // Buscar apuesta cerrada
    const cerradalink = page.locator('button:has-text("Cerrada")').first().locator('..').locator('a').first();

    if (await cerradalink.isVisible()) {
      await cerradalink.click();

      // Botón apostar debe estar disabled
      const apostarBtn = page.locator('button:has-text("Apostar")');
      expect(await apostarBtn.isDisabled()).toBeTruthy();
    }
  });
});
