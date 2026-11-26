using HabitForge.Application.Features.Auth.Login;
using HabitForge.Domain.Entities;

namespace HabitForge.Application.Interfaces;

public interface IGeneradorToken
{
    LoginResponse Generar(Usuario usuario);
}
