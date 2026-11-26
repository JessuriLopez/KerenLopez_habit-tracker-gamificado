import { apiClient } from '../../../api/apiClient'

export interface PremioObtenido {
  id: number
  tituloRecompensa: string
  habitoAsociado: string
  obtenidoEn: string
}

export async function obtenerMisPremios(token: string, signal: AbortSignal): Promise<PremioObtenido[]> {
  const respuesta = await apiClient.get<PremioObtenido[]>('/cupones/mis-premios', {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  })
  return respuesta.data
}
