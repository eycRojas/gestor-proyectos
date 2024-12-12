import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../pages/models/usuario';
import { UsuarioDTO } from '../pages/models/usuarioDTO';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:8080/usuario'

  constructor(private http:HttpClient) { }

  private currentUsuarioSubject = new BehaviorSubject<UsuarioDTO | null>(null);
  currentUsuario = this.currentUsuarioSubject.asObservable();

  setUsuario(usuario: UsuarioDTO) {
    this.currentUsuarioSubject.next(usuario);
  }

  getUsuario() {
    return this.currentUsuarioSubject.getValue();
  }

  getAllUsuarios():Observable<UsuarioDTO[]>{
    return this.http.get<UsuarioDTO[]>(this.apiUrl);
  }

  getUsuarioById(id: number): Observable<UsuarioDTO> {
    return this.http.get<UsuarioDTO>(`${this.apiUrl}/${id}`);
  }

  saveUsuario(usuario: Usuario) : Observable<Usuario>{
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  updateUsuario(usuario: Usuario){
    return this.http.put(this.apiUrl, usuario);
  }

  deleteUsuario(id: number){
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getUsuarioByEmail(email: string): Observable<UsuarioDTO> {
    return this.http.get<UsuarioDTO>(`${this.apiUrl}/email/${email}`);
  }

}
