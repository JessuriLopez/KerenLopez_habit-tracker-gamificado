using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HabitForge.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class MapearVersionRecompensa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // xmin ya existe en PostgreSQL. Esta migración solo registra su mapeo en EF Core.
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Al revertir el mapeo se conserva la columna de sistema.
        }
    }
}
