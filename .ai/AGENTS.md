# AGENTS.md — Dimesmastist

> Catálogo numismático personal. Frontend React 17 SPA sin backend (datos mock).
> Stack: React 17 + React Router 6 + Vite 5 + TailwindCSS 3 + Headless UI + Heroicons,
> dentro de Docker (`node:alpine`) con pnpm v11.

## PROTOCOLO OBLIGATORIO con Engram (memoria persistente)

Antes de tocar cualquier archivo, ejecuta en orden:
1. `mem_current_project` — confirma el proyecto (`dimesmastist`).
2. `mem_context` — recupera sesiones y observaciones recientes.
3. `mem_search` con keywords de la tarea (ej. `theming`, `coin model`, `router`, `react-17`).
4. Si hay hit relevante, `mem_get_observation` por ID antes de re-leer código.

NO releas estos archivos si Engram ya tiene contexto: `src/index.jsx`,
`src/App.jsx`, `src/helpers/classNames.js`, `docker-compose.yml`, `pnpm-lock.yaml`,
`tailwind.config.js`, `postcss.config.js`, `vite.config.js`, `public/robots.txt`,
`public/favicon.ico`, `node_modules/`, `.pnpm-store/`.

Lee SIEMPRE antes de modificar (fuente de verdad que cambia): `src/App.css`,
`tailwind.config.js`, `src/routers/AppRouter.jsx`, `src/components/coin/CoinPage.jsx`,
`src/components/coin/coinConstants.js`.

## Arquitectura

- Entrypoint: `src/index.jsx` → `App.jsx` → `routers/AppRouter.jsx`.
- `AppRouter.jsx` define 3 rutas con `BrowserRouter`: `/` → `Navigate to="/home"`,
  `/home` → `CoinPage` (catálogo), `/coins` → `CoinForm` (registro).
- Layout chrome: `components/topbar/Topbar.jsx` (sticky header) + `components/navbar/Navbar.jsx`
  (links inferiores). Navbar declara 4 links pero solo 2 tienen ruta definida
  (`/home`, `/coins` no listado; `Colecciones`/`Favoritos`/`Acerca` apuntan a rutas inexistentes).
- Feature única: `components/coin/`. Sin state library, sin data fetching layer.

## Restricción crítica: React 17

NO uses: `createRoot`, `useId`, `useTransition`, `useDeferredValue`, Suspense para
data fetching, Server Components, automatic batching de eventos nativos.
El entrypoint usa `ReactDOM.render` (legacy). Ver `src/index.jsx` antes de proponer
patrones modernos.

## Theming — estética museo/oro (no obvio)

- `darkMode: 'media'` en `tailwind.config.js` → tema automático según SO, SIN toggle manual.
- Las CSS vars viven en `src/App.css` (`:root{}` light + `@media (prefers-color-scheme: dark){}`
  dark). Tailwind solo las referencia vía bridge `brand.*` (`brand-bg`, `brand-surface`,
  `brand-text`, `brand-muted`, `brand-border`, `brand-accent`, `brand-accent-hover`,
  `brand-surface-secondary`).
- Acento `#C89B3C` (oro). `font-display` = Georgia/Cambria/serif.
- Utilidades custom en `App.css`: `.coin-glow`, `.coin-glow-strong`, `.card-shadow`.
- Para colorear superficie/texto: usa clases `bg-brand-*`/`text-brand-*`.
  NO uses `bg-white`/`text-gray-700` — rompen el tema en dark mode.
- Estado de migración al tema:
  Migrados → `Topbar.jsx`, `Topbarbrand.jsx`, `Topbardropdown.jsx`, `Navbar.jsx`, `CoinPage.jsx`, `CoinForm.jsx` + todos sus sub-componentes (`CoinFormField`, `CoinFormChips`, 6 secciones, `CoinFormPreview`).

## Modelo numismático (reglas de negocio)

