using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using HabitForge.Application.Features.Cupones;
using HabitForge.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HabitForge.API.Controllers;

[ApiController]
[Authorize(Roles = nameof(RolUsuario.Jugador))]
[Route("api/cupones")]
public sealed class CuponesController(IConsultaMisPremios premios) : ControllerBase
{
    [HttpGet("mis-premios")]
    [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
    public async Task<IActionResult> MisPremios(CancellationToken cancellationToken)
    {
        if (!int.TryParse(User.FindFirstValue(JwtRegisteredClaimNames.Sub), NumberStyles.None,
            CultureInfo.InvariantCulture, out var usuarioId) || usuarioId <= 0)
        {
            return Unauthorized();
        }

        return Ok(await premios.ListarAsync(usuarioId, cancellationToken));
    }
}
