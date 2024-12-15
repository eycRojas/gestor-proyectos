import { Component } from '@angular/core';
import { NavbarComponent } from '../../core/navbar/navbar.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProyectoService } from '../../../services/proyecto.service';
import { ProyectoDTO } from '../../models/proyectoDTO';
import { UsuarioService } from '../../../services/usuario.service';
import { UsuarioDTO } from '../../models/usuarioDTO';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-mis-proyectos',
  standalone: true,
  imports: [NavbarComponent, ButtonModule, CardModule, RouterModule],
  templateUrl: './mis-proyectos.component.html',
  styleUrl: './mis-proyectos.component.css',
})
export class MisProyectosComponent {
  usuario: UsuarioDTO | null = null;
  proyectos: ProyectoDTO[] = [];

  constructor(
    private proyectoService: ProyectoService,
    private usuarioService: UsuarioService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    const usuarioIdString = localStorage.getItem('usuarioId');
    const usuarioId: number = Number(usuarioIdString);
    this.usuarioService.getUsuarioById(usuarioId).subscribe({
      next: (usuarioDTO) => {
        this.usuario = usuarioDTO;           
        this.getProyectosByUsuarioId(this.usuario.id);
        this.usuarioService.setUsuario(this.usuario);
      }
    })
  }

  getProyectosByUsuarioId(usuarioId: number) {
    this.proyectoService
      .getProyectosByUsuarioId(usuarioId)
      .subscribe((data) => {
        this.proyectos = data;
      });
  }

  deleteProyecto(id: number) {
    this.proyectoService.deleteProyecto(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Proyecto eliminado correctamente',
        });
        if (this.usuario) {
          this.getProyectosByUsuarioId(this.usuario.id);
          this.usuarioService.getUsuarioById(this.usuario.id).subscribe({
            next: (usuario) => {
              this.usuarioService.setUsuario(usuario);
            }
          })
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar',
        });
      },
    });
  }
}
