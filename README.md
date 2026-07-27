# DIMESMASTIST — Catálogo Numismático Personal

**Dimesmastist** (de *dime* + *numismatist*) es un catálogo digital para coleccionistas de monedas. Permite registrar, organizar y visualizar una colección numismática personal.

## Funcionalidades

- **Registro de monedas** — formulario con campos para país, valor facial, año de circulación e imágenes de anverso/reverso
- **Galería de colección** — vista en cuadrícula de las monedas registradas
- **Búsqueda** — filtro rápido dentro del catálogo
- **Persistencia** — backend planificado con SQLite (en desarrollo)

## Stack

| Capa        | Tecnología                          |
|-------------|-------------------------------------|
| Frontend    | React 17, React Router v6, Vite 5   |
| Estilos     | TailwindCSS, Headless UI, Heroicons |
| Backend     | SQLite (planificado)                |
| Contenedor  | Docker (node:alpine)                |

## Entorno de desarrollo

El proyecto se ejecuta dentro de un contenedor Docker con `node:alpine` y **pnpm**.

### Docker Compose (recomendado)

```bash
docker compose up -d
```

La aplicación corre en `http://localhost:80`.

El compose incluye:
- **Volúmenes Docker** para `node_modules` y `pnpm store` — evita el cuello de botella de bind mount en macOS
- **Healthcheck** automático contra el dev server de Vite
- **`init: true`** — manejo correcto de señales (PID 1)

## Scripts

- `pnpm dev` — inicia el servidor de desarrollo (Vite)
- `pnpm build` — genera build de producción (Vite)
- `pnpm preview` — previsualiza el build de producción
