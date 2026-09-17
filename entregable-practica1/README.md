# Práctica #1 - Rutas Públicas y Privadas con React Router

## Descripción
Aplicación web construida con React y Vite que implementa protección de rutas públicas y privadas mediante `react-router-dom` y gestión de estado global de autenticación con `Context API`.

## Estructura del Proyecto
- `src/context/AuthContext.jsx`: Maneja el estado global de autenticación (`isAuth`), así como las funciones de `login()` y `logout()`.
- `src/routes/PrivateRoutes.jsx`: Componente de protección para vistas privadas.
- `src/routes/Routing.jsx`: Configuración centralizada de las rutas públicas (`/`, `/login`, `/registro`) y privadas (`/dashboard`, `/perfil`).

## Explicación Técnica de PrivateRoutes.jsx
El componente `PrivateRoutes.jsx` actúa como un envoltorio de seguridad (*Higher-Order Component* / Wrapper). Consume el estado `isAuth` provisto por el `AuthContext`:

- **Acceso Autorizado (`isAuth === true`):** Retorna el componente `<Outlet />` de `react-router-dom`, permitiendo que se rendericen dinámicamente las rutas hijas declaradas dentro de la estructura anidada de enrutamiento.
- **Acceso Denegado (`isAuth === false`):** Retorna el componente `<Navigate to="/login" replace />`, el cual interrumpe el renderizado de la ruta protegida y redirige automáticamente al usuario hacia el formulario de inicio de sesión, impidiendo el acceso no autorizado incluso si se intenta ingresar la URL directamente en el navegador.
