import { z } from 'zod'

const maxEntero = 2147483647

export const recompensaSchema = z.object({
  titulo: z.string().trim().min(1, 'Ingrese el título de la recompensa.'),
  habitoId: z.number({ error: 'Seleccione un hábito del catálogo.' }).int().min(1, 'Seleccione un hábito del catálogo.'),
  diasRequeridos: z.number({ error: 'Ingrese los días requeridos.' })
    .int('Ingrese una cantidad entera de días.').min(1, 'Ingrese al menos un día.').max(maxEntero),
  stock: z.number({ error: 'Ingrese el stock disponible.' })
    .int('Ingrese una cantidad entera.').min(0, 'El stock debe ser mayor o igual a cero.').max(maxEntero),
})

export type DatosRecompensa = z.infer<typeof recompensaSchema>
