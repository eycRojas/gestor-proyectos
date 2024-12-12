import { Component } from '@angular/core';
import { NavbarComponent } from '../../core/navbar/navbar.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProyectoService } from '../../../services/proyecto.service';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { UsuarioDTO } from '../../models/usuarioDTO';
import { UsuarioService } from '../../../services/usuario.service';
import { UsuarioAsignadoDTO } from '../../models/usuarioAsignadoDTO';
import { TareaDTO } from '../../models/tareaDTO';

@Component({
  selector: 'app-proyectos-form',
  standalone: true,
  imports: [
    NavbarComponent,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    RouterModule,
    InputTextModule,
    InputNumberModule,
  ],
  templateUrl: './proyectos-form-tareas.component.html',
  styleUrl: './proyectos-form-tareas.component.css',
})
export class ProyectosFormTareasComponent {
  formProyecto!: FormGroup;
  isSaveInProgress: boolean = false;
  usuarioId: any;
  usuario: UsuarioDTO | null = null;
  usuariosAsignados: UsuarioAsignadoDTO[] | null = null;
  tareas: TareaDTO[] | null = null;
  

  constructor(
    private formBuilder: FormBuilder,
    private proyectoService: ProyectoService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
  ) {
    this.formProyecto = this.formBuilder.group({
      id: [null],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'new') {
      this.getProyectoById(+id!);
    }
  }

  getProyectoById(id: number) {
    this.proyectoService.getProyectoById(id).subscribe({
      next: (foundProyecto) => {
        this.formProyecto.patchValue(foundProyecto);
        this.usuariosAsignados = foundProyecto.usuariosAsignados;
        this.tareas = foundProyecto.tareas;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Proyecto no encontrados',
        });
        this.router.navigateByUrl('/proyecto/mis-proyectos');
      },
    });
  }

  updateProyecto() {
    if (this.formProyecto.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Revise los campos e intente nuevamente',
      });
      return;
    }
    if (this.usuario) {
      this.usuarioId = this.usuario.id;
      this.proyectoService.updateProyecto(this.formProyecto.value, this.usuarioId).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'succes',
            summary: 'Creado',
            detail: 'Proyecto guardado correctamente',
          });
          this.router.navigateByUrl('/proyectos/mis-proyectos');
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Revise los campos e intente nuevamente',
          });
        },
      });
    }
  }
}
