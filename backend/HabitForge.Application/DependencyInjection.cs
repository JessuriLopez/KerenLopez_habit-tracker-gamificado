using FluentValidation;
using HabitForge.Application.Features.Auth.Login;
using HabitForge.Application.Features.Auth.Registro;
using Microsoft.Extensions.DependencyInjection;

namespace HabitForge.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);
        services.AddScoped<RegistrarUsuario>();
        services.AddScoped<IniciarSesion>();

        return services;
    }
}
