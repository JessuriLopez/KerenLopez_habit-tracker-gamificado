
import axios from 'axios'
import type { HabitoGlobal } from '../types/habito.types'

// Cliente HTTP configurado con la variable de entorno
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Obtener hábitos reales desde el Backend .NET
export const obtenerHabitosGlobalesAsync = async (): Promise<HabitoGlobal[]> => {
  const respuesta = await apiClient.get<HabitoGlobal[]>('/habitos')
  return respuesta.data
}

