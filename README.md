# HabitForge

HabitForge es mi proyecto integrador de Programación Web 2026 III. La idea es ayudar al jugador a mantener sus hábitos con metas y recompensas. Desde el catálogo puede elegir qué hábito completar cada día, consultar su racha y ver en **Mis Premios** los cupones que ha obtenido. El **GameMaster** administra los hábitos globales y las recompensas.

## Tecnologías y requisitos

La interfaz usa React, TypeScript, Vite y Tailwind CSS. Los formularios usan React Hook Form y Zod. La API está desarrollada en C# con ASP.NET Core, usa JWT para autenticar las solicitudes y guarda los datos en PostgreSQL mediante Entity Framework Core.

| Herramienta | Versión o requisito |
| --- | --- |
| Git | Disponible desde PowerShell. Versión local comprobada: 2.49.0. |
| SDK de .NET | 10.0.401, definido en `backend/global.json`. El manifiesto del proyecto fija `dotnet-ef` en 10.0.12. |
| Node.js | Use una versión 22.12 o superior de la rama 22. El entorno de desarrollo usa 22.16.0. |
| pnpm | Versión probada 12.16.1. |
| Docker Desktop con Compose | Docker debe estar en ejecución. Se comprobó con Docker 29.8.2 y Compose 5.5.1. PostgreSQL 16 se instala desde la imagen del proyecto. |

Pruebe `git --version`, `dotnet --version`, `node --version`, `pnpm.cmd --version` y `docker compose version` en PowerShell.

## Carpetas principales

- `backend/` contiene la API y las capas Domain, Application e Infrastructure. Las migraciones están en `backend/HabitForge.Infrastructure/Migrations/`.
- `frontend/` contiene la interfaz. Las funcionalidades se organizan en `src/features/`.
- `infra/` contiene Docker Compose y la plantilla de PostgreSQL.

## 1. Descargar y configurar

Abra PowerShell en la carpeta donde desea guardar el proyecto.

```powershell
git clone https://github.com/JessuriLopez/KerenLopez_habit-tracker-gamificado.git
Set-Location KerenLopez_habit-tracker-gamificado
```

Para una instalación nueva, copie las plantillas. Si ya tiene una instalación, conserve sus archivos locales y verifique las variables de la tabla.

```powershell
if (-not (Test-Path infra/.env)) { Copy-Item infra/.env.example infra/.env }
if (-not (Test-Path backend/HabitForge.API/.env)) {
    Copy-Item backend/HabitForge.API/.env.example backend/HabitForge.API/.env
}
if (-not (Test-Path frontend/.env)) { Copy-Item frontend/.env.example frontend/.env }
```

| Archivo | Variable | Qué debe configurar |
| --- | --- | --- |
| `infra/.env` | `POSTGRES_DB` | `HabitForgeDB`. |
| `infra/.env` | `POSTGRES_USER`, `POSTGRES_PASSWORD` | El usuario y una contraseña propios para su instalación local. |
| `backend/HabitForge.API/.env` | `ConnectionStrings__PostgresConnection` | Use `127.0.0.1:5432`, la base `HabitForgeDB` y el usuario y la contraseña de PostgreSQL. La plantilla muestra el formato. |
| `backend/HabitForge.API/.env` | `CORS_ALLOWED_ORIGINS` | Use `http://localhost:5173`, sin barra final. |
| `backend/HabitForge.API/.env` | `HABITFORGE_JWT_KEY` | Use una clave generada localmente, como se indica abajo. |
| `frontend/.env` | `VITE_API_BASE_URL` | Use `http://localhost:5020/api`. Vite expone este valor al navegador. |

Para una base nueva, puede generar una contraseña con `node -p "require('node:crypto').randomBytes(24).toString('base64url')"`. Coloque el mismo valor en `POSTGRES_PASSWORD` y en `Password` dentro de la cadena de conexión. Si el volumen de PostgreSQL ya contiene datos, use las credenciales con las que se inicializó. Cambiar los valores de `infra/.env` por sí solo no cambia la contraseña de una base existente.

Si aún no tiene clave JWT, ejecute este bloque desde la raíz. Guarda 32 bytes aleatorios codificados en Base64 en el archivo local sin imprimir la clave. Si ya tiene una clave, consérvela.

```powershell
$archivoHabitForge = (Resolve-Path 'backend/HabitForge.API/.env').Path
$configHabitForge = [IO.File]::ReadAllText($archivoHabitForge)
if ($configHabitForge -notmatch '(?m)^[ \t]*HABITFORGE_JWT_KEY[ \t]*=[ \t]*[^\s]') {
    $claveHabitForge = node -p "require('node:crypto').randomBytes(32).toString('base64')"
    $configHabitForge = $configHabitForge -replace '(?m)^[ \t]*HABITFORGE_JWT_KEY[ \t]*=[ \t]*\r?$', ''
    [IO.File]::WriteAllText($archivoHabitForge, ($configHabitForge.TrimEnd() + "`r`nHABITFORGE_JWT_KEY=$claveHabitForge`r`n"))
    Remove-Variable claveHabitForge
}
Remove-Variable configHabitForge
```

Git ignora los archivos de configuración local. Comparta únicamente las plantillas `.env.example`. Guarde las contraseñas y claves fuera del código fuente.

## 2. Iniciar PostgreSQL

Con Docker Desktop en ejecución, use estos comandos desde la raíz la primera vez.

```powershell
docker compose -f infra/docker-compose.yml up -d
docker compose -f infra/docker-compose.yml ps
docker port postgres-habitforge 5432/tcp
```

