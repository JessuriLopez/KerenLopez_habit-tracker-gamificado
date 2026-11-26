import { useEffect, useState } from 'react'
import type { HabitoGlobal } from '../types/habito.types'
import {
  obtenerHabitosGlobalesAsync,
  eliminarHabitoGlobalAsync,
  extraerMensajeErrorBackend,
} from '../api/habitosApi'

export function useCatalogoHabitos() {
  const [habitos, setHabitos] = useState<HabitoGlobal[]>([])
  const [cargando, setCargando] = useState<boolean>(true)
  const [errorRed, setErrorRed] = useState<string | null>(null)
  const [errorEliminacion, setErrorEliminacion] = useState<string | null>(null)
  const [idEliminando, setIdEliminando] = useState<number | null>(null)

  useEffect(() => {
    obtenerHabitosGlobalesAsync()
      .then((datosDesdePostgres) => {
        setHabitos(datosDesdePostgres)
        setErrorRed(null)
      })
      .catch((error) => {
        console.error('Error en la petición HTTP:', error)
        setErrorRed(extraerMensajeErrorBackend(error))
      })
      .finally(() => {
        setCargando(false)
      })
  }, [])

  // Crear hábito y actualizar el catálogo sin recargar
  const agregarHabitoAlCatalogo = (nuevoHabitoDesdeBD: HabitoGlobal) => {
    setHabitos((habitosActuales) => [
      ...habitosActuales,
      nuevoHabitoDesdeBD,
    ])
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
      await eliminarHabitoGlobalAsync(id)

      // Actualizamos React sin modificar el arreglo original
      setHabitos((habitosActuales) =>
        habitosActuales.filter((item) => item.id !== id)
      )
    } catch (error) {
      console.error('Error al eliminar el hábito:', error)
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
    agregarHabitoAlCatalogo,
    manejarEliminarHabito,
  }
}
