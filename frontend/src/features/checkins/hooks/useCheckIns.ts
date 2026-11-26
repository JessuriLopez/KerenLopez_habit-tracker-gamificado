import { isAxiosError } from 'axios'
import { useEffect, useRef, useState } from 'react'
import { consultarCheckIns, registrarCheckIn, type CheckInsDeHoy, type CuponDesbloqueado } from '../api/checkInsApi'

export function useCheckIns(token: string | null) {
  const [estado, setEstado] = useState<CheckInsDeHoy | null>(null)
  const [revision, setRevision] = useState(0)
  const [idRegistrando, setIdRegistrando] = useState<number | null>(null)
  const [errorConsulta, setErrorConsulta] = useState(false)
  const [errorRegistro, setErrorRegistro] = useState(false)
  const [cupones, setCupones] = useState<CuponDesbloqueado[]>([])
  const registrando = useRef(false)

  useEffect(() => {
    if (!token) return

    const solicitud = new AbortController()
    let siguienteDia: number | undefined

    consultarCheckIns(token, solicitud.signal).then((hoy) => {
      if (solicitud.signal.aborted) return

      setEstado(hoy)
      const espera = Math.max(1000, Date.parse(hoy.cambiaEn) - Date.now())
      siguienteDia = window.setTimeout(() => {
        setEstado(null)
        setRevision(actual => actual + 1)
      }, espera)
    }).catch(() => {
      if (!solicitud.signal.aborted) setErrorConsulta(true)
    })

    return () => {
      solicitud.abort()
      window.clearTimeout(siguienteDia)
    }
  }, [token, revision])

  const refrescar = () => {
    setEstado(null)
    setErrorConsulta(false)
    setErrorRegistro(false)
    setRevision(actual => actual + 1)
  }

  const completar = async (habitoId: number) => {
    if (!token || !estado || registrando.current || estado.habitosCompletados.includes(habitoId)) return

    registrando.current = true
    setIdRegistrando(habitoId)
    setErrorRegistro(false)

    try {
      setCupones(await registrarCheckIn(token, habitoId))
      refrescar()
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        refrescar()
      } else {
        setErrorRegistro(true)
      }
    } finally {
      registrando.current = false
      setIdRegistrando(null)
    }
  }

  return { estado, idRegistrando, errorConsulta, errorRegistro, cupones, refrescar, completar }
}
