import { z } from 'zod'

export const registroSchema = z.object({
  nombre: z.string().trim()
    .min(1, 'Ingrese su nombre.')
    .max(100, 'El nombre admite hasta 100 caracteres.'),
  correo: z.string().trim()
    .min(1, 'Ingrese su correo electrónico.')
    .max(254, 'El correo admite hasta 254 caracteres.')
    .pipe(z.email('Ingrese un correo electrónico válido.')),
  contrasena: z.string()
    .refine((valor) => valor.trim().length > 0, 'Ingrese su contraseña.')
    .min(12, 'La contraseña debe tener entre 12 y 128 caracteres.')
    .max(128, 'La contraseña debe tener entre 12 y 128 caracteres.'),
})

export type RegistroSchemaType = z.infer<typeof registroSchema>
