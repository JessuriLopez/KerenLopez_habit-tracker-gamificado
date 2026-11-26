using HabitForge.Application.Interfaces;
using HabitForge.Domain.Entities;

namespace HabitForge.Application.Features.Auth.Registro;

public sealed class RegistrarUsuario(IUsuarioRepository usuarios, IHashContrasena hashContrasena)
{
    public async Task<UsuarioRegistradoResponse?> EjecutarAsync(
        RegistrarUsuarioRequest solicitud, CancellationToken cancellationToken)
    {
        var usuario = new Usuario
        {
            Nombre = solicitud.Nombre.Trim(),
            Correo = solicitud.Correo.Trim().ToLowerInvariant(),
            Rol = RolUsuario.Jugador
        };

        usuario.HashContrasena = hashContrasena.Generar(usuario, solicitud.Contrasena);

        if (!await usuarios.IntentarAgregarAsync(usuario, cancellationToken))
        {
            return null;
        }

        return new UsuarioRegistradoResponse(usuario.Id, usuario.Nombre, usuario.Correo, usuario.Rol.ToString());
    }
}
