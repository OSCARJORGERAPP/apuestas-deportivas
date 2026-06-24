# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apuestas.spec.js >> Apuestas >> debe ver detalle de apuesta y opciones de apostar
- Location: tests\e2e\apuestas.spec.js:19:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('a').filter({ hasText: /vs/ }).first()

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
                  - /url: /app/apuesta/6a3c6d73e0fec8cf00501d0a
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
                  - /url: /app/apuesta/6a3c6d73e0fec8cf00501d0b
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
                  - /url: /app/apuesta/6a3c6d73e0fec8cf00501d0c
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
                - row "6a3c6d73 equipo1 $100" [ref=e100]:
                  - cell "6a3c6d73" [ref=e101]
                  - cell "equipo1" [ref=e102]
                  - cell "$100" [ref=e103]
                - row "6a3c6d73 equipo2 $50" [ref=e104]:
                  - cell "6a3c6d73" [ref=e105]
                  - cell "equipo2" [ref=e106]
                  - cell "$50" [ref=e107]
                - row "6a3c6d73 equipo1 $60" [ref=e108]:
                  - cell "6a3c6d73" [ref=e109]
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
  21 |     await page.goto('/');
  22 |     const user = { id: '507f1f77bcf86cd799439011', email: 'test@example.com', role: 'participant' };
  23 |     await page.evaluate((u) => localStorage.setItem('user', JSON.stringify(u)), user);
  24 | 
  25 |     // Configurar cookie de autenticación para API endpoints
  26 |     await context.addCookies([
  27 |       {
  28 |         name: 'auth_token',
  29 |         value: 'dummy-token-for-testing',
  30 |         url: 'http://localhost:3000',
  31 |       },
  32 |     ]);
  33 | 
  34 |     // Ir a /app
  35 |     await page.goto('/app');
  36 | 
  37 |     // Hacer click en una apuesta
  38 |     const apuestaLink = page.locator('a').filter({ hasText: /vs/ }).first();
> 39 |     await apuestaLink.click();
     |                       ^ Error: locator.click: Test timeout of 30000ms exceeded.
  40 | 
  41 |     // Debe estar en /app/apuesta/[id]
  42 |     await page.waitForURL(/\/app\/apuesta\//, { timeout: 5000 });
  43 | 
  44 |     // Verificar que se ve el formulario de apostar
  45 |     expect(await page.locator('text=Apuesta por').isVisible()).toBeTruthy();
  46 |     expect(await page.locator('input[name="valor_apostado"]').isVisible()).toBeTruthy();
  47 | 
  48 |     // Seleccionar opción y monto
  49 |     await page.click('input[value="equipo1"]');
  50 |     await page.fill('input[name="valor_apostado"]', '50');
  51 | 
  52 |     // Click en botón apostar
  53 |     await page.click('button:has-text("Apostar")');
  54 | 
  55 |     // Esperar confirmación (debería aparecer en la tabla)
  56 |     await expect(page.locator('text=equipo1')).toBeVisible({ timeout: 5000 });
  57 |   });
  58 | 
  59 |   test('no debe permitir apostar en apuesta cerrada', async ({ page, context }) => {
  60 |     await page.goto('/');
  61 |     const user = { id: '507f1f77bcf86cd799439011', email: 'test@example.com', role: 'participant' };
  62 |     await page.evaluate((u) => localStorage.setItem('user', JSON.stringify(u)), user);
  63 | 
  64 |     // Configurar cookie de autenticación para API endpoints
  65 |     await context.addCookies([
  66 |       {
  67 |         name: 'auth_token',
  68 |         value: 'dummy-token-for-testing',
  69 |         url: 'http://localhost:3000',
  70 |       },
  71 |     ]);
  72 | 
  73 |     // Ir a /app
  74 |     await page.goto('/app');
  75 | 
  76 |     // Buscar apuesta cerrada
  77 |     const cerradalink = page.locator('button:has-text("Cerrada")').first().locator('..').locator('a').first();
  78 | 
  79 |     if (await cerradalink.isVisible()) {
  80 |       await cerradalink.click();
  81 | 
  82 |       // Botón apostar debe estar disabled
  83 |       const apostarBtn = page.locator('button:has-text("Apostar")');
  84 |       expect(await apostarBtn.isDisabled()).toBeTruthy();
  85 |     }
  86 |   });
  87 | });
  88 | 
```