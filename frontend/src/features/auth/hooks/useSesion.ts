import { isAxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { apiClient } from '../../../api/apiClient'
import type { Sesion } from '../types/sesion.types'

export function useSesion() {
  const [sesion, setSesion] = useState<Sesion | null>(null)

  useEffect(() => {
    if (!sesion) return

    const expiraEn = Date.parse(sesion.expiraEn)
    const cerrarSesionVigente = () => setSesion((actual) => actual === sesion ? null : actual)
    const temporizador = window.setTimeout(cerrarSesionVigente, Math.max(0, expiraEn - Date.now()))
    const interceptor = apiClient.interceptors.response.use(undefined, (error: unknown) => {
      if (isAxiosError(error) && error.response?.status === 401 &&
          error.config?.headers.get('Authorization') === `Bearer ${sesion.token}`) {
        cerrarSesionVigente()
      }
      return Promise.reject(error)
    })

    return () => {
      window.clearTimeout(temporizador)
      apiClient.interceptors.response.eject(interceptor)
    }
  }, [sesion])

  return { sesion, iniciarSesion: setSesion, cerrarSesion: () => setSesion(null) }
}
