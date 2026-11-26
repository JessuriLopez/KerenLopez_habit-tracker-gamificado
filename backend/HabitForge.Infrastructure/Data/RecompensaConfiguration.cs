using HabitForge.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HabitForge.Infrastructure.Data;

internal sealed class RecompensaConfiguration : IEntityTypeConfiguration<Recompensa>
{
    internal const string ClaveHabito = "FK_Recompensas_HabitosGlobales_HabitoId";

    public void Configure(EntityTypeBuilder<Recompensa> builder)
    {
        builder.ToTable("Recompensas", tabla =>
        {
            tabla.HasCheckConstraint("CK_Recompensas_Titulo", "length(btrim(\"Titulo\")) > 0");
            tabla.HasCheckConstraint("CK_Recompensas_DiasRequeridos", "\"DiasRequeridos\" > 0");
            tabla.HasCheckConstraint("CK_Recompensas_Stock", "\"Stock\" >= 0");
        });
        builder.HasOne(recompensa => recompensa.Habito).WithMany().HasForeignKey(recompensa => recompensa.HabitoId)
            .HasConstraintName(ClaveHabito).OnDelete(DeleteBehavior.Restrict);
    }
}
