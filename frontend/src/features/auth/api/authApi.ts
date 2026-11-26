import { apiClient } from '../../../api/apiClient'
import type { RegistroSchemaType } from '../schemas/registro.schema'

export async function registrarUsuarioAsync(datos: RegistroSchemaType): Promise<void> {
  await apiClient.post('/auth/registro', datos)
}
