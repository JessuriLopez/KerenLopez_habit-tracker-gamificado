
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import type { Sesion } from '../features/auth/types/sesion.types'

// Contrato del componente
interface AppLayoutProps {
  children: ReactNode
  usuario?: Sesion['usuario']
  onCerrarSesion: () => void
}

export function AppLayout({ children, usuario, onCerrarSesion }: AppLayoutProps) {
  const botonSalir = usuario && (
    <Button
      onClick={onCerrarSesion}
      className="bg-indigo-600 px-3 text-white hover:bg-indigo-500"
    >
      Cerrar sesión
    </Button>
  )

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">

      {/* 1. MENÚ LATERAL */}
      <aside className="hidden md:flex md:w-64 md:flex-col bg-slate-950 border-r border-slate-800 justify-between p-5 shrink-0">
        <div>
          {/* Identidad de HabitForge */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow">
              HF
            </div>

            <span className="text-xl font-bold tracking-tight text-white">
              HabitForge
            </span>
          </div>

          {/* Navegación */}
          {usuario && <nav className="space-y-2" aria-label="Menú principal">
            <Link
              to="/catalogo"
              className="flex items-center gap-3 px-3 py-2.5 bg-indigo-600/15 text-indigo-400 rounded-lg font-medium text-sm border border-indigo-500/20"
            >
              <span>🌐</span> {usuario.rol === 'GameMaster' ? 'Administrar catálogo' : 'Catálogo Global'}
            </Link>
          </nav>}
        </div>

        {/* Estado de seguridad */}
        <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800">
          <p className="text-xs text-slate-400 mb-1">
            Estado de Seguridad
          </p>

          <p className="text-sm font-semibold text-amber-400">
            {usuario ? `${usuario.nombre} · ${usuario.rol}` : '👤 Modo Invitado'}
          </p>
          {botonSalir && <div className="mt-3">{botonSalir}</div>}
        </div>
      </aside>

      {/* 2. CABECERA MÓVIL */}
      <header className="md:hidden bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center font-bold text-sm text-white">
            HF
          </div>

          <span className="font-bold text-lg text-white">
            HabitForge
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <span className="text-xs bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-md border border-amber-500/20 font-medium">
            {usuario?.rol ?? '👤 Invitado'}
          </span>
          {botonSalir}
        </div>
      </header>

      {/* 3. CONTENIDO CENTRAL */}
      <main className="flex-1 min-w-0 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>

    </div>
  )
}
