# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.js >> Panel Admin >> debe permitir establecer resultado
- Location: tests\e2e\admin.spec.js:41:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.selectOption: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('select').first()
    - locator resolved to <select required="" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">…</select>
  - attempting select option action
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
    - waiting 20ms
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
      - waiting 100ms
    57 × waiting for element to be visible and enabled
       - did not find some options
     - retrying select option action
       - waiting 500ms

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
                      - option "— Elige una apuesta —" [selected]
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
  2   | 
  3   | test.describe('Panel Admin', () => {
  4   |   test.beforeEach(async ({ page, context }) => {
  5   |     // Setup: loguear como admin
  6   |     await page.goto('/');
  7   |     const adminUser = { id: '507f1f77bcf86cd799439012', email: 'admin@example.com', role: 'admin' };
  8   |     await page.evaluate((u) => localStorage.setItem('user', JSON.stringify(u)), adminUser);
  9   | 
  10  |     // Configurar cookie de autenticación para API endpoints
  11  |     await context.addCookies([
  12  |       {
  13  |         name: 'auth_token',
  14  |         value: 'dummy-token-for-testing',
  15  |         url: 'http://localhost:3000',
  16  |       },
  17  |     ]);
  18  |   });
  19  | 
  20  |   test('debe permitir crear apuesta', async ({ page }) => {
  21  |     await page.goto('/admin');
  22  | 
  23  |     // Esperar a que cargue el formulario
  24  |     await page.waitForSelector('input[name="equipo1"]', { timeout: 5000 });
  25  | 
  26  |     // Formulario de crear apuesta
  27  |     await page.fill('input[name="equipo1"]', 'Chelsea');
  28  |     await page.fill('input[name="equipo2"]', 'Arsenal');
  29  |     await page.fill('input[name="valor"]', '200');
  30  | 
  31  |     // Click crear
  32  |     await page.click('button:has-text("Crear Apuesta")');
  33  | 
  34  |     // Esperar confirmación
  35  |     await page.waitForTimeout(2000);
  36  | 
  37  |     // Debe aparecer en tabla
  38  |     await expect(page.locator('text=Chelsea')).toBeVisible({ timeout: 5000 });
  39  |   });
  40  | 
  41  |   test('debe permitir establecer resultado', async ({ page }) => {
  42  |     await page.goto('/admin');
  43  | 
  44  |     // Esperar a que cargue el admin
  45  |     await page.waitForSelector('button:has-text("Acciones")', { timeout: 5000 });
  46  | 
  47  |     // Click en tab Acciones
  48  |     await page.click('button:has-text("Acciones")');
  49  | 
  50  |     // Esperar a que aparezcan los selects
  51  |     await page.waitForSelector('select', { timeout: 5000 });
  52  | 
  53  |     // Seleccionar apuesta
  54  |     const select = page.locator('select').first();
> 55  |     await select.selectOption({ index: 1 }); // Seleccionar primera apuesta disponible
      |                  ^ Error: locator.selectOption: Test timeout of 30000ms exceeded.
  56  | 
  57  |     // Seleccionar resultado
  58  |     await page.selectOption('select:nth-of-type(2)', 'equipo1');
  59  | 
  60  |     // Click establecer resultado
  61  |     await page.click('button:has-text("Establecer resultado")');
  62  | 
  63  |     // Debe haber confirmación
  64  |     await page.waitForTimeout(1000);
  65  |     await expect(page.locator('text=Resultado establecido')).toBeVisible({ timeout: 5000 });
  66  |   });
  67  | 
  68  |   test('debe mostrar lista de participantes', async ({ page }) => {
  69  |     await page.goto('/admin');
  70  | 
  71  |     // Esperar a que cargue el admin
  72  |     await page.waitForSelector('button:has-text("Participantes")', { timeout: 5000 });
  73  | 
  74  |     // Click en tab Participantes
  75  |     await page.click('button:has-text("Participantes")');
  76  | 
  77  |     // Esperar a que aparezca la tabla
  78  |     await page.waitForSelector('text=Participantes', { timeout: 5000 });
  79  | 
  80  |     // Debe mostrar tabla
  81  |     expect(await page.locator('text=Participantes').isVisible()).toBeTruthy();
  82  |   });
  83  | 
  84  |   test('debe permitir resetear colecciones', async ({ page }) => {
  85  |     await page.goto('/admin');
  86  | 
  87  |     // Esperar a que cargue el admin
  88  |     await page.waitForSelector('button:has-text("Acciones")', { timeout: 5000 });
  89  | 
  90  |     // Click en tab Acciones
  91  |     await page.click('button:has-text("Acciones")');
  92  | 
  93  |     // Esperar a que aparezcan los botones de reset
  94  |     await page.waitForSelector('button:has-text("Resetear apuestas")', { timeout: 5000 });
  95  | 
  96  |     // Configurar listener para dialog antes de hacer click
  97  |     page.once('dialog', (dialog) => {
  98  |       expect(dialog.type()).toBe('confirm');
  99  |       dialog.accept();
  100 |     });
  101 | 
  102 |     // Click resetear apuestas
  103 |     await page.click('button:has-text("Resetear apuestas")');
  104 | 
  105 |     // Esperar confirmación de reset (alerta o mensaje en página)
  106 |     await page.waitForTimeout(1000);
  107 |   });
  108 | });
  109 | 
```