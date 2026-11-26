using DotNetEnv;
using HabitForge.Infrastructure;
using Scalar.AspNetCore;
using HabitForge.Application;
using HabitForge.API.Security;
using HabitForge.Infrastructure.Data;
using HabitForge.Infrastructure.Security;

var habilitarGameMaster = args is ["habilitar-gamemaster", _];
var builder = WebApplication.CreateBuilder(habilitarGameMaster ? [] : args);

Env.Load();

var connectionString =
    Environment.GetEnvironmentVariable("ConnectionStrings__PostgresConnection")
    ?? throw new InvalidOperationException("Falta la cadena de conexión.");

var corsAllowedOrigins = Environment.GetEnvironmentVariable("CORS_ALLOWED_ORIGINS")
    ?? throw new InvalidOperationException(
        "Falta la variable CORS_ALLOWED_ORIGINS en el archivo .env."
    );
    
builder.Services.AddApplication();
builder.Services.AddInfrastructure(connectionString);

if (habilitarGameMaster)
{
    await using var comando = builder.Build();
    await using var scope = comando.Services.CreateAsyncScope();
    var context = scope.ServiceProvider.GetRequiredService<HabitForgeDbContext>();
    var actualizado = await HabilitarGameMaster.EjecutarAsync(context, args[1]);
    Console.WriteLine(actualizado ? "Cuenta GameMaster habilitada." : "No se encontró una cuenta con ese correo.");
    Environment.ExitCode = actualizado ? 0 : 1;
    return;
}

AutenticacionJwt.Agregar(builder.Services);
builder.Services.AddControllers();

// Genera la documentación OpenAPI
builder.Services.AddOpenApi();


// Política CORS de HabitForge
builder.Services.AddCors(options =>
{
    options.AddPolicy("PoliticaCorsHabitForge", policy =>
    {
        var origenes = corsAllowedOrigins.Split(
            ',',
            StringSplitOptions.RemoveEmptyEntries |
            StringSplitOptions.TrimEntries
        );

        policy.WithOrigins(origenes)
              .SetIsOriginAllowedToAllowWildcardSubdomains()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    // Publica el documento OpenAPI
    app.MapOpenApi();

    // Interfaz visual de Scalar
    app.MapScalarApiReference();
}


app.UseCors("PoliticaCorsHabitForge");
app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.Run();
