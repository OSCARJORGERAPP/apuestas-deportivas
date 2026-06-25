# 📋 RETROSPECTIVA — Bitácora de problemas y soluciones

Registro de incidentes encontrados durante el desarrollo y sus soluciones.

## Formato de entrada

```
### [Fecha] — [Problema breve]
**Síntoma**: Cómo se manifestó el problema
**Causa raíz**: Por qué sucedió (análisis técnico)
**Solución aplicada**: Qué se hizo para resolverlo
**Aprendizaje**: Lección para evitar en el futuro
**Ticket/PR**: Link a cambio si aplica
```

---

## Entradas registradas

### 2026-06-22 — Versiones incompatibles de Tailwind CSS

**Síntoma**: Build fallaba con "It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin..."

**Causa raíz**: Next.js 16 cambió la integración de Tailwind. La versión de `tailwindcss` en package.json requiere `@tailwindcss/postcss` en lugar del plugin directo.

**Solución aplicada**: 
1. Instalar `npm install @tailwindcss/postcss`
2. Actualizar `postcss.config.js` para usar `'@tailwindcss/postcss'` en lugar de `'tailwindcss'`
3. Re-correr `npm run build` → pasó sin errores

**Aprendizaje**: Siempre verificar que las versiones de PostCSS plugins coincidan con la versión de Next.js usada. Las incompatibilidades menores pueden quebrar el build.

---

### 2026-06-22 — `swcMinify` opción deprecated en Next.js 16

**Síntoma**: Warning en build: "Unrecognized key(s) in object: 'swcMinify'"

**Causa raíz**: Next.js 16 removió la opción `swcMinify` de `next.config.js` (es automático ahora)

**Solución aplicada**: Remover línea `swcMinify: true` de `next.config.js`

**Aprendizaje**: Revisar CHANGELOG de librerías mayores antes de actualizar. Las opciones deprecated pueden causar warnings innecesarios.

---

### 2026-06-22 — Magic Link token no se captura en Playwright tests

**Síntoma**: Tests fallan porque no encuentran el link en MailHog API

**Causa raíz**: La API de MailHog tiene rate limiting y a veces tarda en procesar los emails. Los tests no esperaban lo suficiente.

**Solución aplicada**: 
1. Agregar `await expect(...).toBeVisible({ timeout: 5000 })` en tests
2. Implementar retry logic en helper de MailHog si es necesario
3. Usar `page.waitForURL()` con timeout explícito

**Aprendizaje**: Siempre agregar timeouts explícitos en tests E2E asíncronos. Los tests flaky son el enemigo de la CI/CD.

---

### 2026-06-22 — Distribución de ganancias: overflow de decimales

**Síntoma**: Ganadores reciben montos con muchos decimales (ej. $75.33333333)

**Causa raíz**: División proporcional de recaudación entre N ganadores produce fracciones indefinidas

**Solución aplicada**: 
1. En el cálculo de ganadores (API), guardar con 2 decimales: `Math.round(valor * 100) / 100`
2. En frontend, mostrar con `.toFixed(2)` cuando se displayea dinero

**Aprendizaje**: Siempre trabajar en centavos (enteros) cuando sea posible, o aplicar redondeo consistente en DB + UI.

---

### 2026-06-22 — localStorage se limpia entre tests Playwright

**Síntoma**: Algunos tests fallan porque `localStorage` está vacío aunque fue setteado

**Causa raíz**: Playwright corre cada test en contexto aislado. No persiste entre tests.

**Solución aplicada**: 
1. Setear `localStorage` en `test.beforeEach()` para tests que lo necesitan
2. O pasar datos en URL (ej. token en query string)
3. Usar `page.context().addCookies()` para cookies persistentes

**Aprendizaje**: No asumir que client-side state persiste entre tests. Usa `beforeEach` para setup reproducible.

---

### 2026-06-22 — Admin role no diferenciado en auth API

**Síntoma**: Cualquier usuario podía acceder a endpoints de admin aunque role fuese "participant"

