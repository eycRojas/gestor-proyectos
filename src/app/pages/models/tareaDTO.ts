export interface TareaDTO{
    id: number;
    nombre: string;
    descripcion: string;
    estado: string;

    proyectoId: number;
    nombreProyecto: string;

    usuarioId: number;
    nombreUsuario: string;
}