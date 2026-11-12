# Estado funcional de NEXORA

## Ejecutar

```bash
npm ci
npm run dev
```

Frontend: `http://localhost:5173`
API: `http://localhost:3001`
Healthcheck: `http://localhost:3001/api/health`

La primera ejecución crea `server/nexora.sqlite` y carga datos iniciales. La base local no se sube al repositorio.

## Funciona y se verificó

- Registro, inicio y cierre de sesión; contraseña almacenada con bcrypt y sesión en cookie HttpOnly.
- Carga de perfil, perfiles de ejemplo, comunidades, eventos y publicaciones desde la API.
- Edición persistente de nombre y usuario.
- Guardar preferencias de cuenta.
- Conectar personas; crear conversaciones al conectar.
- Unirse y salir de comunidades.
- Inscribirse a eventos y actualizar el total de participantes.
- Crear publicaciones de búsqueda de equipo.
- Dar/quitar likes y guardar/quitar posts, personas y comunidades.
- Ver posts guardados en la sección Guardados.
- Enviar mensajes persistentes y marcar mensajes/notificaciones como leídos.

Validaciones ejecutadas: `npm run build`; pruebas manuales en navegador de registro/login/logout, publicaciones, guardados, mensajes, preferencias, comunidades y eventos, incluyendo recargas para comprobar persistencia.

## Pendiente

- Mensajería en tiempo real y respuestas de otros usuarios.
- Comentarios, compartir y carga de imágenes.
- Envío real de notificaciones push o correo.
- Verificación de correo, recuperación de contraseña y protección contra intentos automatizados.
- Suite de pruebas automatizadas y configuración de despliegue.

La base actual está pensada para desarrollo local con SQLite, no para publicar tal cual en producción.
