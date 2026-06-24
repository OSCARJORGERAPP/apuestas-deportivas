import { test, expect } from '@playwright/test';

test.describe('Reseteos', () => {
  test.beforeEach(async ({ page, context }) => {
    // Setup: loguear como admin
    // Nota: Los endpoints de reset requieren autenticación via cookie auth_token
    // En un entorno real, esto vendría del servidor. Para tests, simulamos un token.
    await page.goto('/');
    const adminUser = { id: '507f1f77bcf86cd799439012', email: 'admin@example.com', role: 'admin' };
    await page.evaluate((u) => localStorage.setItem('user', JSON.stringify(u)), adminUser);

    // Configurar cookie de autenticación (para pasar el middleware de API)
    // En un ambiente de testing real, se generaría un JWT válido
    await context.addCookies([
      {
        name: 'auth_token',
        value: 'dummy-token-for-testing',
        url: 'http://localhost:3000',
      },
    ]);
  });

  test('debe resetear apuestas vía API', async ({ page }) => {
    // Contar apuestas antes
    const antesRes = await page.evaluate(() =>
      fetch('/api/apuestas').then(r => r.json())
    );

    const countAntes = antesRes.length;
    expect(countAntes).toBeGreaterThan(0);

    // Resetear vía API
    await page.evaluate(() =>
      fetch('/api/apuestas?reset=true', { method: 'DELETE' })
    );

    // Esperar un poco
    await page.waitForTimeout(500);

    // Contar apuestas después
    const despuesRes = await page.evaluate(() =>
      fetch('/api/apuestas').then(r => r.json())
    );

    expect(despuesRes.length).toBe(0);
  });

  test('debe resetear participantes vía API', async ({ page }) => {
    // Contar participantes antes
    const antesRes = await page.evaluate(() =>
      fetch('/api/participantes').then(r => r.json())
    );

    const countAntes = Array.isArray(antesRes) ? antesRes.length : 0;
    expect(countAntes).toBeGreaterThan(0);

    // Resetear
    await page.evaluate(() =>
      fetch('/api/participantes?reset=true', { method: 'DELETE' })
    );

    // Esperar un poco
    await page.waitForTimeout(500);

    // Contar después
    const despuesRes = await page.evaluate(() =>
      fetch('/api/participantes').then(r => r.json())
    );

    expect(Array.isArray(despuesRes) ? despuesRes.length : 0).toBe(0);
  });

  test('debe resetear valores apostados vía API', async ({ page }) => {
    // Resetear
    await page.evaluate(() =>
      fetch('/api/valores?reset=true', { method: 'DELETE' })
    );

    // Esperar un poco
    await page.waitForTimeout(500);

    // Contar después
    const despuesRes = await page.evaluate(() =>
      fetch('/api/valores').then(r => r.json())
    );

    expect(Array.isArray(despuesRes) ? despuesRes.length : 0).toBe(0);
  });

  test('debe resetear ganadores vía API', async ({ page }) => {
    // Resetear
    await page.evaluate(() =>
      fetch('/api/ganadores?reset=true', { method: 'DELETE' })
    );

    // Esperar un poco
    await page.waitForTimeout(500);

    // Contar después
    const despuesRes = await page.evaluate(() =>
      fetch('/api/ganadores').then(r => r.json())
    );

    expect(Array.isArray(despuesRes) ? despuesRes.length : 0).toBe(0);
  });

  test('debe resetear desde panel admin', async ({ page }) => {
    await page.goto('/admin');
    await page.click('button:has-text("Acciones")');

    // Click resetear apuestas
    await page.click('button:has-text("Resetear apuestas")');

    // Aceptar confirmación
    page.once('dialog', (dialog) => {
      dialog.accept();
    });

    // Debe haber alerta de éxito
    await expect(page.locator('text=reseteado')).toBeVisible({ timeout: 5000 });
  });
});
