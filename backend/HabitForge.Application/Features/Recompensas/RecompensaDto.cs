namespace HabitForge.Application.Features.Recompensas;

public sealed record RecompensaRequest(string? Titulo, int? HabitoId, int? DiasRequeridos, int? Stock, uint? Version);

public sealed record RecompensaResponse(int Id, string Titulo, int HabitoId, string HabitoNombre, int DiasRequeridos, int Stock, uint Version);
