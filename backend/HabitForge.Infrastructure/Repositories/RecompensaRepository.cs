using System.Linq.Expressions;
using HabitForge.Application.Features.Recompensas;
using HabitForge.Domain.Entities;
using HabitForge.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace HabitForge.Infrastructure.Repositories;

public sealed class RecompensaRepository(HabitForgeDbContext context) : IRecompensaRepository
{
    private static readonly Expression<Func<Recompensa, RecompensaResponse>> Proyeccion = recompensa =>
        new RecompensaResponse(recompensa.Id, recompensa.Titulo, recompensa.HabitoId, recompensa.Habito.Nombre,
            recompensa.DiasRequeridos, recompensa.Stock);

    public Task<RecompensaResponse[]> ListarAsync(CancellationToken cancellationToken) =>
        context.Recompensas.OrderBy(recompensa => recompensa.Id).Select(Proyeccion).ToArrayAsync(cancellationToken);

    public Task<RecompensaResponse?> ConsultarAsync(int id, CancellationToken cancellationToken) =>
        context.Recompensas.Where(recompensa => recompensa.Id == id).Select(Proyeccion).SingleOrDefaultAsync(cancellationToken);

    public Task<Recompensa?> BuscarAsync(int id, CancellationToken cancellationToken) =>
        context.Recompensas.SingleOrDefaultAsync(recompensa => recompensa.Id == id, cancellationToken);

    public async Task<EstadoGuardadoRecompensa> GuardarAsync(Recompensa recompensa, CancellationToken cancellationToken)
    {
        if (recompensa.Id == 0) context.Recompensas.Add(recompensa);

        try
        {
            await context.SaveChangesAsync(cancellationToken);
            return EstadoGuardadoRecompensa.Guardada;
        }
        catch (DbUpdateConcurrencyException)
        {
            return EstadoGuardadoRecompensa.RecompensaInexistente;
        }
        catch (DbUpdateException error) when (error.InnerException is PostgresException
            { SqlState: PostgresErrorCodes.ForeignKeyViolation, ConstraintName: RecompensaConfiguration.ClaveHabito })
        {
            return EstadoGuardadoRecompensa.HabitoInexistente;
        }
    }

    public async Task<bool> EliminarAsync(int id, CancellationToken cancellationToken) =>
        await context.Recompensas.Where(recompensa => recompensa.Id == id).ExecuteDeleteAsync(cancellationToken) == 1;
}