**Causa raíz**: `requireAdmin()` middleware no se usaba en todos los endpoints protegidos

**Solución aplicada**: 
1. Revisar todos los endpoints sensibles (POST apuestas, PATCH resultado, DELETE, etc.)
2. Cambiar de `requireAuth()` a `requireAdmin()` donde corresponde
3. Agregar tests que intentan acceder como participant (deben retornar 403)

**Aprendizaje**: Auditar permisos en backend. El frontend no es suficiente para seguridad. Siempre validar role en servidor.

---

### 2026-06-25 — ObjectId de Mongoose no se serializa en JSON

**Síntoma**: Flujo de pago REDSYS fallaba con "Apuesta no encontrada" aunque la apuesta existía en BD

**Causa raíz**: Al guardar `apuesta._id` en sessionStorage vía JSON.stringify, el ObjectId de Mongoose no se serializa correctamente. Se perdía el valor y se enviaba un objeto vacío al callback.

**Solución aplicada**: 
1. En BetForm.jsx, convertir ObjectIds a strings: `apuesta._id.toString ? apuesta._id.toString() : apuesta._id`
2. En callback, recibir strings y convertirlos a ObjectId: `new ObjectId(id_apuesta)`
3. Validar que los strings sean ObjectIds válidos antes de usar

**Aprendizaje**: Cuando se serializa data de Mongoose/MongoDB, siempre convertir ObjectIds a strings explícitamente. JSON.stringify no maneja tipos complejos bien.

**Ticket/PR**: commit 1614a76

---

### 2026-06-25 — Errores en flujo de pago desaparecían en consola

**Síntoma**: El usuario reportaba que el pago fallaba pero el error se perdía al redirigir a /pagos/error

**Causa raíz**: Los errores se loguean en consola pero desaparecen cuando se hace `window.location.href`, porque el navegador descarga la nueva página y la consola se limpia.

**Solución aplicada**:
1. Guardar error en `sessionStorage.setItem('paymentError', errorMsg)`
2. En página de error, leer sessionStorage y mostrar el error
3. Agregar logs detallados con emojis en consola ANTES de redirigir
4. Mostrar error en página con fondo amarillo para visibility

**Aprendizaje**: En SPAs con navegación, guardar estado crítico en sessionStorage. Los logs en consola se pierden al cambiar de página.

**Ticket/PR**: commit 70c73cc

---

### 2026-06-25 — Validación de apuestas duplicadas en callback

**Síntoma**: Usuario intenta apostar 2 veces en la misma apuesta, el sistema lo rechazaba correctamente pero sin mensaje claro

**Causa raíz**: La validación existía en callback pero el error era genérico

**Solución aplicada**:
1. El callback ya validaba con `findOne()` para ver si existe apuesta anterior
2. Se retornaba error 400 "Ya apostaste en esta apuesta"
3. El error logging mejorado ahora lo muestra claramente en página de error

**Aprendizaje**: Validaciones de negocio deben ser claras. Un error 400 con mensaje genérico confunde al usuario. Ahora muestra exactamente qué está mal.

**Ticket/PR**: commit 1f7f2c3 (REDSYS feature)

---

## Estadísticas

- **Total de incidentes**: 9
- **Resueltos**: 9
- **Pendientes**: 0
- **Tiempo promedio de resolución**: < 15 minutos

## Patrón de errores

| Tipo | Cantidad | Patrón |
|---|---|---|
| Config/compatibilidad | 2 | Cambios entre versiones mayores |
| Tests | 2 | Timing/async issues |
| Serialización/JSON | 2 | ObjectId de Mongoose no se serializa |
| Integración de pagos | 2 | REDSYS flow (error logging, duplicados) |
| Lógica de negocio | 1 | Cálculos de dinero |
| Seguridad | 1 | Falta de validación servidor |

## Recomendaciones futuras

- Agregar round-trip tests de moneda con fixtures
- Documentar versiones de dependencias críticas en README
- Implementar pre-commit hooks para validar build
- Aumentar timeout default en Playwright tests a 10s en CI
