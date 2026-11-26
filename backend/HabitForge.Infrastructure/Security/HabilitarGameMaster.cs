using HabitForge.Domain.Entities;
using HabitForge.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace HabitForge.Infrastructure.Security;

public static class HabilitarGameMaster
{
    public static async Task<bool> EjecutarAsync(HabitForgeDbContext context, string correo)
    {
        var correoNormalizado = correo.Trim().ToLowerInvariant();
        return await context.Usuarios
            .Where(usuario => usuario.Correo == correoNormalizado)
            .ExecuteUpdateAsync(cambios => cambios.SetProperty(usuario => usuario.Rol, RolUsuario.GameMaster)) == 1;
    }
}
