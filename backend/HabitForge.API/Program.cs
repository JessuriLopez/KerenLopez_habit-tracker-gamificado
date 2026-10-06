using DotNetEnv;
using HabitForge.Infrastructure;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

Env.Load();

var connectionString =
    Environment.GetEnvironmentVariable("ConnectionStrings__PostgresConnection")
    ?? throw new InvalidOperationException("Falta la cadena de conexión.");

builder.Services.AddInfrastructure(connectionString);

builder.Services.AddControllers();

// Genera la documentación OpenAPI
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    // Publica el documento OpenAPI
    app.MapOpenApi();

    // Interfaz visual de Scalar
    app.MapScalarApiReference();
}

app.MapControllers();

app.Run();