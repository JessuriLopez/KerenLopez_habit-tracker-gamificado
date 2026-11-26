using HabitForge.Domain.Entities;

namespace HabitForge.Application.Features.CheckIns;

public sealed record CheckInsDeHoy(DateOnly Fecha, DateTimeOffset CambiaEn, int[] HabitosCompletados, ProgresoHabito[] Progreso);

public sealed class CheckInsDiarios(ICumplimientoDiarioRepository cumplimientos, TimeProvider reloj)
{
    private static readonly TimeZoneInfo ZonaHonduras = TimeZoneInfo.FindSystemTimeZoneById("America/Tegucigalpa");

    private static DateOnly FechaEnHonduras(DateTimeOffset instante) =>
        DateOnly.FromDateTime(TimeZoneInfo.ConvertTime(instante, ZonaHonduras).DateTime);

    public async Task<CheckInsDeHoy> ConsultarAsync(int usuarioId, CancellationToken cancellationToken)
    {
        var fecha = FechaEnHonduras(reloj.GetUtcNow());
        var siguienteMedianoche = fecha.AddDays(1).ToDateTime(TimeOnly.MinValue);
        var cambiaEn = TimeZoneInfo.ConvertTimeToUtc(siguienteMedianoche, ZonaHonduras);
        var historial = await cumplimientos.ObtenerHistorialAsync(usuarioId, fecha, null, cancellationToken);
        var metas = await cumplimientos.ObtenerMetasAsync(usuarioId, null, cancellationToken);
        var porHabito = historial.ToLookup(registro => registro.HabitoId, registro => registro.Fecha);
        var metasPorHabito = metas.ToLookup(meta => meta.HabitoId);
        var completados = historial.Where(registro => registro.Fecha == fecha).Select(registro => registro.HabitoId).ToArray();
        var progreso = porHabito.Select(grupo => grupo.Key).Union(metasPorHabito.Select(grupo => grupo.Key)).Select(id =>
            new ProgresoHabito(id, Gamificacion.CalcularRacha(porHabito[id],
                porHabito[id].FirstOrDefault() == fecha ? fecha : fecha.AddDays(-1)), metasPorHabito[id].ToArray())).ToArray();
        return new CheckInsDeHoy(fecha, cambiaEn, completados, progreso);
    }

    public Task<RegistroCheckIn> RegistrarAsync(int usuarioId, int habitoId, CancellationToken cancellationToken)
    {
        var ahora = reloj.GetUtcNow();
        var cumplimiento = new CumplimientoDiario { UsuarioId = usuarioId, HabitoId = habitoId, Fecha = FechaEnHonduras(ahora) };
        return cumplimientos.EnTransaccionAsync<RegistroCheckIn>(async () =>
        {
            if (!await cumplimientos.BloquearHabitoAsync(habitoId, cancellationToken))
                return new(ResultadoCheckIn.HabitoNoEncontrado, []);
            if (await cumplimientos.ExisteAsync(cumplimiento, cancellationToken))
                return new(ResultadoCheckIn.Duplicado, []);

            var resultado = await cumplimientos.AgregarAsync(cumplimiento, cancellationToken);
            if (resultado != ResultadoCheckIn.Registrado) return new(resultado, []);

            var historial = await cumplimientos.ObtenerHistorialAsync(usuarioId, cumplimiento.Fecha, habitoId, cancellationToken);
            var racha = Gamificacion.CalcularRacha(historial.Select(registro => registro.Fecha), cumplimiento.Fecha);
            var metas = await cumplimientos.ObtenerMetasAsync(usuarioId, habitoId, cancellationToken);
            var emitidos = new List<CuponDesbloqueado>();
            foreach (var meta in metas.Where(meta => !meta.Obtenida && meta.DiasRequeridos <= racha))
            {
                var cupon = await cumplimientos.IntentarEmitirAsync(usuarioId, meta, racha, ahora, cancellationToken);
                if (cupon is not null) emitidos.Add(cupon);
            }

            return new(resultado, emitidos.ToArray());
        }, cancellationToken);
    }
}
