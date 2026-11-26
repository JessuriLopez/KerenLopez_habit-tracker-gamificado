# HabitForge

Proyecto personal de Programación Web 2026 III. La versión actual incluye un catálogo global donde puedes consultar, buscar, crear y eliminar hábitos. El seguimiento diario y las rachas son funcionalidades pendientes.

## Estructura del proyecto

- `frontend/` contiene la interfaz web desarrollada con React y TypeScript.
- `backend/` contiene la API desarrollada con C# y .NET, que valida las solicitudes y accede a PostgreSQL.
- `infra/` contiene la configuración de Docker Compose para ejecutar PostgreSQL en local.

Cuando guardas un hábito, la interfaz envía una solicitud a la API. La API valida el nombre, guarda el hábito en PostgreSQL y devuelve el registro creado para que React lo muestre en el catálogo.

## Ejecutar el proyecto en local

Necesitas Docker con Compose, el SDK de .NET indicado en [`backend/global.json`](backend/global.json), Node.js y pnpm.

### 1. Iniciar PostgreSQL

Crea `infra/.env` con estos valores de ejemplo para desarrollo local.

```dotenv
POSTGRES_DB=habitforge
POSTGRES_USER=habitforge
POSTGRES_PASSWORD=habitforge_local
```

Desde la raíz del repositorio, ejecuta este comando con Docker en marcha.

```sh
docker compose -f infra/docker-compose.yml up -d
```

### 2. Preparar e iniciar la API

Crea `backend/HabitForge.API/.env` con los mismos datos de la base de datos. `CORS_ALLOWED_ORIGINS` indica desde qué dirección puede acceder el navegador a la API.

```dotenv
ConnectionStrings__PostgresConnection="Host=localhost;Port=5432;Database=habitforge;Username=habitforge;Password=habitforge_local"
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Desde la raíz del repositorio, entra a `backend/HabitForge.API/`, prepara la base de datos con las migraciones y arranca la API desde esa misma carpeta.

```sh
cd backend/HabitForge.API
dotnet tool restore
dotnet ef database update --project ../HabitForge.Infrastructure --startup-project .
dotnet run --launch-profile http
```

La API escucha en `http://localhost:5020`.  consultar el catálogo en `http://localhost:5020/api/habitos`.

### 3. Iniciar la interfaz web

Abre otra terminal en la raíz del repositorio y sigue las instrucciones del [README del frontend](frontend/README.md).
