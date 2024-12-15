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
import { UsuarioDTO } from '../../models/usuarioDTO';
import { UsuarioAsignadoDTO } from '../../models/usuarioAsignadoDTO';
import { TareaDTO } from '../../models/tareaDTO';
import { UsuarioService } from '../../../services/usuario.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TareaService } from '../../../services/tarea.service';
import { CommonModule } from '@angular/common';
import { ProyectoDTO } from '../../models/proyectoDTO';


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
    RadioButtonModule,
    CommonModule
  ],
  templateUrl: './proyectos-form-tareas.component.html',
  styleUrl: './proyectos-form-tareas.component.css',
})
export class ProyectosFormTareasComponent {
  formProyecto!: FormGroup;
  formTarea!: FormGroup;
  isSaveInProgress: boolean = false;
  usuarioId: any;
  usuario: UsuarioDTO | null = null;
  usuariosAsignados: UsuarioAsignadoDTO[] | null = null;
  tareas: TareaDTO[] | null = null;
  estadosTarea: string[] = ["PENDIENTE", "EN PROCESO", "TERMINADA"];
  proyecto: ProyectoDTO | null = null;


  constructor(
    private formBuilder: FormBuilder,
    private proyectoService: ProyectoService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    private usuarioService: UsuarioService,
    private tareaService: TareaService
  ) {
    this.formProyecto = this.formBuilder.group({
      id: [null],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
    });

    this.formTarea = this.formBuilder.group({
      estadoSeleccionado: ['', Validators.required] // Esta propiedad almacenará el valor seleccionado
    });
  }

  ngOnInit(): void {
    const usuarioIdString = localStorage.getItem('usuarioId');
    const usuarioId: number = Number(usuarioIdString);
    this.usuarioService.getUsuarioById(usuarioId).subscribe({
      next: (usuarioDTO) => {
        this.usuario = usuarioDTO;
        this.usuarioId = this.usuario?.id;
        let id = this.activatedRoute.snapshot.paramMap.get('id');
        if (id !== 'new') {
          this.getProyectoById(+id!);
        }

        this.usuarioService.setUsuario(this.usuario);
      }
    })
  }

  getProyectoById(id: number) {
    this.proyectoService.getProyectoById(id).subscribe({
      next: (foundProyecto) => {
        this.formProyecto.patchValue(foundProyecto);
        this.usuariosAsignados = foundProyecto.usuariosAsignados;
        this.tareas = foundProyecto.tareas;
        this.proyecto = foundProyecto;
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

  updateTarea(event: any, tareaId: number) {
    console.log("Evento recibido:", event);
    console.log("Tarea id:", tareaId);
    this.tareaService.getTareaById(tareaId).subscribe({
      next: (tarea) => {
        tarea.estado = event;
        this.tareaService.updateTarea(tarea).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'succes',
              summary: 'Creado',
              detail: 'Estado de la tarea actualizado correctamente',
            });
            if (this.usuario) {
              this.usuarioService.getUsuarioById(this.usuario.id).subscribe({
                next: (usuario) => {
                  this.usuarioService.setUsuario(usuario);
                }
              })
            }
            this.router.navigateByUrl("/proyectos/proyectos-form-tareas/" + this.proyecto?.id);
          },
          error: () => {
            this.messageService.add({
              severity: 'succes',
              summary: 'Creado',
              detail: 'El estado de la tarea no se pudo actualizar correctamente',
            });
          }
        })
      }
    })
  }
}
