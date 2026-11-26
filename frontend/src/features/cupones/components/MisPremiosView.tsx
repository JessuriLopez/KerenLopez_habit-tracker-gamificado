import { useEffect, useState } from 'react'
import { Button } from '../../../components/Button'
import { obtenerMisPremios, type PremioObtenido } from '../api/cuponesApi'

const formatoFecha = new Intl.DateTimeFormat('es-HN', {
  dateStyle: 'long',
  timeZone: 'America/Tegucigalpa',
})

export function MisPremiosView({ token }: { token: string }) {
  const [premios, setPremios] = useState<PremioObtenido[] | null>(null)
  const [error, setError] = useState(false)
  const [revision, setRevision] = useState(0)

  useEffect(() => {
    const solicitud = new AbortController()
    obtenerMisPremios(token, solicitud.signal).then(datos => {
      if (!solicitud.signal.aborted) setPremios(datos)
    }).catch(() => {
      if (!solicitud.signal.aborted) setError(true)
    })
    return () => solicitud.abort()
  }, [token, revision])

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <h1 className="text-2xl font-bold text-white md:text-3xl">Mis Premios</h1>
        {premios && <p className="text-sm text-slate-300">Total obtenido: <strong>{premios.length}</strong></p>}
      </div>

      {!premios && !error && <p role="status" className="text-slate-300">Cargando sus premios…</p>}
      {error && (
        <div role="alert" className="rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-sm text-red-300">
          No se pudieron cargar sus premios.
          <Button onClick={() => {
            setError(false)
            setRevision(actual => actual + 1)
          }} className="ml-3 px-3 text-indigo-300 hover:bg-slate-700">
            Volver a intentar
          </Button>
        </div>
      )}
      {premios?.length === 0 && (
        <p className="rounded-xl border border-slate-700 bg-slate-800 p-5 text-slate-300">
          Aún no tiene premios. Siga completando sus hábitos para alcanzar su próxima meta.
        </p>
      )}
      {premios && premios.length > 0 && (
        <>
          <p className="mb-4 text-sm text-slate-400">Los títulos y hábitos corresponden al catálogo vigente.</p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {premios.map(premio => (
              <article key={premio.id} className="rounded-xl border border-slate-700 bg-slate-800 p-5">
                <h2 className="break-words text-lg font-bold text-white">{premio.tituloRecompensa}</h2>
                <p className="mt-2 break-words text-sm text-slate-300">Hábito: {premio.habitoAsociado}</p>
                <p className="mt-1 text-sm text-slate-300">
                  Obtenido el <time dateTime={premio.obtenidoEn}>{formatoFecha.format(new Date(premio.obtenidoEn))}</time>
                </p>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
