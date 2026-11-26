namespace HabitForge.Application.Features.Recompensas;

public sealed record RecompensaRequest(string? Titulo, int? HabitoId, int? DiasRequeridos, int? Stock);

public sealed record RecompensaResponse(int Id, string Titulo, int HabitoId, string HabitoNombre, int DiasRequeridos, int Stock);
