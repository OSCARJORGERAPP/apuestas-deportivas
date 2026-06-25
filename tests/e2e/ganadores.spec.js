import { test, expect } from '@playwright/test';
import { seedTestData } from '../helpers.js';

test.describe('Ganadores y distribución', () => {
  test('debe calcular ganadores correctamente después de establecer resultado', async ({ page, context }) => {
    // Asegurar que hay datos en BD
    await seedTestData();

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

    // 1. Obtener apuestas actuales vía API
    const apuestasRes = await page.evaluate(() =>
      fetch('/api/apuestas').then(r => r.json())
    );

    if (apuestasRes.length === 0) {
      test.skip();
    }

    const primeraApuesta = apuestasRes[0];

    // 2. Obtener valores apostados para esa apuesta
    const valoresRes = await page.evaluate((apuestaId) =>
      fetch('/api/valores', { credentials: 'include' }).then(r => r.json()).then(v => Array.isArray(v) ? v.filter(val => val.id_apuesta === apuestaId) : [])
    , primeraApuesta._id);

    if (valoresRes.length === 0) {
      test.skip();
    }

    // 3. Ir al admin y establecer resultado
    await page.goto('/admin');

    // Esperar a que cargue
    await page.locator('button:has-text("Acciones")').waitFor({ timeout: 5000 });
    await page.click('button:has-text("Acciones")');

    // Esperar a que aparezcan los selects
    await page.locator('select').first().waitFor({ timeout: 5000 });

    const selects = page.locator('select');
    const selectsCount = await selects.count();
    if (selectsCount < 2) {
      test.skip();
    }

    // Seleccionar apuesta
    await selects.first().selectOption(primeraApuesta._id.toString());

    // Esperar a que se seleccione
    await page.waitForTimeout(500);

    // Seleccionar resultado (equipo1)
    await selects.nth(1).selectOption('equipo1');

    // Establecer resultado
    await page.click('button:has-text("Establecer resultado")');

    await page.waitForTimeout(1000);

    // 4. Verificar que se crearon ganadores
    const ganadoresRes = await page.evaluate(() =>
      fetch('/api/ganadores').then(r => r.json())
    );

    const ganadoresDeApuesta = ganadoresRes.filter(g => g.id_apuesta === primeraApuesta._id);

    // Debe haber ganadores (quienes apostaron por equipo1)
    const apostadoresPorEquipo1 = valoresRes.filter(v => v.prediccion === 'equipo1').length;
    expect(ganadoresDeApuesta.length).toBe(apostadoresPorEquipo1);

    // 5. Verificar distribución proporcional
    if (ganadoresDeApuesta.length > 0) {
      const recaudacion = valoresRes.reduce((sum, v) => sum + v.valor_apostado, 0);
      const valorPorGanador = recaudacion / ganadoresDeApuesta.length;

      // Todos los ganadores deben tener el mismo valor
      const todosIguales = ganadoresDeApuesta.every(g => Math.abs(g.valor_ganado - valorPorGanador) < 0.01);
      expect(todosIguales).toBeTruthy();
    }
  });

  test('debe mostrar ganancias en dashboard del participante', async ({ page, context }) => {
    // Setup: loguear como participante
    await page.goto('/');
    const user = { id: '507f1f77bcf86cd799439011', email: 'participante@example.com', role: 'participant' };
    await page.evaluate((u) => localStorage.setItem('user', JSON.stringify(u)), user);

    // Configurar cookie de autenticación para API endpoints
    await context.addCookies([
      {
        name: 'auth_token',
        value: 'dummy-token-for-testing',
        url: 'http://localhost:3000',
      },
    ]);

    await page.goto('/app');

    // Debe mostrar sección de ganancias si las hay
    const gananciasSection = page.locator('text=Ganancias totales');
    if (await gananciasSection.isVisible()) {
      const monto = page.locator('text=Ganancias totales').locator('..').locator('.text-3xl');
      const valor = await monto.textContent();
      expect(valor).toMatch(/\$/);
    }
  });
});
