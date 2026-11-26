using HabitForge.Application.Features.CheckIns;
using HabitForge.Domain.Entities;
using HabitForge.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace HabitForge.Infrastructure.Repositories;

public sealed class CumplimientoDiarioRepository(HabitForgeDbContext context) : ICumplimientoDiarioRepository
{
    public Task<int[]> ObtenerHabitosCompletadosAsync(int usuarioId, DateOnly fecha, CancellationToken cancellationToken) =>
        context.CumplimientosDiarios.Where(registro => registro.UsuarioId == usuarioId && registro.Fecha == fecha)
            .Select(registro => registro.HabitoId).ToArrayAsync(cancellationToken);

    public Task<bool> ExisteAsync(CumplimientoDiario cumplimiento, CancellationToken cancellationToken) =>
        context.CumplimientosDiarios.AnyAsync(registro => registro.UsuarioId == cumplimiento.UsuarioId &&
            registro.HabitoId == cumplimiento.HabitoId && registro.Fecha == cumplimiento.Fecha, cancellationToken);

    public async Task<ResultadoCheckIn> AgregarAsync(CumplimientoDiario cumplimiento, CancellationToken cancellationToken)
    {
        context.CumplimientosDiarios.Add(cumplimiento);
        try
        {
            await context.SaveChangesAsync(cancellationToken);
            return ResultadoCheckIn.Registrado;
        }
        catch (DbUpdateException error) when (error.InnerException is PostgresException
            { SqlState: PostgresErrorCodes.UniqueViolation, ConstraintName: CumplimientoDiarioConfiguration.ClaveCumplimiento })
        {
            context.Entry(cumplimiento).State = EntityState.Detached;
            return ResultadoCheckIn.Duplicado;
        }
        catch (DbUpdateException error) when (error.InnerException is PostgresException
            { SqlState: PostgresErrorCodes.ForeignKeyViolation, ConstraintName: CumplimientoDiarioConfiguration.ClaveHabito })
        {
            context.Entry(cumplimiento).State = EntityState.Detached;
            return ResultadoCheckIn.HabitoNoEncontrado;
        }
    }
}
