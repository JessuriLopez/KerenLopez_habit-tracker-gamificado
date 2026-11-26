export type RolUsuario = 'Jugador' | 'GameMaster'

export interface Sesion {
  token: string
  expiraEn: string
  usuario: { id: number; nombre: string; rol: RolUsuario }
}
