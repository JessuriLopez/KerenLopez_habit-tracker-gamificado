using HabitForge.Domain.Entities;

namespace HabitForge.Application.Features.Recompensas;

public enum EstadoGuardadoRecompensa { Guardada, HabitoInexistente, RecompensaInexistente, VersionDesactualizada }
public enum EstadoBorradoRecompensa { Eliminada, Inexistente, TieneCupones }

public interface IRecompensaRepository
{
    Task<RecompensaResponse[]> ListarAsync(CancellationToken cancellationToken);
    Task<RecompensaResponse?> ConsultarAsync(int id, CancellationToken cancellationToken);
    Task<Recompensa?> BuscarAsync(int id, CancellationToken cancellationToken);
    Task<EstadoGuardadoRecompensa> GuardarAsync(Recompensa recompensa, CancellationToken cancellationToken);
    Task<EstadoBorradoRecompensa> EliminarAsync(int id, CancellationToken cancellationToken);
}
