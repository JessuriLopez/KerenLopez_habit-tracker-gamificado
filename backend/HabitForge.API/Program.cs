using DotNetEnv;
using HabitForge.Infrastructure;
using Scalar.AspNetCore;
using HabitForge.Application;

var builder = WebApplication.CreateBuilder(args);

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


app.MapControllers();

app.Run();