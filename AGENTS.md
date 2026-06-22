# AGENTS.md — Guía operativa del SaaS de apuestas deportivas

> Especificación del producto: ver `PROMPT.md`. Este archivo es el "cómo".

## 🚀 Instalación (paso a paso)

```bash
# 1. Dependencias → genera package-lock.json (usar `npm ci` en CI)
npm install

# 2. Variables de entorno
cp .env.example .env
# Configurar:
# MONGODB_URI=mongodb://localhost:27017/apuestas
# REDSYS_MERCHANT_CODE=tu_codigo_prueba
# REDSYS_TERMINAL_ID=tu_terminal_prueba
# REDSYS_SECRET_KEY=tu_secret_prueba
# MAILHOG_HOST=localhost
# MAILHOG_PORT=1025
# APP_URL=http://localhost:3000
```

## 🗄️ MongoDB (arranque local)

```bash
# Opción Docker (recomendada para dev)
docker run -d --name apuestas-mongo -p 27017:27017 mongo:7

# Verificar conexión
mongosh "mongodb://localhost:27017"

# Crear índices (ejecutar desde la app o manually)
npm run db:setup
```

**Seed de datos** (para dev/test):
```bash
npm run seed          # inserta participantes, apuestas y datos de prueba
npm run seed:reset    # limpia colecciones y re-siembra
```

El seed debe generar:
- Participantes de ejemplo (min 5)
- Apuestas de ejemplo con valores definidos
- Índices en colecciones (apuestas, participantes, valores_apostados, ganadores)

## ▶️ Arranque del sistema

```bash
npm run dev     # desarrollo (nodemon, hot-reload)
npm run build   # generar build de producción
npm start       # ejecutar build (producción)
```

URLs:
- App: `http://localhost:3000`
- Landing page: `/`
- API: `/api`
- Admin panel: `/admin` (acceso solo para administrador)
- MailHog (revisar emails): `http://localhost:8025`

## ✅ Tests E2E (Playwright)

```bash
npm test                    # suite completa e2e
npm run test:watch         # modo watch (dev)
npm run test:ui            # interfaz gráfica de Playwright
npm run test:debug         # modo debug
```

**Política de tests**:
- Cada requisito funcional (RF) del PROMPT.md tiene ≥1 test e2e.
- Flujos críticos (auth magic link, apuesta, pago REDSYS, distribución ganadores) deben tener cobertura.
- PR sin tests pasando no se mergea.

**Escenarios e2e obligatorios**:
- [ ] Participante se autentica con magic link
- [ ] Participante ve apuestas disponibles
- [ ] Participante apuesta y realiza pago REDSYS (modo prueba)
- [ ] Administrador crea nueva apuesta
- [ ] Administrador define valores de apuesta
- [ ] Distribución de ganancias se calcula correctamente
- [ ] Consultas de participantes, valores apostados, ganadores funcionan

## 🧱 Estructura del proyecto

```
apuestas-deportivas/
├── .claude/
│   └── skills/spec-docs/
│       ├── SKILL.md
│       └── PROMPT.md
├── src/
│   ├── pages/              # Next.js / frontend pages
│   │   ├── index.jsx       # landing page
│   │   ├── app.jsx         # app principal
│   │   └── admin.jsx       # admin panel
│   ├── api/                # backend API routes
│   │   ├── auth/           # magic link auth
│   │   ├── apuestas/       # CRUD apuestas
│   │   ├── participantes/  # CRUD participantes
│   │   ├── valores/        # CRUD valores apostados
│   │   ├── ganadores/      # cálculo y consulta ganadores
│   │   └── pagos/          # integración REDSYS
│   ├── lib/                # utilidades y lógica compartida
│   │   ├── db.js           # conexión MongoDB (driver nativo)
│   │   ├── redsys.js       # cliente REDSYS
│   │   ├── mail.js         # cliente MailHog
│   │   └── auth.js         # lógica magic link
│   ├── components/         # componentes React
│   │   ├── ApuestaCard.jsx
│   │   ├── ApuestaForm.jsx
│   │   ├── AdminPanel.jsx
│   │   └── ...
│   └── styles/             # CSS/Tailwind (tonos grises, negros, blancos)
├── scripts/
│   ├── seed.js             # aprisionamiento de datos de ejemplo
│   └── db-setup.js         # creación de índices
├── tests/
│   └── e2e/                # tests Playwright
│       ├── auth.spec.js
│       ├── apuestas.spec.js
│       ├── pagos.spec.js
│       └── ganadores.spec.js
├── .env.example            # plantilla variables
├── .gitlab-ci.yml          # pipeline CI/CD
├── package.json
├── package-lock.json
├── README.md
├── QUICKSTART.md
├── RETROSPECTIVA.md
└── REFLEXION-FINAL.md
```

## 🧭 Convenciones

