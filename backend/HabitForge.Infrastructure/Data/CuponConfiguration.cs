using HabitForge.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HabitForge.Infrastructure.Data;

internal sealed class CuponConfiguration : IEntityTypeConfiguration<Cupon>
{
    internal const string ClaveRecompensa = "FK_Cupones_Recompensas_RecompensaId";

    public void Configure(EntityTypeBuilder<Cupon> builder)
    {
        builder.ToTable("Cupones");
        builder.HasIndex(cupon => new { cupon.UsuarioId, cupon.RecompensaId }).IsUnique();
        builder.HasOne<Usuario>().WithMany().HasForeignKey(cupon => cupon.UsuarioId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<Recompensa>().WithMany().HasForeignKey(cupon => cupon.RecompensaId)
            .HasConstraintName(ClaveRecompensa).OnDelete(DeleteBehavior.Restrict);
    }
}
