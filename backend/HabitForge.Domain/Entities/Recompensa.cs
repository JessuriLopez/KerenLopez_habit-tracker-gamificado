namespace HabitForge.Domain.Entities;

public sealed class Recompensa
{
    public int Id { get; set; }
    public required string Titulo { get; set; }
    public int HabitoId { get; set; }
    public HabitoGlobal Habito { get; private set; } = null!;
    public int DiasRequeridos { get; set; }
    public int Stock { get; set; }
}
