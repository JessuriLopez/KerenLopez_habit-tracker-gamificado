using HabitForge.Domain.Entities;

namespace HabitForge.Application.Interfaces;

public interface IHashContrasena
{
    string Generar(Usuario usuario, string contrasena);
}
