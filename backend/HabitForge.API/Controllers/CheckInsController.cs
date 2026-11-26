using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using HabitForge.Application.Features.CheckIns;
using HabitForge.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HabitForge.API.Controllers;

[ApiController]
[Authorize(Roles = nameof(RolUsuario.Jugador))]
[Route("api/check-ins/hoy")]
[ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
public sealed class CheckInsController(CheckInsDiarios checkIns) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Consultar(CancellationToken cancellationToken)
    {
        if (!ObtenerUsuarioId(out var usuarioId)) return Unauthorized();

        return Ok(await checkIns.ConsultarAsync(usuarioId, cancellationToken));
    }

    [HttpPost("{habitoId:int:min(1)}")]
    public async Task<IActionResult> Registrar(int habitoId, CancellationToken cancellationToken)
    {
        if (!ObtenerUsuarioId(out var usuarioId)) return Unauthorized();

        var registro = await checkIns.RegistrarAsync(usuarioId, habitoId, cancellationToken);
        return registro.Resultado switch
        {
            ResultadoCheckIn.Registrado when registro.Cupones.Length > 0 => Ok(registro.Cupones),
            ResultadoCheckIn.Registrado => NoContent(),
            ResultadoCheckIn.Duplicado => Conflict(new ProblemDetails
            {
                Status = StatusCodes.Status409Conflict,
                Title = "Este hábito ya está completado hoy."
            }),
            _ => NotFound()
        };
    }

    private bool ObtenerUsuarioId(out int usuarioId) =>
        int.TryParse(User.FindFirstValue(JwtRegisteredClaimNames.Sub), NumberStyles.None,
            CultureInfo.InvariantCulture, out usuarioId) && usuarioId > 0;
}
