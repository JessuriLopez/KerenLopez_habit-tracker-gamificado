using HabitForge.Application.Interfaces;
using HabitForge.Domain.Entities;
using HabitForge.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace HabitForge.Infrastructure.Repositories;

public sealed class UsuarioRepository(HabitForgeDbContext context) : IUsuarioRepository
{
    public Task<Usuario?> BuscarPorCorreoAsync(string correo, CancellationToken cancellationToken) =>
        context.Usuarios.AsNoTracking().SingleOrDefaultAsync(usuario => usuario.Correo == correo, cancellationToken);

    public async Task<bool> IntentarAgregarAsync(Usuario usuario, CancellationToken cancellationToken)
    {
        context.Usuarios.Add(usuario);

        try
        {
            await context.SaveChangesAsync(cancellationToken);
            return true;
        }
        catch (DbUpdateException error) when (error.InnerException is PostgresException
            { SqlState: PostgresErrorCodes.UniqueViolation, ConstraintName: UsuarioConfiguration.IndiceCorreoUnico })
        {
            context.Entry(usuario).State = EntityState.Detached;
            return false;
        }
    }
}
