namespace HabitForge.Domain.Entities;

public sealed class Cupon
{
    public int Id { get; set; }
    public int UsuarioId { get; init; }
    public int RecompensaId { get; init; }
    public DateTimeOffset ObtenidoEn { get; init; }
}
