namespace HabitForge.Application.Features.CheckIns;

public sealed record MetaRecompensa(int Id, int HabitoId, string Titulo, int DiasRequeridos, int Stock, bool Obtenida);
public sealed record ProgresoHabito(int HabitoId, int Racha, MetaRecompensa[] Recompensas);
public sealed record CuponDesbloqueado(int Id, string Titulo);
public sealed record RegistroCheckIn(ResultadoCheckIn Resultado, CuponDesbloqueado[] Cupones);

public static class Gamificacion
{
    public static int CalcularRacha(IEnumerable<DateOnly> fechasDescendentes, DateOnly fechaFinal)
    {
        var racha = 0;
        foreach (var fecha in fechasDescendentes)
        {
            if (fecha != fechaFinal.AddDays(-racha)) break;
            racha++;
        }

        return racha;
    }
}
