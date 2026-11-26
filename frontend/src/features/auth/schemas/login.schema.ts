import { z } from 'zod'

export const loginSchema = z.object({
  correo: z.string().trim()
    .min(1, 'Ingrese su correo electrónico.')
    .pipe(z.email('Ingrese un correo electrónico válido.')),
  contrasena: z.string().min(1, 'Ingrese su contraseña.'),
})

export type LoginSchemaType = z.infer<typeof loginSchema>
