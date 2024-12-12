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

  saveTarea(usuario: Tarea) : Observable<Tarea>{
    return this.http.post<TareaDTO>(this.apiUrl, usuario);
  }

  updateTarea(usuario: Tarea){
    return this.http.put(this.apiUrl, usuario);
  }

  deleteTarea(proyectoId: number, usuarioId: number){
    return this.http.delete(`${this.apiUrl}/${proyectoId}/${usuarioId}`);
  }

}
