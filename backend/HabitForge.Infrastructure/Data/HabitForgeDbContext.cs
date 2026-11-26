using Microsoft.EntityFrameworkCore;
using HabitForge.Domain.Entities;

namespace HabitForge.Infrastructure.Data;

public class HabitForgeDbContext : DbContext
{
    public HabitForgeDbContext(DbContextOptions<HabitForgeDbContext> options)
        : base(options)
    {
    }

    public DbSet<HabitoGlobal> HabitosGlobales { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<CumplimientoDiario> CumplimientosDiarios { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new UsuarioConfiguration());
        modelBuilder.ApplyConfiguration(new CumplimientoDiarioConfiguration());
    }
}
