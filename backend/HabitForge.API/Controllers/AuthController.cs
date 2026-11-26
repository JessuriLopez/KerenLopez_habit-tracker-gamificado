using FluentValidation;
using HabitForge.Application.Features.Auth.Registro;
using Microsoft.AspNetCore.Mvc;

namespace HabitForge.API.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(
    IValidator<RegistrarUsuarioRequest> validator,
    RegistrarUsuario registrarUsuario) : ControllerBase
{
    [HttpPost("registro")]
    public async Task<IActionResult> Registrar(
        [FromBody] RegistrarUsuarioRequest solicitud, CancellationToken cancellationToken)
    {
        var validacion = await validator.ValidateAsync(solicitud, cancellationToken);
        if (!validacion.IsValid)
        {
            return ValidationProblem(new ValidationProblemDetails(validacion.ToDictionary()) { Status = 400 });
        }

        var usuario = await registrarUsuario.EjecutarAsync(solicitud, cancellationToken);
        if (usuario is null)
        {
            return Conflict(new ProblemDetails { Status = 409, Title = "El correo electrónico ya está registrado." });
        }

        return StatusCode(StatusCodes.Status201Created, usuario);
    }
}
