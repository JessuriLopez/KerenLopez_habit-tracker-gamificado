
import type { HabitoGlobal } from '../types/habito.types'
import { Button } from '../../../components/Button'

interface HabitoGlobalCardProps extends HabitoGlobal {
  onEditar?: () => void
  onEliminar?: (id: number) => void
  eliminando?: boolean
  onCompletar?: () => void
  completado?: boolean
  completando?: boolean
  cumplimientoDeshabilitado?: boolean
}

export function HabitoGlobalCard({
  id,
  nombre,
  onEditar,
  onEliminar,
  eliminando = false,
  onCompletar,
  completado = false,
  completando = false,
  cumplimientoDeshabilitado = false,
}: HabitoGlobalCardProps) {
  return (
    <article className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col justify-between hover:border-indigo-500 transition-colors shadow-sm">

      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-2.5 py-1 rounded-md border border-indigo-500/20">
            ID Catálogo #{id}
          </span>

          <span className="text-xs text-slate-400 font-medium">
            Catálogo Base
          </span>
        </div>

        <h3 className="text-lg font-bold text-white mb-5">
          {nombre}
        </h3>
      </div>

      {onCompletar && (
        <Button
          onClick={onCompletar}
          disabled={completado || cumplimientoDeshabilitado}
          className={completado
            ? 'w-full bg-emerald-950/60 px-4 text-emerald-300 disabled:cursor-not-allowed'
            : 'w-full bg-indigo-600 px-4 text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50'}
        >
          {completado ? '✓ Completado hoy' : completando ? 'Registrando…' : 'Completado'}
        </Button>
      )}

      {onEditar && onEliminar && <div className="flex flex-col gap-2">
        <Button onClick={onEditar} disabled={eliminando} className="w-full bg-slate-700 px-4 text-white hover:bg-slate-600 disabled:opacity-50">
          Editar Hábito
        </Button>
        <Button
          onClick={() => onEliminar(id)}
          disabled={eliminando}
          className="w-full bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 px-4 border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {eliminando ? '⏳ Eliminando...' : '🗑️ Eliminar Hábito'}
        </Button>
      </div>}

    </article>
  )
}
