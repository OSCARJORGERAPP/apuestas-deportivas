# 🚀 QUICKSTART — De cero a corriendo

Tiempo estimado: **5 minutos**

## Requisitos previos

- Node.js >= 18
- npm >= 9
- Docker (para MongoDB y MailHog)
- Terminal/PowerShell

## ⏱️ Paso 1: Clonar e instalar (1 min)

```bash
# Navegar al proyecto (o clonar)
cd apuestas-deportivas

# Instalar dependencias
npm install

# Copiar template de variables (si no existe)
cp .env.example .env 2>/dev/null || echo ".env ya existe"
# (Ya tiene valores por defecto para dev local)
```

## ⏱️ Paso 2: Arrancar servicios (2 min)

**Terminal 1 — MongoDB:**
```bash
docker run -d --name apuestas-mongo -p 27017:27017 mongo:7
```

**Terminal 2 — MailHog:**
```bash
docker run -d --name apuestas-mailhog -p 1025:1025 -p 8025:8025 mailhog/mailhog
```

**Verificar:**
```bash
# MongoDB: debería conectar sin errores
mongosh "mongodb://localhost:27017"

# MailHog UI: http://localhost:8025
```

## ⏱️ Paso 3: Setup de Base de Datos (1 min)

```bash
# Crear índices en MongoDB
npm run db:setup

# Poblar datos de ejemplo (5 participantes, 3 apuestas)
npm run seed
```

Verificar en MongoDB:
```bash
mongosh
> show dbs
> use apuestas
> db.apuestas.find().pretty()
> db.participantes.count()
```

## ⏱️ Paso 4: Arrancar la app (1 min)

```bash
npm run dev
```

Verás:
```
▲ Next.js 16.2.9
✓ Compiled successfully
- Local:        http://localhost:3000
```

## 🎯 Prueba rápida (flujo completo)

### Como **Participante:**

1. Abre `http://localhost:3000` (landing)
2. Click en **"Comenzar a Apostar"** o navega a `/login`
3. Ingresa email: `test@example.com`
4. Click **"Enviar magic link"** → espera 2 segundos
5. Abre MailHog: `http://localhost:8025`
6. Busca el email y copia el link de verificación
7. Pega el link en el navegador
8. ¡Eres participante! Estás en `/app`
9. Haz click en una apuesta (ej. "Real Madrid vs Barcelona")
10. Selecciona equipo, ingresa monto (ej. $50)
11. Click **"Apostar"** → verás tu apuesta en la tabla

### Como **Admin:**

1. Abre DevTools (F12) → Console
2. Ejecuta:
   ```javascript
   localStorage.setItem('user', JSON.stringify({
     id: '507f1f77bcf86cd799439012',
     email: 'admin@test.com',
     role: 'admin'
   }))
   ```
3. **⚠️ IMPORTANTE:** Presiona `Ctrl+R` o `Cmd+R` para **RECARGAR la página**
4. Cierra DevTools (F12)
5. Click **"Admin"** en navbar (ahora visible) - deberías ver el enlace Admin
6. **Tab Apuestas:** crea nueva apuesta
7. **Tab Acciones:** selecciona una apuesta y establece resultado (ej. "equipo1 ganó")
8. ¡Los ganadores se calcularán automáticamente!

## 🧪 Tests

```bash
# Correr todos los tests E2E
npm test

# Interfaz gráfica (recomendado para debug)
npm run test:ui

# Modo debug con breakpoints
npm run test:debug
```

### Estado actual de tests (9/17 pasando)
✅ **Pasando:**
- Panel Admin › debe permitir crear apuesta
- Panel Admin › debe permitir resetear colecciones
- Apuestas › no debe permitir apostar en apuesta cerrada
- Auth › debe rechazar token inválido
- Auth › debe permitir logout
- Ganadores › debe mostrar ganancias en dashboard del participante
- Reseteos › debe resetear participantes vía API
- Reseteos › debe resetear valores apostados vía API
- Reseteos › debe resetear ganadores vía API

⚠️ **Problemas pendientes:**
- Tests que requieren datos en BD (apuestas, participantes) pueden fallar si se ejecutan en cierto orden
- Magic Link test requiere integración correcta con MailHog
- Algunos selectores de elementos necesitan ajustes

## 📊 Lint y Build

```bash
npm run lint      # Verificar código
npm run build     # Build para producción
npm start         # Correr build localmente
```

## 🔄 Reset completo

```bash
# Limpiar datos y re-poblar
npm run seed:reset
```

O desde panel admin (`/admin`):
1. Tab "Acciones"
2. Click "Resetear apuestas", "Resetear participantes", etc.

## 📍 URLs útiles

| URL | Descripción |
|---|---|
| `http://localhost:3000/` | Landing page |
| `http://localhost:3000/login` | Magic link request |
| `http://localhost:3000/app` | Dashboard (protegido) |
| `http://localhost:3000/admin` | Admin panel (protegido, solo admin) |
| `http://localhost:8025/` | MailHog - captura de emails |
| `http://localhost:27017/` | MongoDB (no tiene UI) |

## 🔧 Notas Importantes

### dotenv en src/lib/db.js
El archivo `src/lib/db.js` importa `dotenv` para cargar variables de entorno. Esto es necesario para los scripts de setup que se ejecutan fuera del contexto de Next.js.

### Admin Role Setup
Para acceder al panel admin, necesitas un usuario con role `admin`. El quickstart explica cómo hacerlo manualmente via localStorage en DevTools.

### Endpoints con Role-Based Access
Algunos endpoints devuelven datos diferentes según el rol del usuario:
- `/api/valores`: Admin ve todos, usuario regular solo ve los suyos
- `/api/ganadores`: Admin ve todos, usuario regular solo ve los suyos

## ⚠️ Troubleshooting

### "MongoDB connection failed"
```bash
# Verifica que MongoDB está corriendo
docker ps | grep mongo

# Si no está, reinicia:
docker stop apuestas-mongo
docker rm apuestas-mongo
docker run -d --name apuestas-mongo -p 27017:27017 mongo:7
```

### "No recibo email en MailHog"
```bash
# Verifica que MailHog está corriendo
docker ps | grep mailhog

# Accede a http://localhost:8025 en navegador
# Si está vacío, revisar logs:
docker logs apuestas-mailhog
```

### "Port already in use"
```bash
# Si puerto 3000 está ocupado:
lsof -i :3000
kill -9 <PID>

# O cambiar puerto en .env:
PORT=3001 npm run dev
```

## 🎓 Siguientes pasos

- Lee [AGENTS.md](./AGENTS.md) para referencia completa de APIs y flujos
- Lee [README.md](./README.md) para arquitectura y stack
- Lee [RETROSPECTIVA.md](./RETROSPECTIVA.md) para problemas encontrados
- Corre los tests: `npm test`

---

**¿Atascado?** Revisa los logs del navegador (F12) y del servidor dev. Los errores son descriptivos.
