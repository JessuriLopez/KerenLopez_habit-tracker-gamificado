
import type { HabitoGlobal } from '../types/habito.types'

// Simulamos una consulta al servidor
export const obtenerHabitosGlobalesAsync = (): Promise<HabitoGlobal[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const datosCatalogo: HabitoGlobal[] = [
        { id: 1, nombre: 'Beber 2 Litros de Agua' },
        { id: 2, nombre: 'Hacer 30 minutos de ejercicio cardiovascular' },
        { id: 3, nombre: 'Leer 10 páginas de arquitectura de software' },
        { id: 4, nombre: 'Practicar algoritmos en C# durante 45 minutos' },
        { id: 5, nombre: 'Dormir 8 horas completas sin pantallas' },
        { id: 6, nombre: 'Documentar avances del sprint en el repositorio' },
      ]

      resolve(datosCatalogo)
    }, 1000)
  })
}
