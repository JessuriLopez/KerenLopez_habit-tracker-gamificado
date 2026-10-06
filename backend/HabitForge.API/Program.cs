using DotNetEnv;
using HabitForge.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

Env.Load();

var connectionString =
    Environment.GetEnvironmentVariable("ConnectionStrings__PostgresConnection")
    ?? throw new InvalidOperationException("Falta la cadena de conexión.");

// Infrastructure configura PostgreSQL, DbContext y los repositorios
builder.Services.AddInfrastructure(connectionString);

builder.Services.AddControllers();

var app = builder.Build();

app.MapControllers();

app.Run();