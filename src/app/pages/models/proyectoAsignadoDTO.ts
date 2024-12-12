import { Tarea } from "./tarea";
import { UsuarioAsignadoDTO } from "./usuarioAsignadoDTO";

export interface ProyectoAsignadoDTO{
    id: number;
    nombre: string;
    descripcion: string;
    creadorId: number;
    nombreCompletoCreador: string;
}