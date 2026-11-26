using FluentValidation;

namespace HabitForge.Application.Features.Auth.Registro;

public sealed class RegistrarUsuarioValidator : AbstractValidator<RegistrarUsuarioRequest>
{
    public RegistrarUsuarioValidator()
    {
        RuleFor(x => (x.Nombre ?? string.Empty).Trim())
            .NotEmpty().WithMessage("Ingrese su nombre.")
            .MaximumLength(100).WithMessage("El nombre admite hasta 100 caracteres.")
            .OverridePropertyName(nameof(RegistrarUsuarioRequest.Nombre));

        RuleFor(x => (x.Correo ?? string.Empty).Trim())
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Ingrese su correo electrónico.")
            .MaximumLength(254).WithMessage("El correo admite hasta 254 caracteres.")
            .EmailAddress().WithMessage("Ingrese un correo electrónico válido.")
            .OverridePropertyName(nameof(RegistrarUsuarioRequest.Correo));

        RuleFor(x => x.Contrasena)
            .Cascade(CascadeMode.Stop)
            .NotEmpty().WithMessage("Ingrese su contraseña.")
            .Length(12, 128).WithMessage("La contraseña debe tener entre 12 y 128 caracteres.");
    }
}
