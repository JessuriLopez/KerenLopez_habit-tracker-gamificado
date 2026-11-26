using FluentValidation;
using HabitForge.Application.Features.Recompensas;
using HabitForge.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HabitForge.API.Controllers;

[ApiController]
[Authorize(Roles = nameof(RolUsuario.GameMaster))]
[Route("api/recompensas")]
[ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
public sealed class RecompensasController(IRecompensaRepository recompensas, GestionarRecompensas gestionar,
    IValidator<RecompensaRequest> validator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Listar(CancellationToken cancellationToken) =>
        Ok(await recompensas.ListarAsync(cancellationToken));

    [HttpGet("{id:int:min(1)}")]
    public async Task<IActionResult> Consultar(int id, CancellationToken cancellationToken)
    {
        var recompensa = await recompensas.ConsultarAsync(id, cancellationToken);
        return recompensa is null ? NotFound() : Ok(recompensa);
    }

    [HttpPost]
    public Task<IActionResult> Crear(RecompensaRequest datos, CancellationToken cancellationToken) =>
        Guardar(null, datos, cancellationToken);

    [HttpPut("{id:int:min(1)}")]
    public Task<IActionResult> Actualizar(int id, RecompensaRequest datos, CancellationToken cancellationToken) =>
        Guardar(id, datos, cancellationToken);

    [HttpDelete("{id:int:min(1)}")]
    public async Task<IActionResult> Eliminar(int id, CancellationToken cancellationToken) =>
        await recompensas.EliminarAsync(id, cancellationToken) switch
        {
            EstadoBorradoRecompensa.Eliminada => NoContent(),
            EstadoBorradoRecompensa.TieneCupones => Conflict(new ProblemDetails
            {
                Status = StatusCodes.Status409Conflict,
                Title = "La recompensa tiene cupones emitidos y no se puede eliminar."
            }),
            _ => NotFound()
        };

    private async Task<IActionResult> Guardar(int? id, RecompensaRequest datos, CancellationToken cancellationToken)
    {
        if (id.HasValue && datos.Version is null)
        {
            ModelState.AddModelError(nameof(datos.Version), "Actualice la recompensa para obtener su versión antes de guardar.");
            return ValidationProblem(ModelState);
        }

        var validacion = await validator.ValidateAsync(datos, cancellationToken);
        if (!validacion.IsValid) return ValidationProblem(new ValidationProblemDetails(validacion.ToDictionary()));

        var resultado = await gestionar.GuardarAsync(id, datos, cancellationToken);
        if (resultado.Estado == EstadoGuardadoRecompensa.HabitoInexistente)
        {
            ModelState.AddModelError(nameof(datos.HabitoId), "El hábito seleccionado no existe en el catálogo.");
            return ValidationProblem(ModelState);
        }

        if (resultado.Estado == EstadoGuardadoRecompensa.RecompensaInexistente) return NotFound();
        if (resultado.Estado == EstadoGuardadoRecompensa.VersionDesactualizada)
        {
            return Conflict(new ProblemDetails
            {
                Status = StatusCodes.Status409Conflict,
                Title = "La recompensa cambió desde que abrió el formulario. Actualice la información antes de guardar."
            });
        }

        return id.HasValue
            ? Ok(resultado.Recompensa)
            : CreatedAtAction(nameof(Consultar), new { id = resultado.Recompensa!.Id }, resultado.Recompensa);
    }
}
