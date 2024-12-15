import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProyectoDTO } from '../pages/models/proyectoDTO';
import { Observable } from 'rxjs';
import { Proyecto } from '../pages/models/proyecto';
import { Usuario } from '../pages/models/usuario';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  private apiUrl = 'http://localhost:8080/proyecto';

  constructor(private http: HttpClient) { }

  getAllProyectos(): Observable<ProyectoDTO[]> {
    return this.http.get<ProyectoDTO[]>(this.apiUrl);
  }

  getProyectosByUsuarioId(usuarioId: number): Observable<ProyectoDTO[]> {
    return this.http.get<ProyectoDTO[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  getProyectoById(id: number): Observable<ProyectoDTO> {
    return this.http.get<ProyectoDTO>(`${this.apiUrl}/${id}`);
  }

  saveProyecto(proyecto: Proyecto, usuarioId: number): Observable<Proyecto> {
    console.log(proyecto);
    return this.http.post<Proyecto>(`${this.apiUrl}/${usuarioId}`, proyecto);
  }

  updateProyecto(proyecto: Proyecto, usuarioId: number) {
    return this.http.put(`${this.apiUrl}/${usuarioId}`, proyecto);
  }

  deleteProyecto(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  addParticipante(proyectoId: number, usuarioId: number){   
    console.log(proyectoId, usuarioId)
    console.log(`${this.apiUrl}/addParticipante/${proyectoId}/${usuarioId}`);
    return this.http.post(`${this.apiUrl}/addParticipante/${proyectoId}/${usuarioId}`, {});
  }
}