**Stack**:
- Backend: Node.js + Express (o Next.js API routes)
- Frontend: React (Next.js)
- DB: MongoDB nativo (driver oficial, sin Mongoose)
- Auth: Magic Link (nodemailer + MailHog en dev)
- Pagos: REDSYS (XML/SOAP, modo prueba)
- Tests: Playwright e2e
- CI/CD: GitLab CI

**Naming**:
- Colecciones MongoDB: `apuestas`, `participantes`, `valores_apostados`, `ganadores` (snake_case, singular o plural según contexto)
- Endpoints API: `/api/apuestas`, `/api/participantes`, `/api/valores`, `/api/ganadores`, `/api/pagos`, `/api/auth`
- Componentes React: `PascalCase` (e.g., `ApuestaCard.jsx`)
- Funciones/utils: `camelCase`
- Constantes: `UPPER_SNAKE_CASE`

**Commits**:
- Formato: `[type](scope): descripcion`
- Types: `feat`, `fix`, `test`, `docs`, `refactor`, `chore`
- Ejemplo: `feat(apuestas): agregar endpoint para crear apuesta`

**Manejo de errores**:
- Errores de BD: capturar y loguear, retornar mensaje amigable al cliente
- Errores de REDSYS: reintentar 2 veces, si falla registrar incidente
- Errores de auth: no revelar si usuario existe o no

**Acceso a MongoDB**:
```javascript
// Usar el driver oficial nativo
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI);

// Operaciones típicas
await client.db('apuestas').collection('apuestas').insertOne({...});
await client.db('apuestas').collection('ganadores').find({...}).toArray();
```

## 📊 Métricas (cómo recolectarlas)

Endpoints para medir performance:

```bash
# Latencia de endpoints clave
curl -w "@curl-format.txt" http://localhost:3000/api/apuestas

# Herramienta de carga (concurrencia)
npm install -g artillery
artillery quick --count 100 --num 1000 http://localhost:3000/api/apuestas

# Cobertura de tests
npm run test:cov
```

**Dashboards a revisar (producción)**:
- Latencias p95/p99 de endpoints `/api/apuestas`, `/api/pagos`, `/api/ganadores`
- Tiempos de respuesta de MongoDB (find, insert, update por operación)
- Tasa de error (errores de REDSYS, fallos de pago, inconsistencias)
- Usuarios concurrentes soportados
- Tamaño promedio de documentos (apuesta, participante, valor apostado)

**Dónde registrar**: logs → ELK / DataDog / CloudWatch (según entorno)

## 🌐 Deployment público

Pasos concretos para subir a producción:

**Prerequisitos**:
- Base de datos MongoDB en producción aprovisionada
- Cuenta REDSYS con credenciales reales (no prueba)
- Dominio SSL configurado
- Servidor/contenedor aprovisionado (AWS, GCP, VPS)
- Secretos en gestor seguro (AWS Secrets Manager, HashiCorp Vault, etc.)

**Variables de entorno en producción**:
```bash
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/apuestas
REDSYS_MERCHANT_CODE=codigo_produccion
REDSYS_TERMINAL_ID=terminal_produccion
REDSYS_SECRET_KEY=secret_produccion
MAILHOG_HOST=smtp.sendgrid.net  # o proveedor real
MAILHOG_PORT=587
APP_URL=https://tudominio.com
NODE_ENV=production
```

**Deployment manual**:
```bash
npm ci                    # install from lock (no updates)
npm run build
npm start                 # esperando en puerto 3000
```

**Pipeline automático (.gitlab-ci.yml)**:
```yaml
stages:
  - install
  - lint
  - test
  - build
  - deploy

install:
  stage: install
  script:
    - npm ci

lint:
  stage: lint
  script:
    - npm run lint

test:
  stage: test
  script:
    - npm run test          # Playwright e2e

build:
  stage: build
  script:
    - npm run build

deploy:production:
  stage: deploy
  script:
    - npm ci
    - npm run build
    - # script deploy personalizado (docker, rsync, etc.)
  only:
    - main
```

**Health check post-deploy**:
```bash
curl https://tudominio.com/health
# Debe retornar 200 con { status: "ok" }
```

**Rollback**:
```bash
git revert <commit>
git push
# Pipeline se ejecuta automáticamente
```

**Monitoreo post-deploy**:
- Revisar dashboard de métricas
- Alertas configuradas para: latencia > X ms, error rate > Y%, downtime
- Test de humo manual: acceder a landing, autentica con magic link, crear apuesta

## 📒 Documentación viva (obligación del agente)

Tras cada cambio relevante:
- Si cambia el arranque → actualizar README.md + QUICKSTART.md
- Si hay incidentes/problemas resueltos → agregar a RETROSPECTIVA.md (problema → causa → solución)
- Si cambian dependencias → actualizar package-lock.json + documentar en AGENTS.md
- Antes de cerrar el proyecto → redactar REFLEXION-FINAL.md (qué se logró, decisiones, deuda técnica, aprendizajes)
