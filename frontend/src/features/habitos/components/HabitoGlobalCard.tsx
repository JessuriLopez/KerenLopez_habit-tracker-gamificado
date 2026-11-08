
import type { HabitoGlobal } from '../types/habito.types'

interface HabitoGlobalCardProps extends HabitoGlobal {
  onEliminar: (id: number) => void
  eliminando?: boolean
}

export function HabitoGlobalCard({
  id,
  nombre,
  onEliminar,
  eliminando = false,
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

      <div className="flex flex-col gap-2">
        <button
          disabled
          className="w-full bg-slate-900/80 text-slate-400 text-sm font-medium py-2.5 px-4 rounded-lg cursor-not-allowed border border-slate-700"
        >
          🔒 Adoptar Hábito (Requiere Sesión)
        </button>

        <button
          type="button"
          onClick={() => onEliminar(id)}
          disabled={eliminando}
          className="w-full bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 text-sm font-medium py-2.5 px-4 rounded-lg border border-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {eliminando ? '⏳ Eliminando...' : '🗑️ Eliminar Hábito'}
        </button>
      </div>

    </article>
  )
}
