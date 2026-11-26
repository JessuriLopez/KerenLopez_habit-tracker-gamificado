import { useEffect, useState } from 'react'
import type { CrearHabitoGlobalDto, HabitoGlobal } from '../types/habito.types'
import {
  actualizarHabitoGlobalAsync,
  crearHabitoGlobalAsync,
  obtenerHabitosGlobalesAsync,
  eliminarHabitoGlobalAsync,
  extraerMensajeErrorBackend,
} from '../api/habitosApi'

export function useCatalogoHabitos(token: string) {
  const [habitos, setHabitos] = useState<HabitoGlobal[]>([])
  const [cargando, setCargando] = useState<boolean>(true)
  const [errorRed, setErrorRed] = useState<string | null>(null)
  const [errorEliminacion, setErrorEliminacion] = useState<string | null>(null)
  const [idEliminando, setIdEliminando] = useState<number | null>(null)

  useEffect(() => {
    const solicitud = new AbortController()
    obtenerHabitosGlobalesAsync(token, solicitud.signal)
      .then((datosDesdePostgres) => {
        setHabitos(datosDesdePostgres)
        setErrorRed(null)
      })
      .catch((error) => {
        if (!solicitud.signal.aborted) setErrorRed(extraerMensajeErrorBackend(error))
      })
      .finally(() => {
        if (!solicitud.signal.aborted) setCargando(false)
      })
    return () => solicitud.abort()
  }, [token])

  const guardarHabito = async (datos: CrearHabitoGlobalDto, id?: number) => {
    if (id === undefined) {
      const nuevoHabito = await crearHabitoGlobalAsync(token, datos)
      setHabitos(actuales => [...actuales, nuevoHabito])
      return
    }

    await actualizarHabitoGlobalAsync(token, id, datos)
    setHabitos(actuales => actuales.map(habito => habito.id === id ? { ...habito, nombre: datos.nombre } : habito))
  }

  // Eliminar un hábito mediante DELETE en .NET
  const manejarEliminarHabito = async (id: number) => {
    if (idEliminando !== null) return

    const habito = habitos.find((item) => item.id === id)

    if (!habito) return

    const confirmado = window.confirm(
      `¿Estás seguro de que deseas eliminar el hábito "${habito.nombre}"?\n\nEsta acción eliminará el registro de PostgreSQL.`
    )

    if (!confirmado) return

    try {
      setErrorEliminacion(null)
      setIdEliminando(id)

      // Esperamos que .NET confirme la eliminación
      await eliminarHabitoGlobalAsync(token, id)

      // Actualizamos React sin modificar el arreglo original
      setHabitos((habitosActuales) =>
        habitosActuales.filter((item) => item.id !== id)
      )
    } catch (error) {
      setErrorEliminacion(extraerMensajeErrorBackend(error))
    } finally {
      setIdEliminando(null)
    }
  }

  return {
    habitos,
    cargando,
    errorRed,
    errorEliminacion,
    idEliminando,
    guardarHabito,
    manejarEliminarHabito,
  }
}
