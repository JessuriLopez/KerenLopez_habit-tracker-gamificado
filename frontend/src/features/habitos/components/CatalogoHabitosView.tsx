import { useState } from 'react'
import { Button } from '../../../components/Button'
import { useCheckIns } from '../../checkins/hooks/useCheckIns'
import { useCatalogoHabitos } from '../hooks/useCatalogoHabitos'
import type { HabitoGlobal } from '../types/habito.types'
import { HabitoGlobalCard } from './HabitoGlobalCard'
import { HabitoForm } from './HabitoForm'

interface CatalogoHabitosViewProps {
  token: string
  puedeAdministrar: boolean
}

export function CatalogoHabitosView({ token, puedeAdministrar }: CatalogoHabitosViewProps) {
  const {
    habitos,
    cargando,
    errorRed,
    errorEliminacion,
    idEliminando,
    guardarHabito,
    manejarEliminarHabito,
  } = useCatalogoHabitos(token)
  const checkIns = useCheckIns(puedeAdministrar ? null : token)
  const [busqueda, setBusqueda] = useState('')
  const [formulario, setFormulario] = useState<'nuevo' | HabitoGlobal | null>(null)
  const habitoEditado = formulario === 'nuevo' ? null : formulario

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

        {puedeAdministrar && !formulario && !cargando && !errorRed && (
          <Button
            onClick={() => setFormulario('nuevo')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 shadow-sm self-start sm:self-auto"
          >
            + Nuevo Hábito Global
          </Button>
        )}
      </div>

      {puedeAdministrar && formulario && (
        <HabitoForm
          nombreInicial={habitoEditado?.nombre}
          onGuardar={async (datos) => {
            await guardarHabito(datos, habitoEditado?.id)
            setFormulario(null)
          }}
          onCancelar={() => setFormulario(null)}
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

      {checkIns.errorConsulta && (
        <div role="alert" className="mb-6 rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-sm text-red-300">
          No se pudo consultar el cumplimiento de hoy.
          <Button onClick={checkIns.refrescar} className="ml-3 px-3 text-indigo-300 hover:bg-slate-700">
            Volver a intentar
          </Button>
        </div>
      )}
      {checkIns.errorRegistro && (
        <p role="alert" className="mb-6 rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-sm text-red-300">
          No se pudo registrar el cumplimiento. Vuelva a intentarlo.
        </p>
      )}

      {/* Tarjetas de hábitos */}
      {!cargando && !errorRed && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {habitosFiltrados.map((habito) => (
            <HabitoGlobalCard
              key={habito.id}
              id={habito.id}
              nombre={habito.nombre}
              onEditar={puedeAdministrar && !formulario ? () => setFormulario(habito) : undefined}
              onEliminar={puedeAdministrar && !formulario ? manejarEliminarHabito : undefined}
              eliminando={idEliminando !== null}
              onCompletar={!puedeAdministrar ? () => checkIns.completar(habito.id) : undefined}
              completado={checkIns.estado?.habitosCompletados.includes(habito.id)}
              completando={checkIns.idRegistrando === habito.id}
              cumplimientoDeshabilitado={!checkIns.estado || checkIns.idRegistrando !== null}
            />
          ))}
        </section>
      )}
    </div>
  )
}
