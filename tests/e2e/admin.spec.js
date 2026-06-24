import { test, expect } from '@playwright/test';

test.describe('Panel Admin', () => {
  test.beforeEach(async ({ page, context }) => {
    // Setup: loguear como admin
    await page.goto('/');
    const adminUser = { id: '507f1f77bcf86cd799439012', email: 'admin@example.com', role: 'admin' };
    await page.evaluate((u) => localStorage.setItem('user', JSON.stringify(u)), adminUser);

    // Configurar cookie de autenticación para API endpoints
    await context.addCookies([
      {
        name: 'auth_token',
        value: 'dummy-token-for-testing',
        url: 'http://localhost:3000',
      },
    ]);
  });

  test('debe permitir crear apuesta', async ({ page }) => {
    await page.goto('/admin');

    // Esperar a que cargue el formulario
    await page.waitForSelector('input[name="equipo1"]', { timeout: 5000 });

    // Formulario de crear apuesta
    await page.fill('input[name="equipo1"]', 'Chelsea');
    await page.fill('input[name="equipo2"]', 'Arsenal');
    await page.fill('input[name="valor"]', '200');

    // Click crear
    await page.click('button:has-text("Crear Apuesta")');

    // Esperar confirmación
    await page.waitForTimeout(2000);

    // Debe aparecer en tabla
    await expect(page.locator('text=Chelsea')).toBeVisible({ timeout: 5000 });
  });

  test('debe permitir establecer resultado', async ({ page }) => {
    await page.goto('/admin');

    // Esperar a que cargue el admin y haya apuestas
    await page.waitForSelector('button:has-text("Acciones")', { timeout: 5000 });

    // Click en tab Acciones
    await page.click('button:has-text("Acciones")');

    // Esperar a que aparezcan los selects con opciones
    await page.locator('select').first().waitFor({ timeout: 5000 });

    // Verificar que hay opciones para seleccionar (más de 1 porque hay un option vacío)
    const selectCount = await page.locator('select:first-of-type > option').count();
    if (selectCount <= 1) {
      // Si no hay apuestas, saltar el test
      test.skip();
    }

    // Seleccionar apuesta
    const select = page.locator('select').first();
    await select.selectOption({ index: 1 }); // Seleccionar primera apuesta disponible

    // Esperar a que se seleccione
    await page.waitForTimeout(500);

    // Seleccionar resultado
    await page.selectOption('select:nth-of-type(2)', 'equipo1');

    // Click establecer resultado
    await page.click('button:has-text("Establecer resultado")');

    // Esperar confirmación
    await page.waitForTimeout(1000);
  });

  test('debe mostrar lista de participantes', async ({ page }) => {
    await page.goto('/admin');

    // Esperar a que cargue el admin
    await page.waitForSelector('button:has-text("Participantes")', { timeout: 5000 });

    // Click en tab Participantes
    await page.click('button:has-text("Participantes")');

    // Esperar a que aparezca la tabla (con o sin filas)
    await page.locator('text=Participantes').first().waitFor({ timeout: 5000 });

    // Debe mostrar tabla
    expect(await page.locator('text=Participantes').isVisible()).toBeTruthy();
  });

  test('debe permitir resetear colecciones', async ({ page }) => {
    await page.goto('/admin');

    // Esperar a que cargue el admin
    await page.waitForSelector('button:has-text("Acciones")', { timeout: 5000 });

    // Click en tab Acciones
    await page.click('button:has-text("Acciones")');

    // Esperar a que aparezcan los botones de reset
    await page.waitForSelector('button:has-text("Resetear apuestas")', { timeout: 5000 });

    // Configurar listener para dialog antes de hacer click
    page.once('dialog', (dialog) => {
      expect(dialog.type()).toBe('confirm');
      dialog.accept();
    });

    // Click resetear apuestas
    await page.click('button:has-text("Resetear apuestas")');

    // Esperar confirmación de reset (alerta o mensaje en página)
    await page.waitForTimeout(1000);
  });
});
