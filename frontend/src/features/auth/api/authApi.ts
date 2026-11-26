import { apiClient } from '../../../api/apiClient'
import type { LoginSchemaType } from '../schemas/login.schema'
import type { RegistroSchemaType } from '../schemas/registro.schema'
import type { Sesion } from '../types/sesion.types'

export async function registrarUsuarioAsync(datos: RegistroSchemaType): Promise<void> {
  await apiClient.post('/auth/registro', datos)
}

export async function iniciarSesionAsync(datos: LoginSchemaType): Promise<Sesion> {
  const respuesta = await apiClient.post<Sesion>('/auth/login', datos)
  return respuesta.data
}
