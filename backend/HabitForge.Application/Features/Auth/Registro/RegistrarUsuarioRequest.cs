namespace HabitForge.Application.Features.Auth.Registro;

public sealed class RegistrarUsuarioRequest
{
    public string Nombre { get; init; } = string.Empty;
    public string Correo { get; init; } = string.Empty;
    public string Contrasena { get; init; } = string.Empty;
}