Constantes y mock en `src/components/coin/coinConstants.js` (compartido con CoinPage + CoinForm).
Mock de catálogo (9 monedas): `{ id, denomination, country, year, km, condition, metal }`.
Schema extendida del form (~20 campos): + valorFacial, conmemorativa, emitidaPor, peso, diametro,
espesor, forma, orientacion, canto, ceca, serie, anversoImg, reversoImg, descripcion, notas,
procedencia, precioCompra, fechaAdquisicion, etiquetas[].
- `km` = código Krause-Mishler.
- `condition` ∈ {UNC, XF, VF, F, VG, G, P} con color asociado en `CONDITION_COLORS` (`coinConstants.js`).
- No hay backend. README menciona "SQLite planificado" — NO existe. Toda data es mock.

## Código muerto conocido (no lo "arregles", evalúa eliminar)

- `src/routers/PublicRoute.jsx` — referenciado comentado en `AppRouter.jsx` (línea 6).
  Importa `prop-types` que NO está en `package.json`. Eliminable.
- `src/components/topbar/Topbarmobilemenu.jsx` — nunca importado. Usa clases `gray-700`/`gray-800`.
  Eliminable.
- `public/manifest.json` — todavía dice `Create React App Sample` (residuo CRA). Datos engañosos.

## Convenciones (verificadas)

- Componentes: `export const Comp = () => {...}` (named export, arrow function).
- Join de clases Tailwind: helper `classNames(...)` (`src/helpers/classNames.js`).
- Feature-folder: `components/<feature>/<Component>.jsx`.
- Comentarios en español. Commits en español con conventional commits
  (`feat:`, `fix:`, `chore:`, `refactor:`, `build:`).
- Naming: PascalCase componentes, camelCase helpers/configs.

## Entorno (Docker + pnpm v11)

- Contenedor único `react` (image `node:alpine`), nombre `dimes`, puerto `VITE_PORT=80`.
- `pnpm install && pnpm dev` como comando. Healthcheck contra `http://localhost:80`.
- Volúmenes: bind `$PWD/` + named volume para `.pnpm` (evita cuello macOS bind mount).
- Config build de pnpm en `pnpm-workspace.yaml` SOLO vía `allowBuilds: { esbuild: true }`.
  NO uses `onlyBuiltDependencies`, ni `package.json#pnpm`, ni `.npmrc` para eso —
  deprecados en pnpm v11 (ver memoria Engram `#33`).
- `CI=true` en docker-compose es obligatorio para evitar prompt interactivo.

## Scripts

- `pnpm dev` → Vite dev server
- `pnpm build` → Vite build producción
- `pnpm preview` → preview del build
- No hay `lint`, `test`, ni `typecheck` configurados. No asumas su existencia.

## Cuándo actualizar Engram

Guarda (`mem_save`) SOLO cuando ocurra:
- Alta/baja/renombre de ruta en `AppRouter.jsx`.
- Cambio del modelo numismático (campos, condición, metal).
- Migración de un componente legacy al tema `brand-*`.
- Eliminación de archivo muerto o incorporación de backend real.
- Gotcha no obvio de pnpm/Docker/React 17/Vite.

NO guardes: cambios cosméticos en un único archivo, contenido de `pnpm-lock.yaml`,
logs de git, ni nada ya cubierto por observaciones existentes.

Topic keys vigentes a usar: `architecture/overview`, `architecture/theming`,
`domain/coin-model`, `conventions/react-style`, `tech-debt/dead-code`,
`constraints/react-17`, `config/runtime-env`.

## Cómo minimizar tokens en cada tarea

- Arranca con Engram, no con `ls`/`cat`.
- `CoinForm.jsx` ahora es un orchestrator con 6 sub-componentes en `src/components/coin/`.
  Si la tarea toca el form, lee el sub-componente específico, no el orchestrator entero.
- Si la tarea toca theming, lee solo `App.css` + `tailwind.config.js` + el archivo
  del componente; ignora el resto.
- No confundas `react@17` con `react@18` — la API difiere.
- No busques backend/persistencia/API — no existen.
