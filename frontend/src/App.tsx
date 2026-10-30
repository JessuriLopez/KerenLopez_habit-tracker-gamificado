
import './App.css'
import { HabitoGlobalCard } from './components/HabitoGlobalCard'

function App() {
  return (
    <main>
      <h1>Catálogo Global de Hábitos</h1>
      <p>Explora los hábitos disponibles en nuestra base de datos.</p>

      <section className="habits-container">
        <HabitoGlobalCard
          id={1}
          nombre="Beber 2 Litros de Agua"
        />

        <HabitoGlobalCard
          id={2}
          nombre="Hacer 30 minutos de ejercicio"
        />

        <HabitoGlobalCard
          id={3}
          nombre="Leer 10 páginas de un libro"
        />
      </section>
    </main>
  )
}

export default App
