using HabitForge.Application.Interfaces;
using HabitForge.Domain.Entities;

namespace HabitForge.Application.Features.Recompensas;

public sealed record ResultadoRecompensa(EstadoGuardadoRecompensa Estado, RecompensaResponse? Recompensa = null);

public sealed class GestionarRecompensas(IRecompensaRepository recompensas, IHabitoRepository habitos)
{
    public async Task<ResultadoRecompensa> GuardarAsync(
        int? id, RecompensaRequest datos, CancellationToken cancellationToken)
    {
        var recompensa = id.HasValue
            ? await recompensas.BuscarAsync(id.Value, cancellationToken)
            : new Recompensa { Titulo = string.Empty };
        if (recompensa is null) return new(EstadoGuardadoRecompensa.RecompensaInexistente);

        var habito = await habitos.GetByIdAsync(datos.HabitoId!.Value);
        if (habito is null) return new(EstadoGuardadoRecompensa.HabitoInexistente);

        recompensa.Titulo = datos.Titulo!.Trim();
        recompensa.HabitoId = habito.Id;
        recompensa.DiasRequeridos = datos.DiasRequeridos!.Value;
        recompensa.Stock = datos.Stock!.Value;

        var estado = await recompensas.GuardarAsync(recompensa, cancellationToken);
        return estado == EstadoGuardadoRecompensa.Guardada
            ? new(estado, new RecompensaResponse(recompensa.Id, recompensa.Titulo, habito.Id, habito.Nombre,
                recompensa.DiasRequeridos, recompensa.Stock))
            : new(estado);
    }
}
