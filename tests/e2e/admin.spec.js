import { test, expect } from '@playwright/test';

test.describe('Panel Admin', () => {
  test.beforeEach(async ({ page, context }) => {
    // Setup: loguear como admin
    const adminUser = { id: '507f1f77bcf86cd799439012', email: 'admin@example.com', role: 'admin' };
    await page.evaluate((u) => localStorage.setItem('user', JSON.stringify(u)), adminUser);
  });

  test('debe permitir crear apuesta', async ({ page }) => {
    await page.goto('/admin');

    // Formulario de crear apuesta
    await page.fill('input[name="equipo1"]', 'Chelsea');
    await page.fill('input[name="equipo2"]', 'Arsenal');
    await page.fill('input[name="valor"]', '200');

    // Click crear
    await page.click('button:has-text("Crear Apuesta")');

    // Debe aparecer en tabla
    await expect(page.locator('text=Chelsea')).toBeVisible({ timeout: 5000 });
  });

  test('debe permitir establecer resultado', async ({ page }) => {
    await page.goto('/admin');

    // Click en tab Acciones
    await page.click('button:has-text("Acciones")');

    // Seleccionar apuesta
    const select = page.locator('select').first();
    await select.selectOption({ index: 1 }); // Seleccionar primera apuesta disponible

    // Seleccionar resultado
    await page.selectOption('select:nth-of-type(2)', 'equipo1');

    // Click establecer resultado
    await page.click('button:has-text("Establecer resultado")');

    // Debe haber confirmación
    await expect(page.locator('text=Resultado establecido')).toBeVisible({ timeout: 5000 });
  });

  test('debe mostrar lista de participantes', async ({ page }) => {
    await page.goto('/admin');

    // Click en tab Participantes
    await page.click('button:has-text("Participantes")');

    // Debe mostrar tabla
    expect(await page.locator('text=Participantes').isVisible()).toBeTruthy();
  });

  test('debe permitir resetear colecciones', async ({ page }) => {
    await page.goto('/admin');

    // Click en tab Acciones
    await page.click('button:has-text("Acciones")');

    // Click resetear apuestas
    await page.click('button:has-text("Resetear apuestas")');

    // Debe mostrar confirmación
    page.once('dialog', (dialog) => {
      expect(dialog.type()).toBe('confirm');
      dialog.accept();
    });

    // Esperar confirmación de reset
    await expect(page.locator('text=reseteado')).toBeVisible({ timeout: 5000 });
  });
});
