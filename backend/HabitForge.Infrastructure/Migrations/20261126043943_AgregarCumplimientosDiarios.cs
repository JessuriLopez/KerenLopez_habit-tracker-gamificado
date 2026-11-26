using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HabitForge.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AgregarCumplimientosDiarios : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CumplimientosDiarios",
                columns: table => new
                {
                    UsuarioId = table.Column<int>(type: "integer", nullable: false),
                    HabitoId = table.Column<int>(type: "integer", nullable: false),
                    Fecha = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CumplimientosDiarios", x => new { x.UsuarioId, x.Fecha, x.HabitoId });
                    table.ForeignKey(
                        name: "FK_CumplimientosDiarios_HabitosGlobales_HabitoId",
                        column: x => x.HabitoId,
                        principalTable: "HabitosGlobales",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CumplimientosDiarios_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CumplimientosDiarios_HabitoId",
                table: "CumplimientosDiarios",
                column: "HabitoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CumplimientosDiarios");
        }
    }
}
