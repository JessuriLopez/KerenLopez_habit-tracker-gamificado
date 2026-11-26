import { apiClient } from '../../../api/apiClient'
import type { DatosRecompensa } from '../schemas/recompensa.schema'

export interface Recompensa extends DatosRecompensa {
  id: number
  habitoNombre: string
}

const encabezados = (token: string) => ({ Authorization: `Bearer ${token}` })

export async function listarRecompensas(token: string, signal: AbortSignal): Promise<Recompensa[]> {
  const respuesta = await apiClient.get<Recompensa[]>('/recompensas', { headers: encabezados(token), signal })
  return respuesta.data
}

export async function guardarRecompensa(token: string, datos: DatosRecompensa, id?: number): Promise<Recompensa> {
  const config = { headers: encabezados(token) }
  const respuesta = id === undefined
    ? await apiClient.post<Recompensa>('/recompensas', datos, config)
    : await apiClient.put<Recompensa>(`/recompensas/${id}`, datos, config)
  return respuesta.data
}

export async function eliminarRecompensa(token: string, id: number): Promise<void> {
  await apiClient.delete(`/recompensas/${id}`, { headers: encabezados(token) })
}
