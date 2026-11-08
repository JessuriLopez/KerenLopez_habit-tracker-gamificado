
import { z } from 'zod'

// Reglas de validación para crear un hábito
export const crearHabitoGlobalSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, 'El nombre del hábito no puede estar vacío.')
    .min(3, 'El hábito debe tener al menos 3 caracteres.')
    .max(100, 'El nombre no puede superar los 100 caracteres permitidos en PostgreSQL.')
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,()-]+$/,
      'El hábito contiene caracteres especiales no permitidos.'
    ),
})

// Tipo TypeScript generado automáticamente desde Zod
export type CrearHabitoGlobalSchemaType = z.infer<
  typeof crearHabitoGlobalSchema
>
