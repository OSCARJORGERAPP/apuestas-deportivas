# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: reset.spec.js >> Reseteos >> debe resetear desde panel admin
- Location: tests\e2e\reset.spec.js:111:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=reseteado')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=reseteado')

```

```yaml
- navigation:
  - link "🎯 Apuestas":
    - /url: /
  - link "Admin":
    - /url: /admin
  - link "Dashboard":
    - /url: /app
  - button "Logout"
- navigation:
  - link "⚽ Apuestas":
    - /url: /admin
  - button "☰"
- main:
  - heading "🔧 Panel Admin" [level=1]
  - paragraph: Gestiona apuestas, participantes y resultados
  - button "Apuestas"
  - button "Participantes"
  - button "Acciones"
  - heading "Establecer resultado" [level=3]
  - text: Apuesta
  - combobox:
    - option "— Elige una apuesta —" [selected]
  - text: Resultado
  - combobox:
    - option "Equipo 1" [selected]
    - option "Empate"
    - option "Equipo 2"
  - button "Establecer resultado"
  - heading "⚠️ Reseteos" [level=3]
  - paragraph: Acciones destructivas. No se pueden deshacer.
  - button "Resetear apuestas"
  - button "Resetear participantes"
  - button "Resetear valores"
  - button "Resetear ganadores"
- button "Open Next.js Dev Tools":
  - img
- alert
```

# Test source

```ts
  24  |   test('debe resetear apuestas vía API', async ({ page }) => {
  25  |     // Asegurar que hay datos en BD
  26  |     await seedTestData();
  27  | 
  28  |     // Contar apuestas antes
  29  |     const antesRes = await page.evaluate(() =>
  30  |       fetch('/api/apuestas').then(r => r.json())
  31  |     );
  32  | 
  33  |     const countAntes = antesRes.length;
  34  |     expect(countAntes).toBeGreaterThan(0);
  35  | 
  36  |     // Resetear vía API
  37  |     await page.evaluate(() =>
  38  |       fetch('/api/apuestas?reset=true', { method: 'DELETE' })
  39  |     );
  40  | 
  41  |     // Esperar un poco
  42  |     await page.waitForTimeout(500);
  43  | 
  44  |     // Contar apuestas después
  45  |     const despuesRes = await page.evaluate(() =>
  46  |       fetch('/api/apuestas').then(r => r.json())
  47  |     );
  48  | 
  49  |     expect(despuesRes.length).toBe(0);
  50  |   });
  51  | 
  52  |   test('debe resetear participantes vía API', async ({ page }) => {
  53  |     // Contar participantes antes
  54  |     const antesRes = await page.evaluate(() =>
  55  |       fetch('/api/participantes').then(r => r.json())
  56  |     );
  57  | 
  58  |     const countAntes = Array.isArray(antesRes) ? antesRes.length : 0;
  59  |     expect(countAntes).toBeGreaterThan(0);
  60  | 
  61  |     // Resetear
  62  |     await page.evaluate(() =>
  63  |       fetch('/api/participantes?reset=true', { method: 'DELETE' })
  64  |     );
  65  | 
  66  |     // Esperar un poco
  67  |     await page.waitForTimeout(500);
  68  | 
  69  |     // Contar después
  70  |     const despuesRes = await page.evaluate(() =>
  71  |       fetch('/api/participantes').then(r => r.json())
  72  |     );
  73  | 
  74  |     expect(Array.isArray(despuesRes) ? despuesRes.length : 0).toBe(0);
  75  |   });
  76  | 
  77  |   test('debe resetear valores apostados vía API', async ({ page }) => {
  78  |     // Resetear
  79  |     await page.evaluate(() =>
  80  |       fetch('/api/valores?reset=true', { method: 'DELETE' })
  81  |     );
  82  | 
  83  |     // Esperar un poco
  84  |     await page.waitForTimeout(500);
  85  | 
  86  |     // Contar después
  87  |     const despuesRes = await page.evaluate(() =>
  88  |       fetch('/api/valores').then(r => r.json())
  89  |     );
  90  | 
  91  |     expect(Array.isArray(despuesRes) ? despuesRes.length : 0).toBe(0);
  92  |   });
  93  | 
  94  |   test('debe resetear ganadores vía API', async ({ page }) => {
  95  |     // Resetear
  96  |     await page.evaluate(() =>
  97  |       fetch('/api/ganadores?reset=true', { method: 'DELETE' })
  98  |     );
  99  | 
  100 |     // Esperar un poco
  101 |     await page.waitForTimeout(500);
  102 | 
  103 |     // Contar después
  104 |     const despuesRes = await page.evaluate(() =>
  105 |       fetch('/api/ganadores').then(r => r.json())
  106 |     );
  107 | 
  108 |     expect(Array.isArray(despuesRes) ? despuesRes.length : 0).toBe(0);
  109 |   });
  110 | 
  111 |   test('debe resetear desde panel admin', async ({ page }) => {
  112 |     await page.goto('/admin');
  113 |     await page.click('button:has-text("Acciones")');
  114 | 
  115 |     // Click resetear apuestas
  116 |     await page.click('button:has-text("Resetear apuestas")');
  117 | 
  118 |     // Aceptar confirmación
  119 |     page.once('dialog', (dialog) => {
  120 |       dialog.accept();
  121 |     });
  122 | 
  123 |     // Debe haber alerta de éxito
> 124 |     await expect(page.locator('text=reseteado')).toBeVisible({ timeout: 5000 });
      |                                                  ^ Error: expect(locator).toBeVisible() failed
  125 |   });
  126 | });
  127 | 
```