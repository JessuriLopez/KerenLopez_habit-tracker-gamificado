
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { LoginForm } from './features/auth/components/LoginForm'
import { RegistroForm } from './features/auth/components/RegistroForm'
import { useSesion } from './features/auth/hooks/useSesion'
import { CatalogoHabitosView } from './features/habitos/components/CatalogoHabitosView'
import { MisPremiosView } from './features/cupones/components/MisPremiosView'
import { RecompensasView } from './features/recompensas/components/RecompensasView'
import { AppLayout } from './layouts/AppLayout'

function RutasHabitForge() {
  const { sesion, iniciarSesion, cerrarSesion } = useSesion()
  const navegar = useNavigate()
  const ubicacion = useLocation()
  const entrada = sesion ? '/catalogo' : '/login'

  return (
    <AppLayout usuario={sesion?.usuario} onCerrarSesion={cerrarSesion}>
      <Routes>
        <Route path="/login" element={sesion ? <Navigate to="/catalogo" replace /> : (
          <LoginForm
            onAutenticado={iniciarSesion}
            onAbrirRegistro={() => navegar('/registro')}
            registroCompletado={ubicacion.state?.registroCompletado === true}
          />
        )} />
        <Route path="/registro" element={sesion ? <Navigate to="/catalogo" replace /> : (
          <RegistroForm
            onIrAlLogin={() => navegar('/login', { replace: true })}
            onRegistrado={() => navegar('/login', { replace: true, state: { registroCompletado: true } })}
          />
        )} />
        <Route path="/catalogo" element={sesion ? (
          <CatalogoHabitosView token={sesion.token} puedeAdministrar={sesion.usuario.rol === 'GameMaster'} />
        ) : <Navigate to="/login" replace />} />
        <Route path="/recompensas" element={sesion?.usuario.rol === 'GameMaster'
          ? <RecompensasView token={sesion.token} />
          : <Navigate to={entrada} replace />} />
        <Route path="/mis-premios" element={sesion?.usuario.rol === 'Jugador'
          ? <MisPremiosView key={sesion.usuario.id} token={sesion.token} />
          : <Navigate to={entrada} replace />} />
        <Route path="*" element={<Navigate to={entrada} replace />} />
      </Routes>
    </AppLayout>
  )
}

function App() {
  return (
    <BrowserRouter>
      <RutasHabitForge />
    </BrowserRouter>
  )
}

export default App
