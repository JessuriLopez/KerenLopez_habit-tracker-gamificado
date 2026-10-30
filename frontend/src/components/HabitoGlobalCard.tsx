
interface HabitoGlobalProps {
  id: number;
  nombre: string;
}

export function HabitoGlobalCard({ id, nombre }: HabitoGlobalProps) {
  return (
    <article
      className="habit-card"
      style={{
        border: '1px solid #ccc',
        padding: '1rem',
        margin: '1rem',
        borderRadius: '8px'
      }}
    >
      <small style={{ color: 'gray' }}>
        ID Catálogo: {id}
      </small>

      <h3>{nombre}</h3>

      <button disabled style={{ cursor: 'not-allowed' }}>
        Adoptar Hábito (Próximamente)
      </button>
    </article>
  );
}
