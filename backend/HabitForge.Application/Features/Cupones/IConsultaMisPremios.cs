namespace HabitForge.Application.Features.Cupones;

public sealed record PremioObtenido(int Id, string TituloRecompensa, string HabitoAsociado, DateTimeOffset ObtenidoEn);

public interface IConsultaMisPremios
{
    Task<PremioObtenido[]> ListarAsync(int usuarioId, CancellationToken cancellationToken);
}
