import { apiClient } from '../../../api/apiClient'

export interface CheckInsDeHoy {
  fecha: string
  cambiaEn: string
  habitosCompletados: number[]
  progreso: ProgresoHabito[]
}

export interface ProgresoHabito {
  habitoId: number
  racha: number
  recompensas: { id: number; titulo: string; diasRequeridos: number; stock: number; obtenida: boolean }[]
}

export interface CuponDesbloqueado { id: number; titulo: string }

export async function consultarCheckIns(token: string, signal: AbortSignal): Promise<CheckInsDeHoy> {
  const respuesta = await apiClient.get<CheckInsDeHoy>('/check-ins/hoy', {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  })
  return respuesta.data
}

export async function registrarCheckIn(token: string, habitoId: number): Promise<CuponDesbloqueado[]> {
  const respuesta = await apiClient.post<CuponDesbloqueado[]>(`/check-ins/hoy/${habitoId}`, undefined, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return respuesta.status === 204 ? [] : respuesta.data
}
