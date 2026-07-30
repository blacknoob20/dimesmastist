# AGENTS.md — Dimesmastist

> Catálogo numismático personal. Monorepo con frontend Preact + backend Go.
> Stack frontend: Preact 10 + @preact/signals + wouter-preact + TypeScript + TailwindCSS 4
> Stack backend: Go 1.24 + Fiber v2 + GORM + glebarez/sqlite (pure-Go) + validator/v10
> Infra: Docker Compose (nginx + backend + react + playwright) con pnpm v11.

## PROTOCOLO OBLIGATORIO con Engram (memoria persistente)

Antes de tocar cualquier archivo, ejecuta en orden:
1. `mem_current_project` — confirma el proyecto (`dimesmastist`).
2. `mem_context` — recupera sesiones y observaciones recientes.
3. `mem_search` con keywords de la tarea.
4. Si hay hit relevante, `mem_get_observation` por ID antes de re-leer código.

## Arquitectura Monorepo

```
dimesmastist/
├── docker-compose.yml          ← 4 servicios
├── nginx/nginx.conf            ← reverse proxy + WebSocket HMR
├── frontend/                   ← Preact SPA
│   ├── src/api/coins.ts        ← API client fetch
│   ├── src/state/coinForm.ts   ← submitForm real con API
│   ├── src/state/coins.ts      ← fetchCoins desde API
│   ├── Dockerfile              ← node:alpine + pnpm
│   └── .env                    ← VITE_API_URL=/api/v1
├── backend/                    ← Go API
│   ├── cmd/api/main.go         ← entrypoint (newApp + main)
│   ├── internal/domain/        ← Coin entity, interfaces, errors
│   ├── internal/application/   ← CoinService (use cases)
│   ├── internal/infrastructure/
│   │   ├── persistence/        ← GormCoinRepository + SCD2
│   │   └── storage/            ← LocalDisk + stubs + factory
│   ├── internal/interfaces/http/ ← Fiber handlers + DTOs
│   ├── tests/                  ← persistence cert + SCD2
│   └── Dockerfile              ← golang:1.24-alpine
├── scripts/test-all.sh         ← coverage gate 90% + e2e
└── tests/playwright/           ← e2e tests
```

## Backend Go — arquitectura hexagonal

### Modelo SCD2 (Slowly Changing Dimensions Type 2)
- Cada UPDATE crea una nueva versión (cierra la anterior + inserta nueva en transacción).
- Cada DELETE cierra la versión actual (tombstone, sin nueva versión).
- `IsCurrent=true` para la versión activa, `ValidTo` seteada al cerrar.
- `List()` por defecto retorna solo `IsCurrent=true`. `?all=true` retorna historial.
- `GetHistory()` retorna todas las versiones ordenadas por versión DESC.

### Strategy Pattern para fotos
- `PhotoStorageStrategy` interface en `domain/storage.go`
- `LocalDiskStrategy`: funcional, guarda en PHOTO_DIR, UUID como ref.
- Stubs compilables: `GoogleDriveStrategy`, `OneDriveStrategy`, `S3Strategy` (retornan ErrNotImplemented).
- `factory.go` selecciona por `PHOTO_PROVIDER` env var (default: local).

### API REST — `/api/v1`
- `POST /coins` — crear moneda (SCD2 v1)
- `GET /coins` — listar paginado (`?page&limit&condition&country&q&all`)
- `GET /coins/:id` — detalle versión actual
- `PUT /coins/:id` — actualizar (nueva versión SCD2)
- `DELETE /coins/:id` — cerrar versión (tombstone)
- `GET /coins/:id/history` — todas las versiones
- `POST /coins/:id/photos` — multipart upload (`file`, `face=anverso|reverso`)
- `GET /photos/:provider/:ref` — servir foto desde strategy activa
- `GET /health` — healthcheck

### Convenciones Go
- Named exports con arrow functions para componentes TSX.
- `package <folder>` — tests en mismo paquete para coverage real.
- TDD estricto: RED → GREEN → refactor por cada unidad.
- `testify/assert` + `testify/require` para assertions.
- Commits en español con conventional commits.

## Frontend

- Frontend movido a `frontend/` via git mv (preserva historial).
- `src/api/coins.ts`: cliente fetch tipado contra `/api/v1`.
- `src/state/coinForm.ts`: `submitForm()` async, llama API real + upload fotos.
- `src/state/coins.ts`: `fetchCoins()` desde API, fallback a localStorage.
- `CoinFormSectionPhotos.tsx`: usa objectURL para preview, submitForm convierte a File.

## Restricción: React 17→Preact 10

- Entrypoint usa Preact (`import { render } from 'preact'`), NO `createRoot`.
- NO uses: `useId`, `useTransition`, `useDeferredValue`, Suspense para data fetching.
- Signals (`@preact/signals`) para estado reactivo, NO useState/useReducer.

## Theming — estética museo/oro

- `darkMode: 'media'` en tailwind config → tema automático según SO.
- CSS vars en `src/App.css` (`:root{}` + `@media (prefers-color-scheme: dark)`).
- Bridge `brand.*` para Tailwind: `bg-brand-*`/`text-brand-*`.
- NO uses `bg-white`/`text-gray-700` — rompen dark mode.

## Modelo numismático

- ~23 campos en form: country, denomination, valorFacial, year, conmemorativa, emitidaPor,
  metal, peso, diametro, espesor, forma, orientacion, canto, ceca, km, serie,
  anversoImg, reversoImg, condition, descripcion, notas, procedencia, precioCompra,
  fechaAdquisicion, etiquetas[].
- `condition` ∈ {UNC, XF, VF, F, VG, G, P} con color asociado.
- `km` = código Krause-Mishler.

## Entorno Docker

- 4 servicios: nginx(:5176), backend(:8080 interno), react(:80 interno), playwright(test profile).
- Backend NO expuesto al host — solo accesible vía nginx.
- `VITE_API_URL=/api/v1` (relativo) — nginx enruta.
- Healthchecks: nginx → wget /, backend → wget /api/v1/health, react → node http.get.
- `scripts/test-all.sh`: go test con coverage → gate 90% → docker build → playwright e2e.

## Cuándo actualizar Engram

Guarda (`mem_save`) SOLO cuando ocurra:
- Cambio de estructura de rutas (frontend o API).
- Cambio del modelo numismático (campos, condición, metal).
- Cambio de SCD2 o repository layer.
- Nuevo provider de storage (activar stub).
- Gotcha de Docker/Go/GORM/nginx.

Topic keys: `architecture/backend-api`, `architecture/monorepo`,
`architecture/theming`, `domain/coin-model`, `constraints/react-17`.
