# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apuestas.spec.js >> Apuestas >> debe ver detalle de apuesta y opciones de apostar
- Location: tests\e2e\apuestas.spec.js:19:3

# Error details

```
TimeoutError: locator.waitFor: Timeout 5000ms exceeded.
Call log:
  - waiting for locator('a').filter({ hasText: /vs/ }).first() to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - navigation [ref=e3]:
      - generic [ref=e4]:
        - link "🎯 Apuestas" [ref=e5] [cursor=pointer]:
          - /url: /
        - generic [ref=e6]:
          - link "Dashboard" [ref=e7] [cursor=pointer]:
            - /url: /app
          - button "Logout" [ref=e8]
    - generic [ref=e9]:
      - navigation [ref=e10]:
        - generic [ref=e11]:
          - link "⚽ Apuestas" [ref=e12] [cursor=pointer]:
            - /url: /app
          - button "☰" [ref=e13]
      - main [ref=e14]:
        - generic [ref=e15]:
          - generic [ref=e16]:
            - heading "Dashboard" [level=1] [ref=e17]
            - paragraph [ref=e18]: Bienvenido, test@example.com
          - generic [ref=e19]:
            - generic [ref=e21]:
              - generic [ref=e22]:
                - paragraph [ref=e23]: Apuestas realizadas
                - paragraph [ref=e24]: "3"
              - generic [ref=e25]: 🎯
            - generic [ref=e27]:
              - generic [ref=e28]:
                - paragraph [ref=e29]: Apuestas abiertas
                - paragraph [ref=e30]: "3"
              - generic [ref=e31]: ⚽
            - generic [ref=e33]:
              - generic [ref=e34]:
                - paragraph [ref=e35]: Ganancias totales
                - paragraph [ref=e36]: $0.00
              - generic [ref=e37]: 🏆
          - generic [ref=e38]:
            - heading "Apuestas disponibles" [level=2] [ref=e39]
            - generic [ref=e40]:
              - generic [ref=e42]:
                - generic [ref=e43]:
                  - generic [ref=e44]:
                    - heading "Real Madrid vs Barcelona" [level=3] [ref=e45]
                    - generic [ref=e46]: abierta
                  - paragraph [ref=e47]: ⚽ Apuesta deportiva
                - generic [ref=e48]:
                  - generic [ref=e49]:
                    - paragraph [ref=e50]: Valor inicial
                    - paragraph [ref=e51]: $100
                  - generic [ref=e52]:
                    - paragraph [ref=e53]: Recaudación
                    - paragraph [ref=e54]: $0
                - link "Ver detalles" [ref=e55] [cursor=pointer]:
                  - /url: /app/apuesta/6a3c6fe7c5adbac1151448c6
                  - button "Ver detalles" [ref=e56]
              - generic [ref=e58]:
                - generic [ref=e59]:
                  - generic [ref=e60]:
                    - heading "Liverpool vs Manchester United" [level=3] [ref=e61]
                    - generic [ref=e62]: abierta
                  - paragraph [ref=e63]: ⚽ Apuesta deportiva
                - generic [ref=e64]:
                  - generic [ref=e65]:
                    - paragraph [ref=e66]: Valor inicial
                    - paragraph [ref=e67]: $50
                  - generic [ref=e68]:
                    - paragraph [ref=e69]: Recaudación
                    - paragraph [ref=e70]: $0
                - link "Ver detalles" [ref=e71] [cursor=pointer]:
                  - /url: /app/apuesta/6a3c6fe7c5adbac1151448c7
                  - button "Ver detalles" [ref=e72]
              - generic [ref=e74]:
                - generic [ref=e75]:
                  - generic [ref=e76]:
                    - heading "Paris SG vs Bayern Munich" [level=3] [ref=e77]
                    - generic [ref=e78]: abierta
                  - paragraph [ref=e79]: ⚽ Apuesta deportiva
                - generic [ref=e80]:
                  - generic [ref=e81]:
                    - paragraph [ref=e82]: Valor inicial
                    - paragraph [ref=e83]: $150
                  - generic [ref=e84]:
                    - paragraph [ref=e85]: Recaudación
                    - paragraph [ref=e86]: $0
                - link "Ver detalles" [ref=e87] [cursor=pointer]:
                  - /url: /app/apuesta/6a3c6fe7c5adbac1151448c8
                  - button "Ver detalles" [ref=e88]
          - generic [ref=e90]:
            - heading "Mis apuestas" [level=3] [ref=e91]
            - table [ref=e93]:
              - rowgroup [ref=e94]:
                - row "Apuesta Predicción Monto" [ref=e95]:
                  - columnheader "Apuesta" [ref=e96]
                  - columnheader "Predicción" [ref=e97]
                  - columnheader "Monto" [ref=e98]
              - rowgroup [ref=e99]:
                - row "6a3c6fe7 equipo1 $100" [ref=e100]:
                  - cell "6a3c6fe7" [ref=e101]
                  - cell "equipo1" [ref=e102]
                  - cell "$100" [ref=e103]
                - row "6a3c6fe7 equipo2 $50" [ref=e104]:
                  - cell "6a3c6fe7" [ref=e105]
                  - cell "equipo2" [ref=e106]
                  - cell "$50" [ref=e107]
                - row "6a3c6fe7 equipo1 $60" [ref=e108]:
                  - cell "6a3c6fe7" [ref=e109]
                  - cell "equipo1" [ref=e110]
                  - cell "$60" [ref=e111]
  - button "Open Next.js Dev Tools" [ref=e117] [cursor=pointer]:
    - img [ref=e118]
  - alert [ref=e121]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { seedTestData } from '../helpers.js';
  3  | 
  4  | test.describe('Apuestas', () => {
  5  |   test('debe mostrar apuestas en landing', async ({ page }) => {
  6  |     // Asegurar que hay datos en BD
  7  |     await seedTestData();
  8  | 
  9  |     await page.goto('/');
  10 | 
  11 |     // Esperar a que las apuestas carguen usando locator
  12 |     await page.locator('text=/vs/').first().waitFor({ timeout: 5000 });
  13 | 
  14 |     // Verificar que hay apuestas visibles
  15 |     const apuestasCard = page.locator('text=/vs/');
  16 |     expect(await apuestasCard.count()).toBeGreaterThan(0);
  17 |   });
  18 | 
  19 |   test('debe ver detalle de apuesta y opciones de apostar', async ({ page, context }) => {
  20 |     // Setup: loguear
  21 |     await seedTestData();
  22 |     await page.goto('/');
  23 |     const user = { id: '507f1f77bcf86cd799439011', email: 'test@example.com', role: 'participant' };
  24 |     await page.evaluate((u) => localStorage.setItem('user', JSON.stringify(u)), user);
  25 | 
  26 |     // Configurar cookie de autenticación para API endpoints
  27 |     await context.addCookies([
  28 |       {
  29 |         name: 'auth_token',
  30 |         value: 'dummy-token-for-testing',
  31 |         url: 'http://localhost:3000',
  32 |       },
  33 |     ]);
  34 | 
  35 |     // Ir a /app
  36 |     await page.goto('/app');
  37 | 
  38 |     // Esperar a que carguen las apuestas
  39 |     await page.locator('text=/vs/').first().waitFor({ timeout: 5000 });
  40 | 
  41 |     // Buscar un enlace que navegue a una apuesta
  42 |     const apuestaLink = page.locator('a').filter({ hasText: /vs/ }).first();
  43 | 
  44 |     // Esperar a que el link sea visible y clickeable
> 45 |     await apuestaLink.waitFor({ state: 'visible', timeout: 5000 });
     |                       ^ TimeoutError: locator.waitFor: Timeout 5000ms exceeded.
  46 |     await apuestaLink.click();
  47 | 
  48 |     // Debe estar en /app/apuesta/[id]
  49 |     await page.waitForURL(/\/app\/apuesta\//, { timeout: 10000 });
  50 | 
  51 |     // Verificar que se ve el formulario de apostar
  52 |     await page.locator('text=Elige tu predicción').waitFor({ timeout: 5000 });
  53 |     expect(await page.locator('text=Elige tu predicción').isVisible()).toBeTruthy();
  54 |     expect(await page.locator('input[name="valor_apostado"]').isVisible()).toBeTruthy();
  55 | 
  56 |     // Seleccionar opción y monto
  57 |     await page.click('input[value="equipo1"]');
  58 |     await page.fill('input[name="valor_apostado"]', '50');
  59 | 
  60 |     // Click en botón apostar
  61 |     await page.click('button:has-text("Apostar")');
  62 | 
  63 |     // Esperar confirmación (debería aparecer en la tabla)
  64 |     await expect(page.locator('text=equipo1')).toBeVisible({ timeout: 5000 });
  65 |   });
  66 | 
  67 |   test('no debe permitir apostar en apuesta cerrada', async ({ page, context }) => {
  68 |     await page.goto('/');
  69 |     const user = { id: '507f1f77bcf86cd799439011', email: 'test@example.com', role: 'participant' };
  70 |     await page.evaluate((u) => localStorage.setItem('user', JSON.stringify(u)), user);
  71 | 
  72 |     // Configurar cookie de autenticación para API endpoints
  73 |     await context.addCookies([
  74 |       {
  75 |         name: 'auth_token',
  76 |         value: 'dummy-token-for-testing',
  77 |         url: 'http://localhost:3000',
  78 |       },
  79 |     ]);
  80 | 
  81 |     // Ir a /app
  82 |     await page.goto('/app');
  83 | 
  84 |     // Buscar apuesta cerrada
  85 |     const cerradalink = page.locator('button:has-text("Cerrada")').first().locator('..').locator('a').first();
  86 | 
  87 |     if (await cerradalink.isVisible()) {
  88 |       await cerradalink.click();
  89 | 
  90 |       // Botón apostar debe estar disabled
  91 |       const apostarBtn = page.locator('button:has-text("Apostar")');
  92 |       expect(await apostarBtn.isDisabled()).toBeTruthy();
  93 |     }
  94 |   });
  95 | });
  96 | 
```