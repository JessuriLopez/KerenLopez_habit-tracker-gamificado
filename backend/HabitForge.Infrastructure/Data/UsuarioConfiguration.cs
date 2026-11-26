using HabitForge.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HabitForge.Infrastructure.Data;

public sealed class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
{
    internal const string IndiceCorreoUnico = "IX_Usuarios_Correo";

    public void Configure(EntityTypeBuilder<Usuario> builder)
    {
        builder.ToTable("Usuarios", tabla =>
            tabla.HasCheckConstraint("CK_Usuarios_Rol", "\"Rol\" IN ('Jugador', 'GameMaster')"));
        builder.Property(usuario => usuario.Nombre).HasMaxLength(100);
        builder.Property(usuario => usuario.Correo).HasMaxLength(254);
        builder.Property(usuario => usuario.Rol).HasConversion<string>().HasMaxLength(10);
        builder.HasIndex(usuario => usuario.Correo).IsUnique().HasDatabaseName(IndiceCorreoUnico);
    }
}
