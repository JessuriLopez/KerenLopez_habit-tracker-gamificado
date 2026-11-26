using HabitForge.Application.Interfaces;
using HabitForge.Domain.Entities;

namespace HabitForge.Application.Features.CheckIns;

public sealed record CheckInsDeHoy(DateOnly Fecha, DateTimeOffset CambiaEn, int[] HabitosCompletados);

public sealed class CheckInsDiarios(
    ICumplimientoDiarioRepository cumplimientos, IHabitoRepository habitos, TimeProvider reloj)
{
    private static readonly TimeZoneInfo ZonaHonduras = TimeZoneInfo.FindSystemTimeZoneById("America/Tegucigalpa");

    private DateOnly FechaActual() => DateOnly.FromDateTime(TimeZoneInfo.ConvertTime(reloj.GetUtcNow(), ZonaHonduras).DateTime);

    public async Task<CheckInsDeHoy> ConsultarAsync(int usuarioId, CancellationToken cancellationToken)
    {
        var fecha = FechaActual();
        var siguienteMedianoche = fecha.AddDays(1).ToDateTime(TimeOnly.MinValue);
        var cambiaEn = TimeZoneInfo.ConvertTimeToUtc(siguienteMedianoche, ZonaHonduras);
        var completados = await cumplimientos.ObtenerHabitosCompletadosAsync(usuarioId, fecha, cancellationToken);
        return new CheckInsDeHoy(fecha, cambiaEn, completados);
    }

    public async Task<ResultadoCheckIn> RegistrarAsync(int usuarioId, int habitoId, CancellationToken cancellationToken)
    {
        var cumplimiento = new CumplimientoDiario { UsuarioId = usuarioId, HabitoId = habitoId, Fecha = FechaActual() };
        if (await cumplimientos.ExisteAsync(cumplimiento, cancellationToken))
        {
            return ResultadoCheckIn.Duplicado;
        }

        if (await habitos.GetByIdAsync(habitoId) is null)
        {
            return ResultadoCheckIn.HabitoNoEncontrado;
        }

        return await cumplimientos.AgregarAsync(cumplimiento, cancellationToken);
    }
}
