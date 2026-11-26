using HabitForge.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HabitForge.Infrastructure.Data;

internal sealed class CumplimientoDiarioConfiguration : IEntityTypeConfiguration<CumplimientoDiario>
{
    internal const string ClaveCumplimiento = "PK_CumplimientosDiarios";
    internal const string ClaveHabito = "FK_CumplimientosDiarios_HabitosGlobales_HabitoId";

    public void Configure(EntityTypeBuilder<CumplimientoDiario> builder)
    {
        builder.ToTable("CumplimientosDiarios");
        builder.HasKey(registro => new { registro.UsuarioId, registro.Fecha, registro.HabitoId }).HasName(ClaveCumplimiento);
        builder.HasOne<Usuario>().WithMany().HasForeignKey(registro => registro.UsuarioId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<HabitoGlobal>().WithMany().HasForeignKey(registro => registro.HabitoId)
            .HasConstraintName(ClaveHabito).OnDelete(DeleteBehavior.Restrict);
    }
}
