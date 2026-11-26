import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { Button } from '../../../components/Button'
import { iniciarSesionAsync } from '../api/authApi'
import { loginSchema, type LoginSchemaType } from '../schemas/login.schema'
import type { Sesion } from '../types/sesion.types'
import { CampoAuth } from './CampoAuth'

interface LoginFormProps {
  onAutenticado: (sesion: Sesion) => void
  onAbrirRegistro: () => void
  registroCompletado: boolean
}

export function LoginForm({ onAutenticado, onAbrirRegistro, registroCompletado }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { correo: '', contrasena: '' },
  })

  const enviar = async (datos: LoginSchemaType) => {
    try {
      onAutenticado(await iniciarSesionAsync(datos))
    } catch (error) {
      setError('root.servidor', {
        message: isAxiosError(error) && error.response?.status === 401
          ? 'El correo o la contraseña son incorrectos.'
          : 'No se pudo iniciar sesión. Vuelva a intentarlo.',
      })
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-lg">
      <h1 className="text-2xl font-bold text-white">Inicio de sesión</h1>
      {registroCompletado && (
        <p className="mt-2 text-sm text-emerald-400" role="status">Su cuenta de Jugador se creó correctamente.</p>
      )}

      <form
        className="mt-6 space-y-4"
        noValidate
        onSubmit={handleSubmit(enviar)}
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

        {errors.root?.servidor && (
          <p className="text-sm text-amber-400" role="alert">
            {errors.root.servidor.message}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 px-4 text-white hover:bg-indigo-500 disabled:opacity-50">
            {isSubmitting ? 'Iniciando sesión…' : 'Iniciar sesión'}
          </Button>
          <Button onClick={onAbrirRegistro} disabled={isSubmitting} className="px-4 text-indigo-300 hover:bg-slate-700">
            Crear cuenta
          </Button>
        </div>
      </form>
    </section>
  )
}
