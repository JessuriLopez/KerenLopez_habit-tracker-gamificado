import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { Button } from '../../../components/Button'
import { registrarUsuarioAsync } from '../api/authApi'
import { registroSchema, type RegistroSchemaType } from '../schemas/registro.schema'
import { CampoAuth } from './CampoAuth'

interface RegistroFormProps {
  onIrAlLogin: () => void
  onVolver: () => void
  onRegistrado: () => void
}

export function RegistroForm({ onIrAlLogin, onVolver, onRegistrado }: RegistroFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegistroSchemaType>({
    resolver: zodResolver(registroSchema),
    defaultValues: { nombre: '', correo: '', contrasena: '' },
  })

  const registrar = async (datos: RegistroSchemaType) => {
    try {
      await registrarUsuarioAsync(datos)
      onRegistrado()
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        setError('correo', { message: 'El correo electrónico ya está registrado.' }, { shouldFocus: true })
        return
      }

      setError('root.servidor', {
        message: 'No se pudo completar el registro. Revise los datos o vuelva a intentarlo.',
      })
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-lg">
      <h1 className="text-2xl font-bold text-white">Crear cuenta</h1>
      <p className="mt-2 text-sm text-slate-300">
        Complete los campos para registrarse como Jugador. Use una contraseña de 12 a 128 caracteres.
      </p>

      <form className="mt-6 space-y-4" noValidate onSubmit={handleSubmit(registrar)}>
        <CampoAuth
          id="registro-nombre"
          etiqueta="Nombre"
          type="text"
          autoComplete="name"
          registro={register('nombre')}
          error={errors.nombre?.message}
        />
        <CampoAuth
          id="registro-correo"
          etiqueta="Correo electrónico"
          type="email"
          autoComplete="email"
          registro={register('correo')}
          error={errors.correo?.message}
        />
        <CampoAuth
          id="registro-contrasena"
          etiqueta="Contraseña"
          type="password"
          autoComplete="new-password"
          registro={register('contrasena')}
          error={errors.contrasena?.message}
        />

        {errors.root?.servidor && (
          <p className="text-sm text-amber-400" role="alert">{errors.root.servidor.message}</p>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 px-4 text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
          </Button>
          <Button onClick={onIrAlLogin} disabled={isSubmitting} className="bg-slate-700 px-4 text-slate-200 hover:bg-slate-600">
            Ir al inicio de sesión
          </Button>
          <Button onClick={onVolver} disabled={isSubmitting} className="px-4 text-slate-200 hover:bg-slate-700">
            Volver al catálogo
          </Button>
        </div>
      </form>
    </section>
  )
}
