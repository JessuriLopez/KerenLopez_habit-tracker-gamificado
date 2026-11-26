using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace HabitForge.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AgregarRecompensas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Recompensas",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Titulo = table.Column<string>(type: "text", nullable: false),
                    HabitoId = table.Column<int>(type: "integer", nullable: false),
                    DiasRequeridos = table.Column<int>(type: "integer", nullable: false),
                    Stock = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Recompensas", x => x.Id);
                    table.CheckConstraint("CK_Recompensas_DiasRequeridos", "\"DiasRequeridos\" > 0");
                    table.CheckConstraint("CK_Recompensas_Stock", "\"Stock\" >= 0");
                    table.CheckConstraint("CK_Recompensas_Titulo", "length(btrim(\"Titulo\")) > 0");
                    table.ForeignKey(
                        name: "FK_Recompensas_HabitosGlobales_HabitoId",
                        column: x => x.HabitoId,
                        principalTable: "HabitosGlobales",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Recompensas_HabitoId",
                table: "Recompensas",
                column: "HabitoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Recompensas");
        }
    }
}
