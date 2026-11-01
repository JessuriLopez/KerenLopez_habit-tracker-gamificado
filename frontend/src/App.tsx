
import { useState, useEffect } from 'react'
import { HabitoGlobalCard, type HabitoGlobalProps } from './components/HabitoGlobalCard'

function App() {
  
  // Estado de los hábitos
  const [habitos, setHabitos] = useState<HabitoGlobalProps[]>([])

  // Estado de carga
  const [cargando, setCargando] = useState<boolean>(true)

  // Estado del buscador
  const [busqueda, setBusqueda] = useState<string>('')

  // Simulamos la llegada de datos desde el servidor
  useEffect(() => {
    const temporizador = setTimeout(() => {
      const datosSimuladosBD: HabitoGlobalProps[] = [
        { id: 1, nombre: 'Beber 2 Litros de Agua' },
        { id: 2, nombre: 'Hacer 30 minutos de ejercicio cardiovascular' },
        { id: 3, nombre: 'Leer 10 páginas de arquitectura de software' },
        { id: 4, nombre: 'Practicar algoritmos en C# durante 45 minutos' },
        { id: 5, nombre: 'Dormir 8 horas completas sin pantallas' },
        { id: 6, nombre: 'Documentar avances del sprint en el repositorio' },
      ]

      setHabitos(datosSimuladosBD)
      setCargando(false)
    }, 1200)

    return () => clearTimeout(temporizador)
  }, [])

  // Filtrar los hábitos por nombre
  const habitosFiltrados = habitos.filter((habito) =>
    habito.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">

      {/* 1. MENÚ LATERAL: visible en escritorio */}
      <aside className="hidden md:flex md:w-64 md:flex-col bg-slate-950 border-r border-slate-800 justify-between p-5 shrink-0">
        <div>
          {/* Identidad de HabitForge */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow">
              HF
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              HabitForge
            </span>
          </div>

          {/* Navegación */}
          <nav className="space-y-2">
            <a
              href="#"
              className="flex items-center justify-between px-3 py-2.5 bg-indigo-600/15 text-indigo-400 rounded-lg font-medium text-sm border border-indigo-500/20"
            >
              <span className="flex items-center gap-3">
                <span>🌐</span> Catálogo Global
              </span>

              <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-0.5 rounded-full">
                {habitos.length}
              </span>
            </a>

            <span className="flex items-center gap-3 px-3 py-2.5 text-slate-500 rounded-lg font-medium text-sm cursor-not-allowed">
              <span>📈</span> Mis Hábitos (Unidad 3)
            </span>

            <span className="flex items-center gap-3 px-3 py-2.5 text-slate-500 rounded-lg font-medium text-sm cursor-not-allowed">
              <span>📊</span> Progreso (Unidad 3)
            </span>
          </nav>
        </div>

        {/* Estado de seguridad */}
        <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400 mb-1">
            Estado de Seguridad
          </p>
          <p className="text-sm font-semibold text-amber-400">
            👤 Modo Invitado
          </p>
        </div>
      </aside>

      {/* 2. CABECERA PARA CELULARES */}
      <header className="md:hidden bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center font-bold text-sm text-white">
            HF
          </div>
          <span className="font-bold text-lg text-white">
            HabitForge
          </span>
        </div>

        <span className="text-xs bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-md border border-amber-500/20 font-medium">
          👤 Invitado
        </span>
      </header>

      {/* 3. CONTENIDO PRINCIPAL */}
      <main className="flex-1 min-w-0 p-6 md:p-10 overflow-y-auto">

        {/* Título y botón principal */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 mb-8 border-b border-slate-800">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Catálogo Global de Hábitos
            </h1>

            <p className="text-slate-400 text-sm mt-1">
              Explora los hábitos maestros registrados en la tabla{' '}
              <code className="text-indigo-400 font-mono">
                HabitosGlobales
              </code>.
            </p>
          </div>

          <button
            type="button"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
          >
            + Nuevo Hábito Global
          </button>
        </div>
        {/* Buscador reactivo */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <input
            type="text"
            placeholder="🔍 Filtrar hábitos en el catálogo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full sm:max-w-md bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />

          <span className="text-xs text-slate-400">
            Mostrando{' '}
            <strong className="text-white">
              {habitosFiltrados.length}
            </strong>{' '}
            de {habitos.length} registros en memoria
          </span>
        </div>


        {/* 4. TARJETAS RESPONSIVAS */}
        {cargando ? (
          <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-12 text-center">
            <p className="text-indigo-400 font-semibold animate-pulse text-lg">
              ⏳ Sincronizando catálogo desde el Almacén de Estado...
            </p>
            <p className="text-slate-500 text-xs mt-2">
              Ejecutando montaje inicial y useEffect
            </p>
          </div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {habitosFiltrados.map((habito) => (
              <HabitoGlobalCard
                key={habito.id}
                id={habito.id}
                nombre={habito.nombre}
              />
            ))}
          </section>
        )}


      </main>
    </div>
  )
}

export default App
