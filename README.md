# NEXORA

> **Encuentra tu gente. Encuentra tu lugar.**

Prototipo **frontend** de una red social para gamers, anime, tecnología, música y creatividad. Permite descubrir comunidades, encontrar personas con tus mismos intereses, buscar equipo para proyectos, inscribirse a eventos y conversar por chat — todo con **datos mock** y estado local (sin backend).

> ⚠️ **Esto es un prototipo de interfaz**, no un producto terminado: no hay servidor, ni autenticación real, ni base de datos. Al recargar la página el estado vuelve a su valor inicial.

---

## 📑 Índice

- [Vista rápida](#-vista-rápida)
- [Stack tecnológico](#-stack-tecnológico)
- [Requisitos previos](#-requisitos-previos)
- [Instalación y ejecución](#-instalación-y-ejecución)
- [Scripts disponibles](#-scripts-disponibles)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Rutas de la aplicación](#-rutas-de-la-aplicación)
- [Funcionalidades](#-funcionalidades)
- [Cómo funciona el estado global](#-cómo-funciona-el-estado-global)
- [Datos mock](#-datos-mock)
- [Personalización](#-personalización)
- [Convenciones del código](#-convenciones-del-código)
- [Solución de problemas](#-solución-de-problemas)
- [Limitaciones conocidas](#-limitaciones-conocidas)

---

## 🚀 Vista rápida

```bash
# 1. Entra al proyecto
cd c:\Users\Andres\Desktop\copeten

# 2. Instala dependencias (solo la primera vez)
npm install

# 3. Arranca el servidor de desarrollo
npm run dev
```

Abre **http://localhost:5173** en el navegador. La app recarga automáticamente al guardar cambios.

| Comando | Para qué sirve |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con HMR en `http://localhost:5173` |
| `npm run build` | Typecheck (`tsc --noEmit`) + build de producción en `dist/` |
| `npm run preview` | Sirve localmente el contenido ya compilado de `dist/` |
| `npm run typecheck` | Solo valida tipos, sin compilar ni empaquetar |

---

## 🧱 Stack tecnológico

| Área | Tecnología | Versión |
| --- | --- | --- |
| Librería UI | React | `19.3` |
| Lenguaje | TypeScript | `7.0` (port nativo) |
| Bundler / dev server | Vite | `8.3` |
| Enrutado | React Router DOM | `7.18` |
| Estilos | Tailwind CSS | `3.4` |
| Iconos | lucide-react | `1.69` |
| Post-proceso CSS | PostCSS + Autoprefixer | `8.5` / `10.6` |

Decisiones relevantes:

- **Tailwind v3** (no v4) para poder usar la configuración clásica `tailwind.config.js` + `postcss.config.js` y las utilidades `@apply` en `globals.css`.
- **TypeScript 7** ya **no admite `baseUrl`**, por eso los alias se declaran solo con `paths` (ver [Convenciones](#-convenciones-del-código)).
- Estado global con **React Context + `useReducer`‑style setters** (sin Redux/Zustand) para mantener el prototipo ligero.

---

## ✅ Requisitos previos

| Herramienta | Versión mínima | Cómo comprobar |
| --- | --- | --- |
| **Node.js** | `^20.19.0` o `>=22.12.0` (lo exige Vite 8) | `node --version` |
| **npm** | `>=10` (incluido con Node) | `npm --version` |

Versión con la que se desarrolló y validó este proyecto:

```text
node  v26.13.0
npm   11.20.0
```

Descarga Node.js LTS desde <https://nodejs.org/> si no lo tienes instalado.

---

## 🛠️ Instalación y ejecución

### Opción A — PowerShell (Windows, recomendado)

```powershell
# 1) Ir a la carpeta del proyecto
Set-Location 'c:\Users\Andres\Desktop\copeten'

# 2) Instalar dependencias
npm install

# 3) Arrancar en modo desarrollo
npm run dev
```

### Opción B — CMD / Terminal integrada de VS Code

```bat
cd c:\Users\Andres\Desktop\copeten
npm install
npm run dev
```

### Opción C — macOS / Linux

```bash
cd /ruta/a/copeten
npm install
npm run dev
```

### Instalación reproducible (CI / otro equipo)

Si existe `package-lock.json` (está incluido), usa `npm ci` en lugar de `npm install` para instalar exactamente las versiones bloqueadas:

```bash
npm ci
```

### Comprobar que todo está correcto

```powershell
npm run typecheck   # debe terminar sin errores
npm run build       # genera la carpeta dist/
npm run preview     # sirve dist/ en http://localhost:4173
```

### Salida esperada del build

```text
vite v8.x building client environment for production...
✓ built in ~3s
dist/index.html
dist/assets/index-*.css
dist/assets/index-*.js
```

---

## 📜 Scripts disponibles

Definidos en `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit"
  }
}
```

| Script | Qué hace | Cuándo usarlo |
| --- | --- | --- |
| `dev` | Levanta Vite con recarga en caliente (HMR). | Desarrollo diario. |
| `build` | Valida tipos y genera el bundle optimizado en `dist/`. | Antes de entregar/publicar. |
| `preview` | Sirve `dist/` tal cual (sin HMR). | Verificar el build final. |
| `typecheck` | Solo `tsc --noEmit`; no emite archivos. | Revisar errores de tipos rápidamente. |

> El servidor de desarrollo ocupa el puerto **5173** por defecto. Si está ocupado, Vite usará 5174, 5175, etc. Para forzar otro puerto:
> `npm run dev -- --port 5180`

---

## 🗂️ Estructura del proyecto

```text
copeten/
├─ index.html                  # HTML raíz (monta #root, fuentes y meta)
├─ package.json                # Dependencias y scripts
├─ package-lock.json           # Versiones bloqueadas (npm ci)
├─ postcss.config.js           # Tailwind + Autoprefixer
├─ tailwind.config.js          # Tema: colores night/brand/azure, sombras, animaciones
├─ tsconfig.json               # Opciones de TS + alias "@/*"
├─ vite.config.ts              # Plugin React + alias "@"
├─ .gitignore
├─ README.md
└─ src/
   ├─ main.tsx                 # Punto de entrada: ReactDOM + App
   ├─ App.tsx                  # Providers (AppProvider + BrowserRouter) y rutas
   ├─ vite-env.d.ts
   ├─ styles/
   │  └─ globals.css           # @tailwind, estilos base, .card-surface, .text-gradient…
   ├─ types/                   # Tipos e interfaces del dominio
   │  ├─ user.types.ts
   │  ├─ community.types.ts
   │  ├─ event.types.ts
   │  ├─ post.types.ts
   │  ├─ message.types.ts
   │  ├─ notification.types.ts
   │  └─ index.ts              # Barrel: exporta todos los tipos
   ├─ utils/
   │  ├─ constants.ts          # BRAND, NAV_ITEMS, filtros de categorías/intereses
   │  └─ helpers.ts            # cn(), formateadores (fechas, números, iniciales)
   ├─ data/                    # Datos mock (arrays estáticos tipados)
   │  ├─ users.ts
   │  ├─ communities.ts
   │  ├─ events.ts
   │  ├─ posts.ts
   │  ├─ messages.ts
   │  └─ notifications.ts
   ├─ context/
   │  └─ AppContext.tsx        # Store central: estado + acciones + toasts (useApp)
   ├─ hooks/
   │  ├─ useUsers.ts           # Filtrado/búsqueda de personas
   │  ├─ useCommunities.ts     # Filtrado de comunidades por categoría/estado
   │  └─ useFavorites.ts       # Derivados de guardados/favoritos
   ├─ routes/
   │  └─ AppRoutes.tsx         # <Routes>, rutas hijas de MainLayout y 404
   ├─ components/
   │  ├─ ui/                   # Primitivos reutilizables
   │  │  ├─ Avatar.tsx  Badge.tsx  Button.tsx  Chip.tsx
   │  │  ├─ EmptyState.tsx  Input.tsx  Logo.tsx  Modal.tsx
   │  │  ├─ PageHeader.tsx  SectionHeader.tsx  Skeleton.tsx
   │  │  └─ ToastViewport.tsx
   │  ├─ layout/               # Esqueleto de la app
   │  │  ├─ Sidebar.tsx        # Navegación principal + badge de mensajes
   │  │  ├─ Header.tsx         # Buscador, notificaciones, perfil
   │  │  ├─ RightPanel.tsx     # Sugerencias / eventos / actividad
   │  │  └─ MainLayout.tsx     # Compone sidebar + header + <Outlet/> + panel
   │  ├─ communities/
   │  │  ├─ CommunityIcon.tsx  # Icono + gradiente según categoría
   │  │  └─ CommunityCard.tsx
   │  ├─ users/
   │  │  ├─ UserCard.tsx
   │  │  └─ ProfileModal.tsx   # Ficha de usuario en modal
   │  ├─ dashboard/
   │  │  ├─ StatCard.tsx
   │  │  ├─ PostCard.tsx       # Like / guardar / compartir
   │  │  └─ RecommendationCard.tsx
   │  ├─ events/
   │  │  └─ EventCard.tsx
   │  └─ messages/
   │     ├─ ConversationItem.tsx
   │     └─ ChatThread.tsx     # Hilo de mensajes + input
   └─ pages/
      ├─ Dashboard/Dashboard.tsx
      ├─ Discover/Discover.tsx
      ├─ People/People.tsx
      ├─ FindTeam/FindTeam.tsx
      ├─ Communities/Communities.tsx
      ├─ Messages/Messages.tsx
      ├─ Events/Events.tsx
      ├─ Saved/Saved.tsx
      ├─ Settings/Settings.tsx
      └─ Profile/Profile.tsx
```

> La carpeta `Myworld/` que puedas ver en la raíz **no forma parte de NEXORA** (es un repositorio git independiente). Puedes ignorarla o eliminarla.

---

## 🧭 Rutas de la aplicación

Todas las rutas cuelgan de `MainLayout` (sidebar + header + contenido + panel derecho). La tabla de navegación vive en `src/utils/constants.ts` → `NAV_ITEMS`.

| Ruta | Pantalla | Componente | Qué puedes hacer |
| --- | --- | --- | --- |
| `/` | Inicio | `pages/Dashboard/Dashboard.tsx` | Feed con posts (like/guardar), métricas y recomendaciones |
| `/discover` | Descubrir comunidades | `pages/Discover/Discover.tsx` | Explorar comunidades y unirte con un clic |
| `/people` | Encuentra personas | `pages/People/People.tsx` | Buscar/filtrar por interés, conectar, abrir perfil |
| `/team` | Encuentra equipo | `pages/FindTeam/FindTeam.tsx` | Filtrar perfiles por rol/buscando equipo |
| `/communities` | Mis comunidades | `pages/Communities/Communities.tsx` | Ver las comunidades a las que te uniste y salir |
| `/messages` | Mensajes | `pages/Messages/Messages.tsx` | Elegir conversación (desktop 2 columnas, móvil alterna) |
| `/events` | Eventos | `pages/Events/Events.tsx` | Inscribirte (sube el contador de participantes) |
| `/saved` | Guardados | `pages/Saved/Saved.tsx` | Ver posts guardados y quitarlos |
| `/settings` | Configuración | `pages/Settings/Settings.tsx` | Editar nombre/usuario y preferencias (switches) |
| `/profile` | Perfil | `pages/Profile/Profile.tsx` | Tu perfil, estadísticas e intereses |
| `*` | 404 | `routes/AppRoutes.tsx` (interno) | Página de "no existe" con botón de vuelta |

---

## ✨ Funcionalidades

### Interacciones globales (persisten en memoria durante la sesión)

- **Conectar / desconectar** personas (`connectUser`) → toast de confirmación.
- **Unirse / salir** de comunidades (`joinCommunity` / `leaveCommunity`).
- **Inscribirse a eventos** (`joinEvent`) → incrementa `participants`.
- **Like** en posts (`toggleLike`) → actualiza `likes` y marca `liked`.
- **Guardar / quitar** de Guardados (`toggleFavorite`).
- **Notificaciones**: marcar como leídas (`markNotificationRead`).
- **Chat**: enviar mensajes (`sendMessage`) → actualiza el hilo y el badge de no leídos.
- **Modal de perfil**: abrir la ficha de cualquier usuario (`openProfile` / `closeProfile`).
- **Toasts**: feedback visual temporal (`pushToast`, auto-cierre a los 3.2 s).

### Detalles por pantalla

- **Inicio**: hero con gradiente animado, tarjetas de métricas, feed de posts con acciones y panel de recomendaciones.
- **Descubrir**: buscador + chips de categoría (`CATEGORY_FILTERS`), tarjetas con gradiente por categoría, estado "Miembro"/"Unirse".
- **Personas**: búsqueda por texto, chips de interés (`INTEREST_FILTERS`), tarjetas con avatar, estado en línea, tags y botón Conectar.
- **Equipo**: perfiles "buscando equipo" con rol, proyecto y stack; CTA de contacto.
- **Mis comunidades**: solo las unidas, con opción **Salir**.
- **Mensajes**: lista de conversaciones con último mensaje, no leídos y hora; hilo con burbujas + envío por Enter; en móvil muestra lista o chat con botón atrás.
- **Eventos**: tarjetas con fecha/hora, modalidad, aforo y CTA **Inscribirme / Inscrito**.
- **Guardados**: rejilla de posts guardados con acción **Quitar** y estado vacío (`EmptyState`).
- **Configuración**: perfil, preferencias con `Switch` accesible (`role="switch"`, `aria-checked`) y tarjetas de apariencia/sesión.
- **Perfil**: cabecera con avatar/gradiente, estadísticas, intereses y comunidades.

### UI / UX

- **Tema oscuro** con paleta `night`/`brand` (violeta) / `azure` (azul), gradientes y sombras de glow.
- **Responsive**: sidebar fija en `lg+`, drawer con overlay en móvil; panel derecho oculto en pantallas pequeñas.
- **Accesibilidad básica**: foco visible (`ring-focus`), `aria-*` en switches y botones, cierre de modal con `Escape` y overlay.
- **Skeletons** (`Skeleton` + `.shimmer`) listos para estados de carga.

---

## 🧠 Cómo funciona el estado global

Todo el estado vive en **`src/context/AppContext.tsx`**, se inyecta en `App.tsx` mediante `<AppProvider>` y se consume con el hook `useApp()`.

```tsx
import { useApp } from '@/context/AppContext';

function MiComponente() {
  const { posts, toggleLike, isPostLiked, pushToast } = useApp();
  // ...
}
```

### API expuesta por `useApp()`

| Grupo | Miembros |
| --- | --- |
| **Datos base** | `user`, `people`, `communities`, `events`, `posts`, `notifications`, `conversations` |
| **Estado de sesión** | `connections`, `joinedCommunities`, `favorites`, `joinedEvents`, `likedPosts` (arrays de ids) |
| **UI global** | `activeConversationId`, `profileUserId`, `toasts` |
| **Acciones** | `connectUser(id)`, `joinCommunity(id)`, `leaveCommunity(id)`, `joinEvent(id)`, `toggleFavorite(id)`, `toggleLike(postId)`, `markNotificationRead(id)`, `markAllNotificationsRead()`, `openConversation(id)`, `sendMessage(conversationId, text)`, `openProfile(userId)`, `closeProfile()`, `pushToast(message, variant?)`, `dismissToast(id)` |
| **Selectores** | `isConnected(id)`, `isJoined(id)`, `isFavorite(id)`, `isEventJoined(id)`, `isPostLiked(id)`, `getUser(id)`, `getCommunity(id)` |
| **Derivados** | `unreadMessageCount`, `unreadNotificationCount` |

Truco importante: las acciones **no** llaman a `setState` dentro de otro updater de `setState`; leen el estado actual y luego aplican los cambios de forma secuencial. Así se evitan las advertencias de React por actualizar estado durante el render.

### Hooks de dominio (encapsulan filtros + acciones)

| Hook | Devuelve | Usado en |
| --- | --- | --- |
| `useUsers()` | `filtered`, `query`/`setQuery`, `interest`/`setInterest`, `onlyOnline`/`setOnlyOnline`, `reset`, `connectUser`, `isConnected`, `openProfile` | `People`, `FindTeam` |
| `useCommunities()` | `filtered`, `myCommunities`, `query`/`setQuery`, `category`/`setCategory`, `reset`, `joinCommunity`, `leaveCommunity`, `isJoined`, `toggleFavorite`, `isFavorite` | `Discover`, `Communities` |
| `useFavorites()` | `favorites`, `savedCommunities`, `savedPeople`, `total`, `toggleFavorite`, `isFavorite` | `Saved` |

---

## 🗃️ Datos mock

Los datos están en `src/data/*.ts` como arrays tipados exportados:

```ts
// src/data/users.ts
export const currentUser: User = { /* … */ };
export const people: User[] = [ /* … */ ];

// src/data/communities.ts
export const communities: Community[] = [ /* … */ ];
```

Para cambiar el contenido de la demo, edita esos archivos (o los tipos en `src/types/`). Se importan una sola vez en `AppContext` como estado inicial (`seed*`), así que los cambios se reflejan al instante con el HMR.

- `users.ts` → `currentUser` + `people` (con `interests`, `games`, `online`, `lookingForTeam`…).
- `communities.ts` → nombre, descripción, categoría, miembros, tags y gradiente.
- `events.ts` → título, fecha/hora, modalidad, aforo y participantes.
- `posts.ts` → autor, contenido, likes, comentarios, tags y `saved`.
- `messages.ts` → conversaciones con `messages[]`, `unread` y hora.
- `notifications.ts` → tipo, texto, `read` y fecha.

---

## 🎨 Personalización

### 1. Nombre de la marca

Cámbialo una sola vez en `src/utils/constants.ts`:

```ts
export const BRAND = {
  name: 'NEXORA',
  tagline: 'Encuentra tu gente. Encuentra tu lugar.',
} as const;
```

### 2. Paleta y tema

En `tailwind.config.js`:

```js
colors: {
  night: { 950: '#050509', /* … */ 500: '#2f2f49' },
  brand: { DEFAULT: '#8b5cf6', /* … */ 800: '#5b21b6' },
  azure: { DEFAULT: '#3b82f6', /* … */ 700: '#1d4ed8' },
}
```

También hay sombras (`shadow-card`, `shadow-glow`) y animaciones (`fade-in-up`, `floaty`, `shimmer`, `gradient-pan`).

### 3. Utilidades de estilo propias (`src/styles/globals.css`)

| Clase | Efecto |
| --- | --- |
| `.card-surface` | Tarjeta glass con borde y blur |
| `.card-hover` | Elevación + glow al pasar el ratón |
| `.glass` | Superficie translúcida genérica |
| `.ring-focus` | Anillo de foco accesible |
| `.text-gradient` | Texto con degradado de marca |
| `.no-scrollbar` | Oculta la barra de scroll |
| `.shimmer` | Overlay animado para skeletons |

### 4. Navegación

Añadir/quitar secciones se hace solo en `NAV_ITEMS` (`src/utils/constants.ts`), siempre que exista una `<Route>` con la misma `path` en `src/routes/AppRoutes.tsx`.

---

## 🧩 Convenciones del código

- **Alias de importación** `@/*` → `src/*`. Ejemplo: `import { Button } from '@/components/ui/Button';`
  - Se configura en **dos** sitios: `vite.config.ts` (`resolve.alias`, para el bundler) y `tsconfig.json` (`compilerOptions.paths`, para el editor/typecheck).
  - En **TypeScript 7** la opción `baseUrl` fue eliminada (error `TS5102`); los `paths` se resuelven relativos al `tsconfig.json`, por eso solo existe `"paths": { "@/*": ["./src/*"] }`.
- **Componentes** en `PascalCase.tsx`, export nombrado (`export function Button(...)`) y props tipadas con `interface`.
- **Tipos de dominio** en `src/types/*.types.ts`, re-exportados desde `src/types/index.ts`.
- **Estilos** con utilidades Tailwind + `cn()` para clases condicionales. Evita CSS suelto.
- **Estado**: no dupliques datos. Si algo ya está en `AppContext`, consúmelo con `useApp()`.
- **Sin `setState` anidado**: nunca llames a un setter dentro del updater de otro setter (causa warnings de React).

### Receta: añadir una página nueva

1. Crea `src/pages/MiPagina/MiPagina.tsx`:

   ```tsx
   import { PageHeader } from '@/components/ui/PageHeader';
   import { useApp } from '@/context/AppContext';

   export function MiPagina() {
     const { user } = useApp();
     return (
       <div>
         <PageHeader eyebrow="Sección" title="Mi página" subtitle={`Hola, ${user.name}`} />
       </div>
     );
   }
   ```

2. Impórtala y añade la ruta en `src/routes/AppRoutes.tsx`:

   ```tsx
   <Route path="/mi-pagina" element={<MiPagina />} />
   ```

3. (Opcional) Añádela a `NAV_ITEMS` en `src/utils/constants.ts` si debe salir en el sidebar.

---

## 🩺 Solución de problemas

| Síntoma | Causa probable | Solución |
| --- | --- | --- |
| `'node' no se reconoce como comando` | Node no está en el `PATH` | Reinstala Node.js o, en PowerShell: `$env:Path = 'C:\Program Files\nodejs;' + $env:Path` y reintenta. |
| `npm ERR! code ENOENT` / `package.json not found` | No estás en la carpeta del proyecto | `Set-Location 'c:\Users\Andres\Desktop\copeten'` antes de ejecutar. |
| `TS5102: Option 'baseUrl' has been removed` | TS 7 eliminó `baseUrl` | Ya corregido: usa solo `paths` en `tsconfig.json`. |
| Los estilos no se aplican | Tailwind v4 instalado por error | `npm ls tailwindcss` debe mostrar `3.4.x`. Si no, `npm install -D tailwindcss@3.4.17` y conserva `tailwind.config.js` + `postcss.config.js`. |
| Cambios de Tailwind no se reflejan | Archivo no incluido en `content` | `content: ['./index.html', './src/**/*.{ts,tsx}']` en `tailwind.config.js`. |
| Puerto 5173 ocupado | Otro proceso lo usa | Vite elegirá otro puerto, o fuerza uno: `npm run dev -- --port 5180`. |
| `npm ci` falla | `package-lock.json` desincronizado | Usa `npm install` (o `npm install --package-lock-only` y luego `npm ci`). |
| Errores de tipos tras actualizar deps | Tipos desalineados | `npm run typecheck` y revisa `@types/react` / `@types/react-dom` con React 19. |
| Pantalla en blanco en el navegador | Error de ejecución | Abre la consola del navegador (F12); revisa que `src/main.tsx` monte `#root`. |
| Un icono no aparece | Nombre inexistente en `lucide-react` | Solo nombres exportados por la versión instalada (aquí se validaron los 42 iconos usados). |

> Reinicia el servidor (`Ctrl + C` y `npm run dev`) después de tocar `tailwind.config.js`, `postcss.config.js` o `vite.config.ts`.

---

## 🚧 Limitaciones conocidas

Este prototipo está pensado para **demostrar UI/UX**, no para producción:

- ❌ **Sin backend, API ni base de datos**: todo son datos mock en `src/data/`.
- ❌ **Sin persistencia**: al recargar, likes/conexiones/guardados/mensajes vuelven al estado inicial (no hay `localStorage`).
- ❌ **Sin autenticación**: el usuario actual es `currentUser` en `src/data/users.ts`.
- ❌ **Chat simulado**: los mensajes se añaden al hilo, pero nadie responde.
- ❌ **Tema solo oscuro**: la tarjeta de apariencia es informativa.
- ❌ **Acciones no implementadas**: **Comentarios** y **Compartir** solo lanzan un toast informativo; tampoco hay subida de imágenes ni guardado real del formulario de perfil.
- ❌ **Sin tests automatizados**: la validación actual es `npm run typecheck` + `npm run build`.
- ⚠️ **Carpeta `Myworld/`** en la raíz: repo git ajeno al proyecto. No se usa ni se importa.

---

## 📄 Licencia y uso

Prototipo **educativo / demostrativo** de interfaz. Úsalo y modifícalo libremente para tus prácticas, demos o portafolio. Los nombres de usuarios, comunidades y eventos son ficticios.

---

Hecho con ⚡ **React + TypeScript + Vite + Tailwind CSS** — *NEXORA · Encuentra tu gente. Encuentra tu lugar.*
