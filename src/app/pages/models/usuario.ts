import { Proyecto } from "./proyecto";
import { Tarea } from "./tarea";

export interface Usuario {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  contrasenia: string;
}
