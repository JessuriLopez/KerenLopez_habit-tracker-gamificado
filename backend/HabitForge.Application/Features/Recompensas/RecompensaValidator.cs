using FluentValidation;

namespace HabitForge.Application.Features.Recompensas;

public sealed class RecompensaValidator : AbstractValidator<RecompensaRequest>
{
    public RecompensaValidator()
    {
        RuleFor(datos => datos.Titulo).NotEmpty().WithMessage("Ingrese el título de la recompensa.");
        RuleFor(datos => datos.HabitoId).Cascade(CascadeMode.Stop)
            .NotNull().GreaterThan(0).WithMessage("Seleccione un hábito del catálogo.");
        RuleFor(datos => datos.DiasRequeridos).Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Ingrese los días requeridos.")
            .GreaterThan(0).WithMessage("Los días requeridos deben ser mayores que cero.");
        RuleFor(datos => datos.Stock).Cascade(CascadeMode.Stop)
            .NotNull().WithMessage("Ingrese el stock disponible.")
            .GreaterThanOrEqualTo(0).WithMessage("El stock debe ser mayor o igual a cero.");
    }
}
