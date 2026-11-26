# Interfaz web de HabitForge

En esta pantalla puede consultar el catálogo global, buscar hábitos por nombre, agregar nuevos hábitos y eliminar los que ya no necesita.

## Herramientas

- **React** construye la interfaz con componentes como el formulario y la tarjeta de cada hábito.
- **TypeScript** comprueba, antes de ejecutar la aplicación, que el código usa los datos con los tipos esperados.
- **Vite** inicia un servidor para trabajar en local y actualiza la página cuando guarda cambios. Esa actualización durante el desarrollo se conoce como **HMR**.
- **ESLint** revisa el código y señala problemas según las reglas configuradas en el proyecto.

## Iniciar la interfaz

Primero, prepare PostgreSQL e inicie la API según el [README principal](../README.md). Luego cree el archivo `frontend/.env` con esta dirección.

```dotenv
VITE_API_BASE_URL=http://localhost:5020/api
```

La variable indica dónde está la API. El cliente añade `/habitos` a esa dirección para consultar el catálogo.

Desde la raíz del repositorio, ejecute estos comandos.

```sh
cd frontend
pnpm install
pnpm dev
```

Abra `http://localhost:5173` en el navegador. Si Vite muestra otro puerto, use el que indique la terminal y actualice `CORS_ALLOWED_ORIGINS` en `backend/HabitForge.API/.env` antes de reiniciar la API.

## Otros comandos

Ejecute estos comandos dentro de `frontend/`.

| Comando | Para qué sirve |
| --- | --- |
| `pnpm lint` | Revisa el código con ESLint. |
| `pnpm build` | Comprueba los tipos y genera los archivos de producción en `dist/`. |
| `pnpm preview` | Muestra en local los archivos generados por `pnpm build`. |
