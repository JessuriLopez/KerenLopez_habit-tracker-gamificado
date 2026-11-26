namespace HabitForge.Domain.Entities;

public sealed class CumplimientoDiario
{
    public int UsuarioId { get; init; }
    public int HabitoId { get; init; }
    public DateOnly Fecha { get; init; }
}
