namespace HabitForge.Application.Features.Auth.Login;

public sealed record LoginResponse(string Token, DateTimeOffset ExpiraEn, UsuarioAutenticado Usuario);

public sealed record UsuarioAutenticado(int Id, string Nombre, string Rol);
