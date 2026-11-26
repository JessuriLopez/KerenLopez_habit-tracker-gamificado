using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using HabitForge.Application.Interfaces;
using HabitForge.Application.Features.CheckIns;
using HabitForge.Domain.Entities;
using HabitForge.Infrastructure.Data;
using HabitForge.Infrastructure.Repositories;
using HabitForge.Infrastructure.Security;
using Microsoft.AspNetCore.Identity;

namespace HabitForge.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        string connectionString)
    {
        services.AddDbContext<HabitForgeDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<IHabitoRepository, HabitoRepository>();
        services.AddScoped<IUsuarioRepository, UsuarioRepository>();
        services.AddScoped<ICumplimientoDiarioRepository, CumplimientoDiarioRepository>();
        services.AddScoped<IPasswordHasher<Usuario>, PasswordHasher<Usuario>>();
        services.AddScoped<IHashContrasena, HashContrasena>();

        return services;
    }
}
