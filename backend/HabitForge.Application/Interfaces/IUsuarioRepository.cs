using HabitForge.Domain.Entities;

namespace HabitForge.Application.Interfaces;

public interface IUsuarioRepository
{
    Task<bool> IntentarAgregarAsync(Usuario usuario, CancellationToken cancellationToken);
    Task<Usuario?> BuscarPorCorreoAsync(string correo, CancellationToken cancellationToken);
}
