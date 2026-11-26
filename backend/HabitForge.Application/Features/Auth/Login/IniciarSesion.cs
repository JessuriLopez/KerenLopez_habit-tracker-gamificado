using HabitForge.Application.Interfaces;

namespace HabitForge.Application.Features.Auth.Login;

public sealed class IniciarSesion(
    IUsuarioRepository usuarios, IHashContrasena hashContrasena, IGeneradorToken tokens)
{
    public async Task<LoginResponse?> EjecutarAsync(LoginRequest solicitud, CancellationToken cancellationToken)
    {
        var correo = solicitud.Correo?.Trim().ToLowerInvariant();
        if (string.IsNullOrEmpty(correo) || correo.Length > 254 ||
            string.IsNullOrEmpty(solicitud.Contrasena) || solicitud.Contrasena.Length > 128)
        {
            return null;
        }

        var usuario = await usuarios.BuscarPorCorreoAsync(correo, cancellationToken);
        if (usuario is null || !hashContrasena.Verificar(usuario, solicitud.Contrasena))
        {
            return null;
        }

        return tokens.Generar(usuario);
    }
}
