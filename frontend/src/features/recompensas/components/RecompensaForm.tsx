import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../../../components/Button'
import { extraerMensajeErrorBackend } from '../../habitos/api/habitosApi'
import type { HabitoGlobal } from '../../habitos/types/habito.types'
import { recompensaSchema, type DatosRecompensa } from '../schemas/recompensa.schema'

interface RecompensaFormProps {
  habitos: HabitoGlobal[]
  inicial?: DatosRecompensa
  onGuardar: (datos: DatosRecompensa) => Promise<void>
  onCancelar: () => void
}

const estiloCampo = 'mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-white focus:border-indigo-500 focus:outline-none aria-invalid:border-amber-500'

export function RecompensaForm({ habitos, inicial, onGuardar, onCancelar }: RecompensaFormProps) {
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<DatosRecompensa>({
    resolver: zodResolver(recompensaSchema),
    defaultValues: inicial ? {
      titulo: inicial.titulo,
      habitoId: inicial.habitoId,
      diasRequeridos: inicial.diasRequeridos,
      stock: inicial.stock,
    } : { titulo: '', stock: 0 },
  })

  const guardar = async (datos: DatosRecompensa) => {
    try {
      await onGuardar(datos)
    } catch (error) {
      setError('root.servidor', { message: extraerMensajeErrorBackend(error) })
    }
  }

  return (
    <form onSubmit={handleSubmit(guardar)} noValidate className="mb-6 rounded-xl border border-indigo-500/40 bg-slate-800 p-5 shadow-lg">
      <h2 className="mb-4 font-bold text-white">{inicial ? 'Editar recompensa' : 'Nueva recompensa'}</h2>
      <fieldset disabled={isSubmitting} className="grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <label htmlFor="recompensa-titulo" className="font-medium">Título</label>
          <input id="recompensa-titulo" className={estiloCampo} aria-invalid={Boolean(errors.titulo)}
            aria-describedby={errors.titulo ? 'error-recompensa-titulo' : undefined} {...register('titulo')} />
          {errors.titulo && <p id="error-recompensa-titulo" className="mt-1 text-amber-400" role="alert">{errors.titulo.message}</p>}
        </div>
        <div>
          <label htmlFor="recompensa-habito" className="font-medium">Hábito asociado</label>
          <select id="recompensa-habito" className={estiloCampo} aria-invalid={Boolean(errors.habitoId)}
            aria-describedby={errors.habitoId ? 'error-recompensa-habito' : undefined}
            {...register('habitoId', { setValueAs: (valor: string) => Number(valor) })}>
            <option value="">Seleccione un hábito</option>
            {habitos.map(habito => <option key={habito.id} value={habito.id}>{habito.nombre}</option>)}
          </select>
          {errors.habitoId && <p id="error-recompensa-habito" className="mt-1 text-amber-400" role="alert">{errors.habitoId.message}</p>}
        </div>
        <div>
          <label htmlFor="recompensa-dias" className="font-medium">Días consecutivos requeridos</label>
          <input id="recompensa-dias" className={estiloCampo} type="number" min={1} step={1}
            aria-invalid={Boolean(errors.diasRequeridos)} aria-describedby={errors.diasRequeridos ? 'error-recompensa-dias' : undefined}
            {...register('diasRequeridos', { valueAsNumber: true })} />
          {errors.diasRequeridos && <p id="error-recompensa-dias" className="mt-1 text-amber-400" role="alert">{errors.diasRequeridos.message}</p>}
        </div>
        <div>
          <label htmlFor="recompensa-stock" className="font-medium">Stock disponible</label>
          <input id="recompensa-stock" className={estiloCampo} type="number" min={0} step={1}
            aria-invalid={Boolean(errors.stock)} aria-describedby={errors.stock ? 'error-recompensa-stock' : undefined}
            {...register('stock', { valueAsNumber: true })} />
          {errors.stock && <p id="error-recompensa-stock" className="mt-1 text-amber-400" role="alert">{errors.stock.message}</p>}
        </div>
      </fieldset>
      {errors.root?.servidor && <p className="mt-3 text-sm text-red-300" role="alert">{errors.root.servidor.message}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 px-4 text-white hover:bg-indigo-500 disabled:opacity-50">
          {isSubmitting ? 'Guardando…' : 'Guardar recompensa'}
        </Button>
        <Button onClick={onCancelar} disabled={isSubmitting} className="bg-slate-700 px-4 hover:bg-slate-600 disabled:opacity-50">
          Cancelar
        </Button>
      </div>
    </form>
  )
}
