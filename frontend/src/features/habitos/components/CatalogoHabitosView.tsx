import { useState } from 'react'
import { Button } from '../../../components/Button'
import { useCatalogoHabitos } from '../hooks/useCatalogoHabitos'
import type { HabitoGlobal } from '../types/habito.types'
import { HabitoGlobalCard } from './HabitoGlobalCard'
import { CrearHabitoForm } from './CrearHabitoForm'

export function CatalogoHabitosView() {
  const {
    habitos,
    cargando,
    errorRed,
    errorEliminacion,
    idEliminando,
    agregarHabitoAlCatalogo,
    manejarEliminarHabito,
  } = useCatalogoHabitos()
  const [busqueda, setBusqueda] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  const manejarHabitoCreado = (nuevoHabito: HabitoGlobal) => {
    agregarHabitoAlCatalogo(nuevoHabito)
    setMostrarFormulario(false)
  }

  const habitosFiltrados = habitos.filter((habito) =>
    habito.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Catálogo Global de Hábitos
          </h1>

          <p className="text-slate-400 text-sm mt-1">
            Conectado vía HTTP/CORS con{' '}
            <code className="text-indigo-400 font-mono">
              PostgreSQL
            </code>.
          </p>
        </div>

        {!mostrarFormulario && (
          <Button
            onClick={() => setMostrarFormulario(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 shadow-sm self-start sm:self-auto"
          >
            + Nuevo Hábito Global
          </Button>
        )}
      </div>

      {/* Formulario para crear hábitos */}
      {mostrarFormulario && (
        <CrearHabitoForm
          onHabitoCreado={manejarHabitoCreado}
          onCancelar={() => setMostrarFormulario(false)}
        />
      )}

      {/* Buscador */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <input
          id="buscar-habitos"
          name="buscarHabitos"
          type="text"
          aria-label="Buscar hábitos"
          placeholder="🔍 Filtrar hábitos provenientes de PostgreSQL..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full sm:max-w-md bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
        />

        <span className="text-xs text-slate-400">
          Mostrando{' '}
          <strong className="text-white">
            {habitosFiltrados.length}
          </strong>{' '}
          de {habitos.length} registros en BD
        </span>
      </div>

      {/* Error de eliminación */}
      {errorEliminacion && (
        <div
          role="alert"
          className="mb-6 bg-red-950/40 border border-red-500/40 rounded-xl p-4"
        >
          <p className="text-red-400 font-semibold text-sm">
            🚨 No se pudo eliminar el hábito
          </p>

          <p className="text-slate-300 text-sm mt-1">
            {errorEliminacion}
          </p>
        </div>
      )}

      {/* Pantalla de carga */}
      {cargando && (
        <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-indigo-400 font-semibold animate-pulse text-lg">
            ⏳ Consultando endpoint GET /api/habitos en .NET...
          </p>
        </div>
      )}

      {/* Pantalla de error de conexión */}
      {!cargando && errorRed && (
        <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-6 text-center">
          <p className="text-red-400 font-bold text-base mb-1">
            🚨 Error de Comunicación Full-Stack
          </p>

          <p className="text-slate-300 text-sm">
            {errorRed}
          </p>
        </div>
      )}

      {/* Tarjetas de hábitos */}
      {!cargando && !errorRed && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {habitosFiltrados.map((habito) => (
            <HabitoGlobalCard
              key={habito.id}
              id={habito.id}
              nombre={habito.nombre}
              onEliminar={manejarEliminarHabito}
              eliminando={idEliminando !== null}
            />
          ))}
        </section>
      )}
    </div>
  )
}
