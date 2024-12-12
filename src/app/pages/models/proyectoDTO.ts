import { Tarea } from "./tarea";
import { TareaDTO } from "./tareaDTO";
import { Usuario } from "./usuario";
import { UsuarioAsignadoDTO } from "./usuarioAsignadoDTO";

export interface ProyectoDTO{
    id: number;
    nombre: string;
    descripcion: string;
    creadorId: number;
    nombreCompletoCreador: string;
    tareas: TareaDTO[];
    usuariosAsignados: UsuarioAsignadoDTO[];
}