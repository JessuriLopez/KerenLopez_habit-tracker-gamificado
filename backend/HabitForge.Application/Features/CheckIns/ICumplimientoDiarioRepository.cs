using HabitForge.Domain.Entities;

namespace HabitForge.Application.Features.CheckIns;

public interface ICumplimientoDiarioRepository
{
    Task<int[]> ObtenerHabitosCompletadosAsync(int usuarioId, DateOnly fecha, CancellationToken cancellationToken);
    Task<bool> ExisteAsync(CumplimientoDiario cumplimiento, CancellationToken cancellationToken);
    Task<ResultadoCheckIn> AgregarAsync(CumplimientoDiario cumplimiento, CancellationToken cancellationToken);
}

public enum ResultadoCheckIn
{
    Registrado,
    Duplicado,
    HabitoNoEncontrado
}
