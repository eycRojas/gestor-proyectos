import { Proyecto } from "./proyecto";
import { Tarea } from "./tarea";

export interface UsuarioAsignadoDTO {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
}
