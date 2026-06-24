# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ganadores.spec.js >> Ganadores y distribución >> debe calcular ganadores correctamente después de establecer resultado
- Location: tests\e2e\ganadores.spec.js:5:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.selectOption: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('select:nth-of-type(2)')

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - navigation [ref=e3]:
      - generic [ref=e4]:
        - link "🎯 Apuestas" [ref=e5] [cursor=pointer]:
          - /url: /
        - generic [ref=e6]:
          - link "Admin" [ref=e7] [cursor=pointer]:
            - /url: /admin
          - link "Dashboard" [ref=e8] [cursor=pointer]:
            - /url: /app
          - button "Logout" [ref=e9]
    - generic [ref=e10]:
      - navigation [ref=e11]:
        - generic [ref=e12]:
          - link "⚽ Apuestas" [ref=e13] [cursor=pointer]:
            - /url: /admin
          - button "☰" [ref=e14]
      - main [ref=e15]:
        - generic [ref=e16]:
          - generic [ref=e17]:
            - heading "🔧 Panel Admin" [level=1] [ref=e18]
            - paragraph [ref=e19]: Gestiona apuestas, participantes y resultados
          - generic [ref=e21]:
            - button "Apuestas" [ref=e22]
            - button "Participantes" [ref=e23]
            - button "Acciones" [active] [ref=e24]
          - generic [ref=e25]:
            - generic [ref=e27]:
              - heading "Establecer resultado" [level=3] [ref=e28]
              - generic [ref=e29]:
                - generic [ref=e30]:
                  - generic [ref=e31]:
                    - generic [ref=e32]: Apuesta
                    - combobox [ref=e33]:
                      - option "— Elige una apuesta —"
                      - option "Real Madrid vs Barcelona" [selected]
                      - option "Liverpool vs Manchester United"
                      - option "Paris SG vs Bayern Munich"
                  - generic [ref=e34]:
                    - generic [ref=e35]: Resultado
                    - combobox [ref=e36]:
                      - option "Equipo 1" [selected]
                      - option "Empate"
                      - option "Equipo 2"
                - button "Establecer resultado" [ref=e37]
            - generic [ref=e39]:
              - heading "⚠️ Reseteos" [level=3] [ref=e40]
              - paragraph [ref=e41]: Acciones destructivas. No se pueden deshacer.
              - generic [ref=e42]:
                - button "Resetear apuestas" [ref=e43]
                - button "Resetear participantes" [ref=e44]
                - button "Resetear valores" [ref=e45]
                - button "Resetear ganadores" [ref=e46]
  - button "Open Next.js Dev Tools" [ref=e52] [cursor=pointer]:
    - img [ref=e53]
  - alert [ref=e56]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { seedTestData } from '../helpers.js';
  3   | 
  4   | test.describe('Ganadores y distribución', () => {
  5   |   test('debe calcular ganadores correctamente después de establecer resultado', async ({ page, context }) => {
  6   |     // Asegurar que hay datos en BD
  7   |     await seedTestData();
  8   | 
  9   |     // Setup: loguear como admin
  10  |     await page.goto('/');
  11  |     const adminUser = { id: '507f1f77bcf86cd799439012', email: 'admin@example.com', role: 'admin' };
  12  |     await page.evaluate((u) => localStorage.setItem('user', JSON.stringify(u)), adminUser);
  13  | 
  14  |     // Configurar cookie de autenticación para API endpoints
  15  |     await context.addCookies([
  16  |       {
  17  |         name: 'auth_token',
  18  |         value: 'dummy-token-for-testing',
  19  |         url: 'http://localhost:3000',
  20  |       },
  21  |     ]);
  22  | 
  23  |     // 1. Obtener apuestas actuales vía API
  24  |     const apuestasRes = await page.evaluate(() =>
  25  |       fetch('/api/apuestas').then(r => r.json())
  26  |     );
  27  | 
  28  |     if (apuestasRes.length === 0) {
  29  |       test.skip();
  30  |     }
  31  | 
  32  |     const primeraApuesta = apuestasRes[0];
  33  | 
  34  |     // 2. Obtener valores apostados para esa apuesta
  35  |     const valoresRes = await page.evaluate((apuestaId) =>
  36  |       fetch('/api/valores', { credentials: 'include' }).then(r => r.json()).then(v => Array.isArray(v) ? v.filter(val => val.id_apuesta === apuestaId) : [])
  37  |     , primeraApuesta._id);
  38  | 
  39  |     if (valoresRes.length === 0) {
  40  |       test.skip();
  41  |     }
  42  | 
  43  |     // 3. Ir al admin y establecer resultado
  44  |     await page.goto('/admin');
  45  |     await page.click('button:has-text("Acciones")');
  46  | 
  47  |     // Seleccionar apuesta
  48  |     await page.selectOption('select:nth-of-type(1)', primeraApuesta._id);
  49  | 
  50  |     // Seleccionar resultado (equipo1)
> 51  |     await page.selectOption('select:nth-of-type(2)', 'equipo1');
      |                ^ Error: page.selectOption: Test timeout of 30000ms exceeded.
  52  | 
  53  |     // Establecer resultado
  54  |     await page.click('button:has-text("Establecer resultado")');
  55  | 
  56  |     await expect(page.locator('text=Resultado establecido')).toBeVisible({ timeout: 5000 });
  57  | 
  58  |     // 4. Verificar que se crearon ganadores
  59  |     const ganadoresRes = await page.evaluate(() =>
  60  |       fetch('/api/ganadores').then(r => r.json())
  61  |     );
  62  | 
  63  |     const ganadoresDeApuesta = ganadoresRes.filter(g => g.id_apuesta === primeraApuesta._id);
  64  | 
  65  |     // Debe haber ganadores (quienes apostaron por equipo1)
  66  |     const apostadoresPorEquipo1 = valoresRes.filter(v => v.prediccion === 'equipo1').length;
  67  |     expect(ganadoresDeApuesta.length).toBe(apostadoresPorEquipo1);
  68  | 
  69  |     // 5. Verificar distribución proporcional
  70  |     if (ganadoresDeApuesta.length > 0) {
  71  |       const recaudacion = valoresRes.reduce((sum, v) => sum + v.valor_apostado, 0);
  72  |       const valorPorGanador = recaudacion / ganadoresDeApuesta.length;
  73  | 
  74  |       // Todos los ganadores deben tener el mismo valor
  75  |       const todosIguales = ganadoresDeApuesta.every(g => Math.abs(g.valor_ganado - valorPorGanador) < 0.01);
  76  |       expect(todosIguales).toBeTruthy();
  77  |     }
  78  |   });
  79  | 
  80  |   test('debe mostrar ganancias en dashboard del participante', async ({ page, context }) => {
  81  |     // Setup: loguear como participante
  82  |     await page.goto('/');
  83  |     const user = { id: '507f1f77bcf86cd799439011', email: 'participante@example.com', role: 'participant' };
  84  |     await page.evaluate((u) => localStorage.setItem('user', JSON.stringify(u)), user);
  85  | 
  86  |     // Configurar cookie de autenticación para API endpoints
  87  |     await context.addCookies([
  88  |       {
  89  |         name: 'auth_token',
  90  |         value: 'dummy-token-for-testing',
  91  |         url: 'http://localhost:3000',
  92  |       },
  93  |     ]);
  94  | 
  95  |     await page.goto('/app');
  96  | 
  97  |     // Debe mostrar sección de ganancias si las hay
  98  |     const gananciasSection = page.locator('text=Ganancias totales');
  99  |     if (await gananciasSection.isVisible()) {
  100 |       const monto = page.locator('text=Ganancias totales').locator('..').locator('.text-3xl');
  101 |       const valor = await monto.textContent();
  102 |       expect(valor).toMatch(/\$/);
  103 |     }
  104 |   });
  105 | });
  106 | 
```