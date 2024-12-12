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
    this.usuario = this.usuarioService.getUsuario();
    if (this.usuario) {
      this.getProyectosByUsuarioId(this.usuario.id); // Solo llama a la función si usuario no es null
    }
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
