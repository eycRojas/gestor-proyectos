import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TareaDTO } from '../pages/models/tareaDTO';
import { Observable } from 'rxjs';
import { Tarea } from '../pages/models/tarea';

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  private apiUrl = 'http://localhost:8080/tarea';

  constructor(private http:HttpClient) { }

  getAllTareas():Observable<TareaDTO[]>{
    return this.http.get<TareaDTO[]>(this.apiUrl);
  }

  getTareaById(id: number): Observable<TareaDTO> {
    return this.http.get<TareaDTO>(`${this.apiUrl}/${id}`);
  }

  saveTarea(proyectoId: number, usuarioId: number, tarea: Tarea) : Observable<TareaDTO>{    
    tarea.estado = "PENDIENTE";
    tarea.nombre = "tarea";
    console.log(`${this.apiUrl}/${proyectoId}/${usuarioId}`, tarea);
    return this.http.post<TareaDTO>(`${this.apiUrl}/${proyectoId}/${usuarioId}`, tarea);
  }

  updateTarea(tarea: Tarea): Observable<Tarea>{
    console.log(tarea.id, tarea.descripcion, tarea.estado);
    console.log(this.apiUrl, tarea);
    return this.http.put<Tarea>(this.apiUrl, tarea);
  }

  deleteTarea(proyectoId: number, usuarioId: number){
    return this.http.delete(`${this.apiUrl}/${proyectoId}/${usuarioId}`);
  }

}
