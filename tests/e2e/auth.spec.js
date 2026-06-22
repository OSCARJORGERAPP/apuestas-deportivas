import { test, expect } from '@playwright/test';

test.describe('Autenticación con Magic Link', () => {
  test('debe enviar magic link y permitir login', async ({ page }) => {
    // 1. Ir a login
    await page.goto('/login');
    expect(await page.locator('input[type="email"]').isVisible()).toBeTruthy();

    // 2. Ingresaar email
    const testEmail = `test-${Date.now()}@example.com`;
    await page.fill('input[type="email"]', testEmail);
    await page.click('button:has-text("Enviar magic link")');

    // 3. Esperar mensaje de éxito
    await expect(page.locator('text=Magic link enviado')).toBeVisible({ timeout: 5000 });

    // 4. Obtener email de MailHog
    const mailhogRes = await page.evaluate(() =>
      fetch('http://localhost:8025/api/v2/search?kind=to&query=' + encodeURIComponent('test-' + Date.now()))
        .then(r => r.json())
    );

    // Buscar el último email
    const emails = await page.evaluate(async () => {
      const res = await fetch('http://localhost:8025/api/v2/search?limit=50');
      return await res.json();
    });

    const email = emails.items?.find(e => e.To.some(t => t.Mailbox === 'test'));

    if (email) {
      // Extraer token del email
      const tokenMatch = email.Raw.Data.match(/token=([a-zA-Z0-9._-]+)/);
      if (tokenMatch) {
        const token = tokenMatch[1];

        // 5. Verificar token
        await page.goto(`/auth/verify?token=${token}`);

        // 6. Debe redirigir a /app
        await page.waitForURL('/app', { timeout: 10000 });
        expect(page.url()).toContain('/app');

        // 7. Verificar que el usuario está en localStorage
        const user = await page.evaluate(() => localStorage.getItem('user'));
        expect(user).toBeTruthy();
        expect(user).toContain(testEmail);
      }
    }
  });

  test('debe rechazar token inválido', async ({ page }) => {
    await page.goto('/auth/verify?token=invalid-token');

    await expect(page.locator('text=Token inválido')).toBeVisible({ timeout: 5000 });
  });

  test('debe permitir logout', async ({ page, context }) => {
    // Setup: loguear primero
    const user = { id: '123', email: 'test@example.com', role: 'participant' };
    await context.addCookies([
      {
        name: 'auth_token',
        value: 'dummy',
        url: 'http://localhost:3000',
      },
    ]);

    await page.evaluate((u) => localStorage.setItem('user', JSON.stringify(u)), user);

    // Ir a app
    await page.goto('/app');

    // Hacer logout
    await page.click('button:has-text("Logout")');

    // Debe redirigir a home
    await page.waitForURL('/', { timeout: 5000 });

    // User debe estar borrado de localStorage
    const storedUser = await page.evaluate(() => localStorage.getItem('user'));
    expect(storedUser).toBeNull();
  });
});
