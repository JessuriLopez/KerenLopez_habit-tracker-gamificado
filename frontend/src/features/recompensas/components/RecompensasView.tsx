import { useEffect, useState } from 'react'
import { Button } from '../../../components/Button'
import { extraerMensajeErrorBackend, obtenerHabitosGlobalesAsync } from '../../habitos/api/habitosApi'
import type { HabitoGlobal } from '../../habitos/types/habito.types'
import { eliminarRecompensa, guardarRecompensa, listarRecompensas, type Recompensa } from '../api/recompensasApi'
import { RecompensaForm } from './RecompensaForm'

export function RecompensasView({ token }: { token: string }) {
  const [recompensas, setRecompensas] = useState<Recompensa[]>([])
  const [habitos, setHabitos] = useState<HabitoGlobal[]>([])
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState<string | null>(null)
  const [errorEliminar, setErrorEliminar] = useState<string | null>(null)
  const [formulario, setFormulario] = useState<Recompensa | 'nueva' | null>(null)
  const [eliminando, setEliminando] = useState<number | null>(null)

  useEffect(() => {
    const solicitud = new AbortController()
    Promise.all([listarRecompensas(token, solicitud.signal), obtenerHabitosGlobalesAsync(token, solicitud.signal)])
      .then(([lista, catalogo]) => {
        setRecompensas(lista)
        setHabitos(catalogo)
      })
      .catch((error: unknown) => {
        if (!solicitud.signal.aborted) setErrorCarga(extraerMensajeErrorBackend(error))
      })
      .finally(() => {
        if (!solicitud.signal.aborted) setCargando(false)
      })
    return () => solicitud.abort()
  }, [token])

  const eliminar = async (recompensa: Recompensa) => {
    if (eliminando !== null || !window.confirm(`¿Desea eliminar la recompensa «${recompensa.titulo}»?`)) return

    setEliminando(recompensa.id)
    setErrorEliminar(null)
    try {
      await eliminarRecompensa(token, recompensa.id)
      setRecompensas(actuales => actuales.filter(actual => actual.id !== recompensa.id))
    } catch (error) {
      setErrorEliminar(extraerMensajeErrorBackend(error))
    } finally {
      setEliminando(null)
    }
  }

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <h1 className="text-2xl font-bold text-white md:text-3xl">Recompensas</h1>
        {!formulario && !cargando && !errorCarga && habitos.length > 0 && (
          <Button onClick={() => setFormulario('nueva')} disabled={eliminando !== null} className="bg-indigo-600 px-4 text-white hover:bg-indigo-500 disabled:opacity-50">
            Nueva recompensa
          </Button>
        )}
      </div>
      {cargando && <p role="status" className="text-slate-300">Cargando recompensas…</p>}
      {errorCarga && <p role="alert" className="text-red-300">{errorCarga}</p>}
      {errorEliminar && <p role="alert" className="mb-4 text-red-300">{errorEliminar}</p>}
      {!cargando && !errorCarga && habitos.length === 0 && <p className="text-slate-300">Cree un hábito en el catálogo para agregar una recompensa.</p>}
      {formulario && (
        <RecompensaForm
          habitos={habitos}
          inicial={formulario === 'nueva' ? undefined : formulario}
          onCancelar={() => setFormulario(null)}
          onGuardar={async datos => {
            const nueva = await guardarRecompensa(token, datos, formulario === 'nueva' ? undefined : formulario.id)
            setRecompensas(actuales => formulario === 'nueva'
              ? [...actuales, nueva]
              : actuales.map(actual => actual.id === nueva.id ? nueva : actual))
            setFormulario(null)
          }}
        />
      )}
      {!cargando && !errorCarga && habitos.length > 0 && recompensas.length === 0 && !formulario && (
        <p className="text-slate-300">Todavía no hay recompensas.</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {recompensas.map(recompensa => (
          <article key={recompensa.id} className="rounded-xl border border-slate-700 bg-slate-800 p-5">
            <h2 className="break-words text-lg font-bold text-white">{recompensa.titulo}</h2>
            <dl className="my-3 grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-sm">
              <dt className="text-slate-400">Hábito asociado</dt><dd className="text-right">{recompensa.habitoNombre}</dd>
              <dt className="text-slate-400">Días consecutivos</dt><dd className="text-right">{recompensa.diasRequeridos}</dd>
              <dt className="text-slate-400">Stock disponible</dt><dd className="text-right">{recompensa.stock}</dd>
            </dl>
            {!formulario && <div className="flex flex-wrap gap-2">
              <Button onClick={() => setFormulario(recompensa)} disabled={eliminando !== null} className="bg-slate-700 px-4 hover:bg-slate-600 disabled:opacity-50">Editar</Button>
              <Button onClick={() => eliminar(recompensa)} disabled={eliminando !== null} className="bg-red-950/40 px-4 text-red-300 hover:bg-red-900/60 disabled:opacity-50">
                {eliminando === recompensa.id ? 'Eliminando…' : 'Eliminar'}
              </Button>
            </div>}
          </article>
        ))}
      </div>
    </section>
  )
}
