import { apiClient } from '../../../api/apiClient'

export interface CheckInsDeHoy {
  fecha: string
  cambiaEn: string
  habitosCompletados: number[]
}

export async function consultarCheckIns(token: string, signal: AbortSignal): Promise<CheckInsDeHoy> {
  const respuesta = await apiClient.get<CheckInsDeHoy>('/check-ins/hoy', {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  })
  return respuesta.data
}

export async function registrarCheckIn(token: string, habitoId: number): Promise<void> {
  await apiClient.post(`/check-ins/hoy/${habitoId}`, undefined, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
