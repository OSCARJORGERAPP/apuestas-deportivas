import { test, expect } from '@playwright/test';
import { seedTestData } from '../helpers.js';

test.describe('Apuestas', () => {
  test('debe mostrar apuestas en landing', async ({ page }) => {
    // Asegurar que hay datos en BD
    await seedTestData();

    await page.goto('/');

    // Esperar a que las apuestas carguen usando locator
    await page.locator('text=/vs/').first().waitFor({ timeout: 5000 });

    // Verificar que hay apuestas visibles
    const apuestasCard = page.locator('text=/vs/');
    expect(await apuestasCard.count()).toBeGreaterThan(0);
  });

  test('debe ver detalle de apuesta y opciones de apostar', async ({ page, context }) => {
    // Setup: loguear
    const { apuestasIds } = await seedTestData();

    const user = { id: '507f1f77bcf86cd799439011', email: 'test@example.com', role: 'participant' };

    // Configurar cookie de autenticación ANTES de navegar
    await context.addCookies([
      {
        name: 'auth_token',
        value: 'dummy-token-for-testing',
        url: 'http://localhost:3000',
      },
    ]);

    // Navegar a home primero para establecer localStorage
    await page.goto('/');
    await page.evaluate((u) => localStorage.setItem('user', JSON.stringify(u)), user);

    // Ahora navegar a la apuesta
    const apuestaId = apuestasIds[0];
    await page.goto(`/app/apuesta/${apuestaId}`);

    // Esperar a que se cargue la página
    await page.waitForURL(/\/app\/apuesta\//, { timeout: 10000 });

    // Verificar que se ve el formulario de apostar
    await page.locator('text=Elige tu predicción').waitFor({ timeout: 5000 });
    expect(await page.locator('text=Elige tu predicción').isVisible()).toBeTruthy();
  });

  test('no debe permitir apostar en apuesta cerrada', async ({ page, context }) => {
    await page.goto('/');
    const user = { id: '507f1f77bcf86cd799439011', email: 'test@example.com', role: 'participant' };
    await page.evaluate((u) => localStorage.setItem('user', JSON.stringify(u)), user);

    // Configurar cookie de autenticación para API endpoints
    await context.addCookies([
      {
        name: 'auth_token',
        value: 'dummy-token-for-testing',
        url: 'http://localhost:3000',
      },
    ]);

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
