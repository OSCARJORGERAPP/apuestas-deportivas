# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.js >> Panel Admin >> debe mostrar lista de participantes
- Location: tests\e2e\admin.spec.js:86:3

# Error details

```
Error: locator.isVisible: Error: strict mode violation: locator('text=Participantes') resolved to 3 elements:
    1) <p class="text-gray-600">Gestiona apuestas, participantes y resultados</p> aka getByText('Gestiona apuestas,')
    2) <button class="px-6 py-3 font-semibold text-sm transition border-b-2 border-blue-600 text-blue-600">Participantes</button> aka getByRole('button', { name: 'Participantes' })
    3) <h3 class="text-xl font-bold text-gray-900 mb-6">Participantes (3)</h3> aka getByRole('heading', { name: 'Participantes (3)' })

Call log:
    - checking visibility of locator('text=Participantes')

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
            - button "Participantes" [active] [ref=e23]
            - button "Acciones" [ref=e24]
          - generic [ref=e26]:
            - heading "Participantes (3)" [level=3] [ref=e27]
            - table [ref=e29]:
              - rowgroup [ref=e30]:
                - row "Nombre Email Índice" [ref=e31]:
                  - columnheader "Nombre" [ref=e32]
                  - columnheader "Email" [ref=e33]
                  - columnheader "Índice" [ref=e34]
              - rowgroup [ref=e35]:
                - row "Juan Pérez juan@example.com 1" [ref=e36]:
                  - cell "Juan Pérez" [ref=e37]
                  - cell "juan@example.com" [ref=e38]
                  - cell "1" [ref=e39]
                - row "María García maria@example.com 2" [ref=e40]:
                  - cell "María García" [ref=e41]
                  - cell "maria@example.com" [ref=e42]
                  - cell "2" [ref=e43]
                - row "Carlos López carlos@example.com 3" [ref=e44]:
                  - cell "Carlos López" [ref=e45]
                  - cell "carlos@example.com" [ref=e46]
                  - cell "3" [ref=e47]
  - button "Open Next.js Dev Tools" [ref=e53] [cursor=pointer]:
    - img [ref=e54]
  - alert [ref=e57]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { seedTestData } from '../helpers.js';
  3   | 
  4   | test.describe('Panel Admin', () => {
  5   |   test.beforeEach(async ({ page, context }) => {
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
  22  |   });
  23  | 
  24  |   test('debe permitir crear apuesta', async ({ page }) => {
  25  |     await page.goto('/admin');
  26  | 
  27  |     // Esperar a que cargue el formulario
  28  |     await page.waitForSelector('input[name="equipo1"]', { timeout: 5000 });
  29  | 
  30  |     // Formulario de crear apuesta
  31  |     await page.fill('input[name="equipo1"]', 'Chelsea');
  32  |     await page.fill('input[name="equipo2"]', 'Arsenal');
  33  |     await page.fill('input[name="valor"]', '200');
  34  | 
  35  |     // Click crear
  36  |     await page.click('button:has-text("Crear Apuesta")');
  37  | 
  38  |     // Esperar confirmación
  39  |     await page.waitForTimeout(2000);
  40  | 
  41  |     // Debe aparecer en tabla
  42  |     await expect(page.locator('text=Chelsea')).toBeVisible({ timeout: 5000 });
  43  |   });
  44  | 
  45  |   test('debe permitir establecer resultado', async ({ page }) => {
  46  |     await page.goto('/admin');
  47  | 
  48  |     // Esperar a que cargue el admin y haya apuestas
  49  |     await page.waitForSelector('button:has-text("Acciones")', { timeout: 5000 });
  50  | 
  51  |     // Click en tab Acciones
  52  |     await page.click('button:has-text("Acciones")');
  53  | 
  54  |     // Esperar a que aparezcan los selects con opciones
  55  |     await page.locator('select').first().waitFor({ timeout: 5000 });
  56  | 
  57  |     // Verificar que hay opciones para seleccionar (más de 1 porque hay un option vacío)
  58  |     const selectCount = await page.locator('select:first-of-type > option').count();
  59  |     if (selectCount <= 1) {
  60  |       // Si no hay apuestas, saltar el test
  61  |       test.skip();
  62  |     }
  63  | 
  64  |     // Seleccionar apuesta
  65  |     const selects = page.locator('select');
  66  |     const selectsCount = await selects.count();
  67  |     if (selectsCount < 2) {
  68  |       test.skip();
  69  |     }
  70  | 
  71  |     await selects.first().selectOption({ index: 1 }); // Seleccionar primera apuesta disponible
  72  | 
  73  |     // Esperar a que se seleccione
  74  |     await page.waitForTimeout(500);
  75  | 
  76  |     // Seleccionar resultado (segundo select)
  77  |     await selects.nth(1).selectOption('equipo1');
  78  | 
  79  |     // Click establecer resultado
  80  |     await page.click('button:has-text("Establecer resultado")');
  81  | 
  82  |     // Esperar confirmación
  83  |     await page.waitForTimeout(1000);
  84  |   });
  85  | 
  86  |   test('debe mostrar lista de participantes', async ({ page }) => {
  87  |     await page.goto('/admin');
  88  | 
  89  |     // Esperar a que cargue el admin
  90  |     await page.waitForSelector('button:has-text("Participantes")', { timeout: 5000 });
  91  | 
  92  |     // Click en tab Participantes
  93  |     await page.click('button:has-text("Participantes")');
  94  | 
  95  |     // Esperar a que aparezca la tabla (con o sin filas)
  96  |     await page.locator('text=Participantes').first().waitFor({ timeout: 5000 });
  97  | 
  98  |     // Debe mostrar tabla
> 99  |     expect(await page.locator('text=Participantes').isVisible()).toBeTruthy();
      |                                                     ^ Error: locator.isVisible: Error: strict mode violation: locator('text=Participantes') resolved to 3 elements:
  100 |   });
  101 | 
  102 |   test('debe permitir resetear colecciones', async ({ page }) => {
  103 |     await page.goto('/admin');
  104 | 
  105 |     // Esperar a que cargue el admin
  106 |     await page.waitForSelector('button:has-text("Acciones")', { timeout: 5000 });
  107 | 
  108 |     // Click en tab Acciones
  109 |     await page.click('button:has-text("Acciones")');
  110 | 
  111 |     // Esperar a que aparezcan los botones de reset
  112 |     await page.waitForSelector('button:has-text("Resetear apuestas")', { timeout: 5000 });
  113 | 
  114 |     // Configurar listener para dialog antes de hacer click
  115 |     page.once('dialog', (dialog) => {
  116 |       expect(dialog.type()).toBe('confirm');
  117 |       dialog.accept();
  118 |     });
  119 | 
  120 |     // Click resetear apuestas
  121 |     await page.click('button:has-text("Resetear apuestas")');
  122 | 
  123 |     // Esperar confirmación de reset (alerta o mensaje en página)
  124 |     await page.waitForTimeout(1000);
  125 |   });
  126 | });
  127 | 
```