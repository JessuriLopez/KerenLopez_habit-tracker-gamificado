# Interfaz web de HabitForge

Como Jugador puede consultar el catálogo, marcar sus hábitos y ver los cupones que ha obtenido. Si entra como GameMaster, puede administrar los hábitos globales y las recompensas.

## Herramientas

- **React** construye la interfaz con componentes como el formulario y la tarjeta de cada hábito.
- **TypeScript** comprueba, antes de ejecutar la aplicación, que el código usa los datos con los tipos esperados.
- **Vite** inicia un servidor para trabajar en local y actualiza la página cuando guarda cambios. Esa actualización durante el desarrollo se conoce como **HMR**.
- **ESLint** revisa el código y señala problemas según las reglas configuradas en el proyecto.

## Iniciar la interfaz

Primero, prepare PostgreSQL e inicie la API según el [README principal](../README.md). Copie `.env.example` a `.env` si todavía no tiene la configuración local. La plantilla ya incluye la dirección habitual de la API.

```dotenv
VITE_API_BASE_URL=http://localhost:5020/api
```

La variable indica dónde está la API. Vite expone su valor al navegador, así que este archivo debe contener únicamente configuración pública.

Desde la raíz del repositorio, ejecute estos comandos.

```powershell
Set-Location frontend
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
pnpm.cmd install --frozen-lockfile
pnpm.cmd dev --port 5173 --strictPort
```

Abra `http://localhost:5173` en el navegador. Si Vite informa que el puerto está ocupado, revise si HabitForge ya está en ejecución. Para detener Vite, presione `Ctrl+C` en su terminal.

## Otros comandos

Ejecute estos comandos dentro de `frontend/`.

| Comando | Para qué sirve |
| --- | --- |
| `pnpm.cmd lint` | Revisa el código con ESLint. |
| `pnpm.cmd build` | Comprueba los tipos y genera los archivos de producción en `dist/`. |
| `pnpm.cmd preview` | Muestra en local los archivos generados por `pnpm.cmd build`. |
