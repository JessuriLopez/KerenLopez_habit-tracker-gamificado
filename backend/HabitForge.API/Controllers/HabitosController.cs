using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using HabitForge.Application.Interfaces;
using HabitForge.Domain.Entities;
using HabitForge.Application.Features.Habitos.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace HabitForge.API.Controllers;

[ApiController]
[Authorize(Roles = nameof(RolUsuario.Jugador) + "," + nameof(RolUsuario.GameMaster))]
[Route("api/[controller]")]
public class HabitosController : ControllerBase
{
    private readonly IHabitoRepository _repository;
    private readonly IValidator<CreateHabitoRequestDto> _validator;
    private readonly IValidator<UpdateHabitoRequestDto> _updateValidator;

    public HabitosController(
    IHabitoRepository repository,
    IValidator<CreateHabitoRequestDto> validator,
    IValidator<UpdateHabitoRequestDto> updateValidator)
    {
        _repository = repository;
        _validator = validator;
        _updateValidator = updateValidator;
    }

    [HttpGet]
    public async Task<IActionResult> GetHabitos()
    {
        var habitos = await _repository.GetAllAsync();

        var response = habitos.Select(h => new HabitoResponseDto
        {
            Id = h.Id,
            Nombre = h.Nombre
        });

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetHabitoById(int id)
    {
        var habito = await _repository.GetByIdAsync(id);

        if (habito is null)
        {
            return NotFound();
        }

        var response = new HabitoResponseDto
        {
            Id = habito.Id,
            Nombre = habito.Nombre
        };

        return Ok(response);
    }

    [HttpPost]
    [Authorize(Roles = nameof(RolUsuario.GameMaster))]
    public async Task<IActionResult> CrearHabito(
        [FromBody] CreateHabitoRequestDto request)
    {
        var validationResult = await _validator.ValidateAsync(request);

        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.Errors);
        }

        var nuevoHabito = new HabitoGlobal
        {
            Nombre = request.Nombre
        };

        var habitoCreado = await _repository.AddAsync(nuevoHabito);

        var response = new HabitoResponseDto
        {
            Id = habitoCreado.Id,
            Nombre = habitoCreado.Nombre
        };

        return CreatedAtAction(
            nameof(GetHabitoById),
            new { id = response.Id },
            response);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = nameof(RolUsuario.GameMaster))]
    public async Task<IActionResult> ActualizarHabito(
        int id,
        [FromBody] UpdateHabitoRequestDto request)
    {
        var validationResult = await _updateValidator.ValidateAsync(request);

        if (!validationResult.IsValid)
        {
            return BadRequest(validationResult.Errors);
        }

        var habito = await _repository.GetByIdAsync(id);

        if (habito is null)
        {
            return NotFound();
        }

        habito.Nombre = request.Nombre;

        await _repository.UpdateAsync(habito);

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = nameof(RolUsuario.GameMaster))]
    public async Task<IActionResult> EliminarHabito(int id)
    {
        var habito = await _repository.GetByIdAsync(id);

        if (habito is null)
        {
            return NotFound();
        }

        if (!await _repository.IntentarEliminarAsync(habito))
        {
            return Conflict(new ProblemDetails
            {
                Status = StatusCodes.Status409Conflict,
                Title = "El hábito tiene registros de cumplimiento y no se puede eliminar."
            });
        }

        return NoContent();
    }
}
