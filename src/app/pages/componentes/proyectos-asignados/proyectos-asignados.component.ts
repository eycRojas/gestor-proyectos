import { Component } from '@angular/core';
import { NavbarComponent } from '../../core/navbar/navbar.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProyectoService } from '../../../services/proyecto.service';
import { ProyectoDTO } from '../../models/proyectoDTO';
import { UsuarioService } from '../../../services/usuario.service';
import { UsuarioDTO } from '../../models/usuarioDTO';
import { ProyectoAsignadoDTO } from '../../models/proyectoAsignadoDTO';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-proyectos-asignados',
  standalone: true,
  imports: [NavbarComponent, ButtonModule, CardModule, RouterModule],
  templateUrl: './proyectos-asignados.component.html',
  styleUrl: './proyectos-asignados.component.css'
})
export class ProyectosAsignadosComponent {
  usuario: UsuarioDTO | null = null;
  proyectos: ProyectoAsignadoDTO[] = [];

  constructor(
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.usuario = this.usuarioService.getUsuario();
    if (this.usuario) {
      this.proyectos = this.usuario.proyectosAsignados;
      console.log(this.proyectos)
    }
  }
}