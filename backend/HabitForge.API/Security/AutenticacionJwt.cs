using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using HabitForge.Application.Features.Auth.Login;
using HabitForge.Application.Interfaces;
using HabitForge.Domain.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace HabitForge.API.Security;

internal sealed class AutenticacionJwt(SymmetricSecurityKey clave) : IGeneradorToken
{
    private const string Emisor = "HabitForge";
    private const string Audiencia = "HabitForge.API";
    private const string Algoritmo = SecurityAlgorithms.HmacSha256;
    private static readonly TimeSpan Duracion = TimeSpan.FromMinutes(30);

    public static void Agregar(IServiceCollection servicios)
    {
        var claveBase64 = Environment.GetEnvironmentVariable("HABITFORGE_JWT_KEY");
        byte[] bytes;
        try
        {
            bytes = Convert.FromBase64String(claveBase64 ?? string.Empty);
        }
        catch (FormatException)
        {
            throw new InvalidOperationException("HABITFORGE_JWT_KEY debe estar en Base64.");
        }

        if (bytes.Length < 32)
        {
            throw new InvalidOperationException("Configure HABITFORGE_JWT_KEY con al menos 32 bytes aleatorios en Base64.");
        }

        var clave = new SymmetricSecurityKey(bytes);
        servicios.AddSingleton<IGeneradorToken>(new AutenticacionJwt(clave));
        servicios.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(opciones =>
        {
            opciones.MapInboundClaims = false;
            opciones.IncludeErrorDetails = false;
            opciones.TokenValidationParameters = new TokenValidationParameters
            {
                IssuerSigningKey = clave,
                ValidateIssuerSigningKey = true,
                ValidAlgorithms = [Algoritmo],
                ValidIssuer = Emisor,
                ValidateIssuer = true,
                ValidAudience = Audiencia,
                ValidateAudience = true,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero,
                NameClaimType = JwtRegisteredClaimNames.Sub,
                RoleClaimType = "role"
            };
        });
        servicios.AddAuthorization();
    }

    public LoginResponse Generar(Usuario usuario)
    {
        var ahora = DateTimeOffset.FromUnixTimeSeconds(DateTimeOffset.UtcNow.ToUnixTimeSeconds());
        var expiraEn = ahora.Add(Duracion);
        var rol = usuario.Rol.ToString();
        var token = new JwtSecurityToken(
            issuer: Emisor,
            audience: Audiencia,
            claims:
            [
                new Claim(JwtRegisteredClaimNames.Sub, usuario.Id.ToString(CultureInfo.InvariantCulture)),
                new Claim("role", rol)
            ],
            notBefore: ahora.UtcDateTime,
            expires: expiraEn.UtcDateTime,
            signingCredentials: new SigningCredentials(clave, Algoritmo));

        return new LoginResponse(new JwtSecurityTokenHandler().WriteToken(token), expiraEn,
            new UsuarioAutenticado(usuario.Id, usuario.Nombre, rol));
    }
}
