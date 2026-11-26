using HabitForge.Application.Features.Cupones;
using HabitForge.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace HabitForge.Infrastructure.Repositories;

public sealed class ConsultaMisPremios(HabitForgeDbContext context) : IConsultaMisPremios
{
    public Task<PremioObtenido[]> ListarAsync(int usuarioId, CancellationToken cancellationToken) =>
        (from cupon in context.Cupones
         where cupon.UsuarioId == usuarioId
         join recompensa in context.Recompensas on cupon.RecompensaId equals recompensa.Id
         orderby cupon.ObtenidoEn descending, cupon.Id descending
         select new PremioObtenido(cupon.Id, recompensa.Titulo, recompensa.Habito.Nombre, cupon.ObtenidoEn))
        .ToArrayAsync(cancellationToken);
}
