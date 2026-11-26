namespace HabitForge.Domain.Entities;

public class Usuario
{
    public int Id { get; set; }
    public required string Nombre { get; init; }
    public required string Correo { get; init; }
    public string HashContrasena { get; set; } = string.Empty;
    public RolUsuario Rol { get; init; } = RolUsuario.Jugador;
}