El contenedor se llama `postgres-habitforge` y el puerto debe aparecer como `127.0.0.1:5432`. Los datos se guardan en el volumen persistente `postgres_data` de Compose. Si está actualizando una instalación que publicaba el puerto en todas las interfaces, haga un respaldo verificable antes de ejecutar `up` y confirme que Compose conservará el mismo volumen. Docker aplica el cambio de publicación recreando el contenedor del servicio con el mismo nombre.

## 3. Preparar e iniciar la API

Desde la raíz, ejecute lo siguiente en una terminal. Mantenga abierta esa terminal mientras utiliza HabitForge.

```powershell
Set-Location backend/HabitForge.API
dotnet restore
dotnet tool restore
dotnet ef database update --project ../HabitForge.Infrastructure --startup-project .
dotnet run --launch-profile http
```

Use `database update` al preparar la base o al incorporar migraciones nuevas. Si ya tiene datos, verifique primero la base de destino y haga un respaldo. En el arranque habitual basta con `dotnet run --launch-profile http`. La API escucha en `http://localhost:5020/api`. Las rutas privadas requieren una sesión válida.

## 4. Iniciar la interfaz

Abra otra terminal en la raíz del repositorio.

```powershell
Set-Location frontend
pnpm.cmd install --frozen-lockfile
pnpm.cmd dev --port 5173 --strictPort
```

Abra `http://localhost:5173`. Los puertos habituales son **5173 para la interfaz**, **5020 para la API** y **5432 para PostgreSQL**.

## Cuentas y sesión

Para registrarse como **Jugador**, elija **Crear cuenta** en la pantalla de inicio de sesión. Ingrese su nombre, un correo único y una contraseña de 12 a 128 caracteres. Luego inicie sesión para ver el catálogo, completar un hábito y consultar **Mis Premios**.

Para habilitar un **GameMaster**, registre primero la cuenta que se encargará de administrar el catálogo. Desde otra terminal abierta en `backend/HabitForge.API`, ejecute el comando administrativo con el correo de esa cuenta.

```powershell
dotnet run --no-build --no-launch-profile -- habilitar-gamemaster 'correo-de-la-cuenta'
```

El comando utiliza la base configurada para esa API. Ejecútelo después de haber compilado o iniciado la API en modo normal. Cierre sesión y vuelva a entrar con la cuenta habilitada para que el token incluya el nuevo rol.

El token dura **30 minutos** y la interfaz lo conserva en memoria. Al cerrar sesión o recargar la página, deberá volver a entrar. Un token ya emitido conserva su vigencia en la API hasta que vence. Si cambia la clave de firma y reinicia la API, los tokens emitidos con la clave anterior dejan de ser válidos.

## Detener y volver a iniciar

Presione `Ctrl+C` en las terminales de la API y de Vite. Desde la raíz, detenga o inicie PostgreSQL con los comandos correspondientes.

```powershell
docker compose -f infra/docker-compose.yml stop db-habitforge
docker compose -f infra/docker-compose.yml start db-habitforge
```

`stop` y `start` conservan el contenedor y el volumen. Evite `docker compose down -v` si quiere conservar su base. Después de iniciar PostgreSQL, vuelva a ejecutar los comandos de arranque de la API y Vite.

## Si algo falla

| Síntoma | Qué revisar |
| --- | --- |
| `Falta la cadena de conexión` o `Falta la variable CORS_ALLOWED_ORIGINS` | Compruebe que la API se ejecuta desde `backend/HabitForge.API` y que el archivo se llama `.env`. |
| Error de `HABITFORGE_JWT_KEY` | Si el valor está ausente o es inválido, deje la variable vacía en el archivo local, genere la clave con el bloque de esta guía y reinicie la API. EF Core también carga esta configuración al usar el proyecto de inicio. |
| PostgreSQL rechaza la conexión o la contraseña | Consulte `docker compose -f infra/docker-compose.yml ps` y confirme el usuario, la contraseña y el nombre de la base. Use `127.0.0.1` si tiene otra instalación de PostgreSQL que escucha en IPv6. |
| El puerto ya está ocupado | Ejecute `netstat -ano` y busque el puerto para identificar el proceso antes de detenerlo. |
| El navegador reporta CORS o no carga el catálogo | Verifique que abre la interfaz en `http://localhost:5173`, que la API está en `5020` y que la URL de Vite termina en `/api`. Reinicie el servicio cuyo `.env` cambió. |
| La API devuelve `401` o `403` | Con `401`, vuelva a iniciar sesión. Con `403`, revise si su cuenta tiene el rol requerido. |
| PowerShell bloquea `pnpm.ps1` | Use `pnpm.cmd` como se muestra en los comandos. |
| Windows informa que no puede escribir en el registro de eventos | Para esa terminal, ejecute `$env:Logging__EventLog__LogLevel__Default = 'None'` y vuelva a intentar. Los mensajes de consola siguen disponibles. |

## Comprobaciones y configuración local

Ejecute `dotnet build` desde `backend/`. Desde `frontend/`, ejecute `pnpm.cmd build` para comprobar TypeScript y generar la compilación con Vite, y `pnpm.cmd lint` para revisar ESLint.

HabitForge ya aplica varias prácticas de Twelve-Factor App. El código y los manifiestos están en Git, las credenciales se configuran fuera del código, PostgreSQL es un servicio separado y la promoción de GameMaster se ejecuta como una tarea puntual. En este entorno se usa Docker para PostgreSQL y se ejecutan la API y Vite desde PowerShell. La separación de publicación y ejecución, la paridad entre ambientes, el escalado y la gestión centralizada de logs se evaluarían al preparar un despliegue. [Twelve-Factor App](https://12factor.net/) · [Publicación de puertos en Docker](https://docs.docker.com/engine/network/port-publishing/)
