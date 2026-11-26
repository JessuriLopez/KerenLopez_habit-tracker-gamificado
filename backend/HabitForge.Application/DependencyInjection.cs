using FluentValidation;
using HabitForge.Application.Features.Auth.Login;
using HabitForge.Application.Features.Auth.Registro;
using HabitForge.Application.Features.CheckIns;
using Microsoft.Extensions.DependencyInjection;

namespace HabitForge.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);
        services.AddScoped<RegistrarUsuario>();
        services.AddScoped<IniciarSesion>();
        services.AddSingleton(TimeProvider.System);
        services.AddScoped<CheckInsDiarios>();

        return services;
    }
}
