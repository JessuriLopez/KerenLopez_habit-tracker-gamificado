using HabitForge.Application.Interfaces;
using HabitForge.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace HabitForge.Infrastructure.Security;

public sealed class HashContrasena(IPasswordHasher<Usuario> passwordHasher) : IHashContrasena
{
    public string Generar(Usuario usuario, string contrasena) =>
        passwordHasher.HashPassword(usuario, contrasena);

    public bool Verificar(Usuario usuario, string contrasena) =>
        passwordHasher.VerifyHashedPassword(usuario, usuario.HashContrasena, contrasena)
        != PasswordVerificationResult.Failed;
}
