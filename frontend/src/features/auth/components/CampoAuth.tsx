import type { UseFormRegisterReturn } from 'react-hook-form'

interface CampoAuthProps {
  id: string
  etiqueta: string
  type: 'text' | 'email' | 'password'
  autoComplete: string
  registro: UseFormRegisterReturn
  error?: string
}

const estilosCampo = 'w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none aria-invalid:border-amber-500'

export function CampoAuth({ id, etiqueta, type, autoComplete, registro, error }: CampoAuthProps) {
  const idError = `${id}-error`

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-white">
        {etiqueta}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        className={estilosCampo}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? idError : undefined}
        {...registro}
      />
      {error && (
        <p id={idError} className="mt-1 text-sm text-amber-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
