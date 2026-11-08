
import axios from 'axios'
import type {
  HabitoGlobal,
  CrearHabitoGlobalDto,
  FluentValidationError,
} from '../types/habito.types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!API_BASE_URL) {
  console.error(
    'ERROR: No se detectó VITE_API_BASE_URL en frontend/.env'
  )
}

// Cliente HTTP de HabitForge
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 1. GET: Obtener todos los hábitos
export const obtenerHabitosGlobalesAsync = async (): Promise<HabitoGlobal[]> => {
  const respuesta = await apiClient.get<HabitoGlobal[]>('/habitos')

  if (!Array.isArray(respuesta.data)) {
    throw new Error('La respuesta recibida no es un arreglo JSON válido.')
  }

  return respuesta.data
}

// 2. POST: Crear un nuevo hábito en PostgreSQL
export const crearHabitoGlobalAsync = async (
  nuevoHabito: CrearHabitoGlobalDto
): Promise<HabitoGlobal> => {
  const respuesta = await apiClient.post<HabitoGlobal>(
    '/habitos',
    nuevoHabito
  )

  return respuesta.data
}

// 3. Extraer los errores enviados por .NET
export const extraerMensajeErrorBackend = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Sin respuesta: servidor apagado, red o CORS
    if (!error.response) {
      return 'Sin respuesta del servidor (.NET apagado o bloqueo de seguridad CORS en el navegador).'
    }

    const status = error.response.status
    const data = error.response.data

    // Caso A: Errores de FluentValidation
    if (Array.isArray(data)) {
      const erroresFluent = (data as FluentValidationError[])
        .map((item) => item?.errorMessage)
        .filter(
          (msg): msg is string =>
            typeof msg === 'string' && msg.trim().length > 0
        )

      if (erroresFluent.length > 0) {
        return `[HTTP ${status}] ${erroresFluent.join(' | ')}`
      }
    }

    // Caso B: Mensaje de texto directo
    if (typeof data === 'string' && data.trim().length > 0) {
      return `[HTTP ${status}] ${data}`
    }

    // Caso C: Errores en formato JSON
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>

      if ('errors' in obj && obj.errors && typeof obj.errors === 'object') {
        const listaErrores = Object.values(
          obj.errors as Record<string, string[]>
        ).flat()

        if (listaErrores.length > 0) {
          return `[HTTP ${status}] ${listaErrores.join(' | ')}`
        }
      }

      const mensajeExplicito =
        obj.error || obj.mensaje || obj.message || obj.detail || obj.title

      if (
        typeof mensajeExplicito === 'string' &&
        mensajeExplicito.trim().length > 0
      ) {
        return `[HTTP ${status}] ${mensajeExplicito}`
      }
    }

    return `[HTTP ${status}] El servidor .NET rechazó la operación.`
  }

  return error instanceof Error
    ? error.message
    : 'Error inesperado en la aplicación.'
}

export const eliminarHabitoGlobalAsync = async (
  id: number
): Promise<void> => {
  await apiClient.delete(`/habitos/${id}`)
}