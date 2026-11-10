# Pastelería Mil Sabores

Tienda web de la pastelería migrada de HTML/JS a **React 18 + TypeScript + Vite**.
Funciona sin backend: los datos se simulan en `localStorage` (modo `local`).

## Requisitos

- **Node.js 18.18 o superior** (recomendado: Node 20 LTS, ver `.nvmrc`).
- npm (incluido con Node).

Verificar versiones:

```bash
node -v
npm -v
```

## Puesta en marcha

```bash
npm ci          # instala exactamente las versiones de package-lock.json
npm run dev     # levanta la app en http://localhost:5173
```

No es necesario crear un archivo `.env`: por defecto la app usa datos locales.
Para cambiar la configuración, copiar `.env.example` como `.env` y ajustar.

## Scripts

| Comando              | Qué hace                                                  |
|----------------------|-----------------------------------------------------------|
| `npm run dev`        | Servidor de desarrollo con recarga en caliente.           |
| `npm test`           | Ejecuta las pruebas unitarias una vez (Vitest).           |
| `npm run test:watch` | Pruebas en modo observación (se re-ejecutan al guardar).  |
| `npm run build`      | Verifica tipos (`tsc`) y genera la versión de producción. |
| `npm run preview`    | Sirve la versión de producción generada en `dist/`.       |
| `npm run lint`       | Revisa el código con ESLint.                              |

## Pruebas unitarias

- Herramientas: **Vitest + React Testing Library + jsdom**.
- Una prueba por componente (41 en total), en un archivo hermano:
  `src/components/shared/Boton.tsx` → `src/components/shared/Boton.test.tsx`.
- Cada prueba sigue el patrón **Arrange / Act / Assert**.
- Utilidades compartidas en `src/test/` (configuración y helpers para router y contextos).

```bash
npm test
```

## Cuentas de prueba

| Rol           | Correo                | Contraseña |
|---------------|-----------------------|------------|
| Administrador | jorgesoto@gmail.com   | admin1     |
| Vendedor      | vendedor@duoc.cl      | vende1     |
| Cliente       | cliente@gmail.com     | cliente1   |

Cupón de descuento de prueba: `FELICES50` (10 %).

Los datos se guardan en el `localStorage` del navegador; para volver al estado inicial,
borrar los datos del sitio desde las herramientas del navegador.

## Estructura

```
src/
├── components/   componentes reutilizables (+ sus pruebas *.test.tsx)
├── pages/        páginas de la tienda y del panel admin
├── routes/       definición de rutas
├── context/      estado global (sesión, carrito, notificaciones)
├── hooks/        hooks personalizados
├── services/     repositorios (local hoy, HTTP a futuro)
├── utils/        funciones puras (formato, validaciones, carrito)
├── data/         datos semilla
├── types/        tipos de TypeScript
└── test/         configuración de pruebas
legacy/           sitio HTML original (referencia)
```

## Problemas frecuentes

- **`npm ci` falla con `EPERM`** (Windows): cerrar `npm run dev` u otro proceso que use la
  carpeta del proyecto y volver a ejecutar.
- **Aviso `EBADENGINE`** o errores extraños al instalar: actualizar Node a 18.18+ (ideal 20).
