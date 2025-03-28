# Configuración Actual de la Aplicación

## Base de Datos
- **Sistema**: MySQL (XAMPP)
- **Puerto**: 3306
- **Nombre de la BD**: challenge-app
- **Tablas**:
  - User
  - PasswordResetToken

## Estructura de la Aplicación
- **Framework**: Next.js
- **Base de Datos**: Prisma ORM
- **Autenticación**: JWT

### Rutas Principales
- `/` - Redirige a /login
- `/login` - Página de inicio de sesión
- `/register` - Página de registro
- `/dashboard` - Panel principal (requiere autenticación)
- `/request-reset` - Solicitud de reset de contraseña
- `/change-password` - Cambio de contraseña con token

### Endpoints API
- `/api/auth/register` - Registro de usuarios
- `/api/auth/login` - Inicio de sesión
- `/api/auth/logout` - Cierre de sesión
- `/api/auth/request-reset` - Solicitud de reset de contraseña
- `/api/auth/reset-password` - Cambio de contraseña

### Variables de Entorno
```
DATABASE_URL="mysql://root:@localhost:3306/challenge-app"
JWT_SECRET="your-secret-key"
```

### Dependencias Principales
- next
- react
- react-dom
- @prisma/client
- bcryptjs
- jsonwebtoken
- zod

### Configuración de Seguridad
- Headers de seguridad implementados
- Validación de contraseñas
- Protección de rutas
- Sanitización de inputs

### Estado Actual
- Aplicación funcionando en XAMPP
- Base de datos local
- Autenticación JWT
- Sistema de reset de contraseña implementado

## Notas para Docker
- Puerto MySQL actual: 3306
- Puerto Next.js: 3000
- Necesario cambiar puertos en Docker para evitar conflictos 