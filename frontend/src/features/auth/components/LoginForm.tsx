import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../../../components/Button'
import { loginSchema, type LoginSchemaType } from '../schemas/login.schema'
import { CampoAuth } from './CampoAuth'

interface LoginFormProps {
  onVolver: () => void
  onAbrirRegistro: () => void
  registroCompletado: boolean
}

export function LoginForm({ onVolver, onAbrirRegistro, registroCompletado }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { correo: '', contrasena: '' },
  })

  return (
    <section className="mx-auto max-w-md rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-lg">
      <h1 className="text-2xl font-bold text-white">Inicio de sesión</h1>
      {registroCompletado && (
        <p className="mt-2 text-sm text-emerald-400" role="status">Su cuenta de Jugador se creó correctamente.</p>
      )}
      <p className="mt-2 text-sm text-slate-300">
        La conexión con el servidor está pendiente. Por ahora, el formulario solo valida los campos.
      </p>

      <form
        className="mt-6 space-y-4"
        noValidate
        onSubmit={handleSubmit(() => {})}
      >
        <CampoAuth
          id="login-correo"
          etiqueta="Correo electrónico"
          type="email"
          autoComplete="username"
          registro={register('correo')}
          error={errors.correo?.message}
        />

        <CampoAuth
          id="login-contrasena"
          etiqueta="Contraseña"
          type="password"
          autoComplete="current-password"
          registro={register('contrasena')}
          error={errors.contrasena?.message}
        />

        {isSubmitSuccessful && (
          <p className="text-sm text-amber-400" role="status">
            Inicio de sesión pendiente de conexión con el servidor. No se enviaron los datos.
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <Button type="submit" className="bg-indigo-600 px-4 text-white hover:bg-indigo-500">
            Iniciar sesión
          </Button>
          <Button onClick={onVolver} className="bg-slate-700 px-4 text-slate-200 hover:bg-slate-600">
            Volver al catálogo
          </Button>
          <Button onClick={onAbrirRegistro} className="px-4 text-indigo-300 hover:bg-slate-700">
            Crear cuenta
          </Button>
        </div>
      </form>
    </section>
  )
}
