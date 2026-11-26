using HabitForge.Application.Features.CheckIns;
using HabitForge.Domain.Entities;
using HabitForge.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace HabitForge.Infrastructure.Repositories;

public sealed class CumplimientoDiarioRepository(HabitForgeDbContext context) : ICumplimientoDiarioRepository
{
    public async Task<T> EnTransaccionAsync<T>(Func<Task<T>> operacion, CancellationToken cancellationToken)
    {
        await using var transaccion = await context.Database.BeginTransactionAsync(cancellationToken);
        var resultado = await operacion();
        await transaccion.CommitAsync(cancellationToken);
        return resultado;
    }

    public async Task<bool> BloquearHabitoAsync(int habitoId, CancellationToken cancellationToken) =>
        (await context.Database.SqlQuery<int>($"""
            SELECT "Id" FROM "HabitosGlobales" WHERE "Id" = {habitoId} FOR NO KEY UPDATE
            """).ToListAsync(cancellationToken)).Count == 1;

    public Task<CumplimientoDiario[]> ObtenerHistorialAsync(int usuarioId, DateOnly fecha, int? habitoId,
        CancellationToken cancellationToken) => context.CumplimientosDiarios.AsNoTracking()
        .Where(registro => registro.UsuarioId == usuarioId && registro.Fecha <= fecha &&
            (!habitoId.HasValue || registro.HabitoId == habitoId.Value))
        .OrderByDescending(registro => registro.Fecha).ToArrayAsync(cancellationToken);

    public Task<MetaRecompensa[]> ObtenerMetasAsync(int usuarioId, int? habitoId, CancellationToken cancellationToken) =>
        context.Recompensas.Where(meta => !habitoId.HasValue || meta.HabitoId == habitoId.Value)
            .OrderBy(meta => meta.Id)
            .Select(meta => new MetaRecompensa(meta.Id, meta.HabitoId, meta.Titulo, meta.DiasRequeridos, meta.Stock,
                context.Cupones.Any(cupon => cupon.UsuarioId == usuarioId && cupon.RecompensaId == meta.Id)))
            .ToArrayAsync(cancellationToken);

    public async Task<CuponDesbloqueado?> IntentarEmitirAsync(int usuarioId, MetaRecompensa meta, int racha,
        DateTimeOffset obtenidoEn, CancellationToken cancellationToken)
    {
        // Bloquea la recompensa antes de comprobar el cupón y el stock con datos actualizados.
        var bloqueada = await context.Database.SqlQuery<int>($"""
            SELECT "Id" FROM "Recompensas" WHERE "Id" = {meta.Id} FOR UPDATE
            """).ToListAsync(cancellationToken);
        if (bloqueada.Count == 0 || await context.Cupones.AnyAsync(cupon => cupon.UsuarioId == usuarioId &&
                cupon.RecompensaId == meta.Id, cancellationToken)) return null;

        var actual = await context.Recompensas.AsNoTracking().SingleAsync(recompensa => recompensa.Id == meta.Id, cancellationToken);
        if (actual.HabitoId != meta.HabitoId || actual.DiasRequeridos > racha || actual.Stock <= 0) return null;

        await context.Recompensas.Where(recompensa => recompensa.Id == meta.Id)
            .ExecuteUpdateAsync(cambios => cambios.SetProperty(recompensa => recompensa.Stock,
                recompensa => recompensa.Stock - 1), cancellationToken);
        var nuevo = new Cupon { UsuarioId = usuarioId, RecompensaId = meta.Id, ObtenidoEn = obtenidoEn };
        context.Cupones.Add(nuevo);
        await context.SaveChangesAsync(cancellationToken);
        return new CuponDesbloqueado(nuevo.Id, actual.Titulo);
    }

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
