
import { useState } from 'react'
import { LoginForm } from './features/auth/components/LoginForm'
import { RegistroForm } from './features/auth/components/RegistroForm'
import { CatalogoHabitosView } from './features/habitos/components/CatalogoHabitosView'
import { AppLayout } from './layouts/AppLayout'

type Vista = 'catalogo' | 'login' | 'registro' | 'registro-completado'

function App() {
  const [vista, setVista] = useState<Vista>('catalogo')
  const volverAlCatalogo = () => setVista('catalogo')
  const abrirLogin = () => setVista('login')

  return (
    <AppLayout
      onAbrirLogin={abrirLogin}
      onVolverAlCatalogo={volverAlCatalogo}
    >
      <div hidden={vista !== 'catalogo'}>
        <CatalogoHabitosView />
      </div>
      {(vista === 'login' || vista === 'registro-completado') && (
        <LoginForm
          onVolver={volverAlCatalogo}
          onAbrirRegistro={() => setVista('registro')}
          registroCompletado={vista === 'registro-completado'}
        />
      )}
      {vista === 'registro' && (
        <RegistroForm
          onVolver={volverAlCatalogo}
          onIrAlLogin={abrirLogin}
          onRegistrado={() => setVista('registro-completado')}
        />
      )}
    </AppLayout>
  )
}

export default App
