# Acceso y credenciales

## Cuenta de usuario

No hay una cuenta ni una contraseña compartida precargada. Crea tu propia cuenta desde `http://localhost:5173/register`; usa el correo, nombre de usuario y contraseña que elijas. La aplicación guarda la contraseña cifrada, no en texto legible.

No escribas ni subas contraseñas personales a este archivo ni al repositorio. Si necesitas compartir acceso, crea una cuenta temporal y cambia o elimina esa cuenta después.

## Configuración del backend

- API local: `http://localhost:3001`
- Base de datos local: `server/nexora.sqlite`
- Variable opcional para la base: `DATABASE_PATH`
- Variable de firma de sesión: `SESSION_SECRET`

En desarrollo existe un valor predeterminado para `SESSION_SECRET`; no es una credencial segura y no debe usarse en un servidor público. En despliegue, configura un secreto aleatorio fuera del código y activa HTTPS. No compartas ese secreto ni lo guardes en Markdown.
