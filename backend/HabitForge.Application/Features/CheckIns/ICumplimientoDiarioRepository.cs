using HabitForge.Domain.Entities;

namespace HabitForge.Application.Features.CheckIns;

public interface ICumplimientoDiarioRepository
{
    Task<T> EnTransaccionAsync<T>(Func<Task<T>> operacion, CancellationToken cancellationToken);
    Task<bool> BloquearHabitoAsync(int habitoId, CancellationToken cancellationToken);
    Task<CumplimientoDiario[]> ObtenerHistorialAsync(int usuarioId, DateOnly fecha, int? habitoId, CancellationToken cancellationToken);
    Task<MetaRecompensa[]> ObtenerMetasAsync(int usuarioId, int? habitoId, CancellationToken cancellationToken);
    Task<CuponDesbloqueado?> IntentarEmitirAsync(int usuarioId, MetaRecompensa meta, int racha,
        DateTimeOffset obtenidoEn, CancellationToken cancellationToken);
    Task<bool> ExisteAsync(CumplimientoDiario cumplimiento, CancellationToken cancellationToken);
    Task<ResultadoCheckIn> AgregarAsync(CumplimientoDiario cumplimiento, CancellationToken cancellationToken);
}

public enum ResultadoCheckIn
{
    Registrado,
    Duplicado,
    HabitoNoEncontrado
}
