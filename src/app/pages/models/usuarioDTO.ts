import { Proyecto } from "./proyecto";
import { ProyectoAsignadoDTO } from "./proyectoAsignadoDTO";
import { ProyectoDTO } from "./proyectoDTO";
import { Tarea } from "./tarea";
import { TareaDTO } from "./tareaDTO";

export interface UsuarioDTO {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  proyectosCreados: ProyectoDTO[];
  proyectosAsignados: ProyectoAsignadoDTO[];
  tareasAsignadas: TareaDTO[];
}
