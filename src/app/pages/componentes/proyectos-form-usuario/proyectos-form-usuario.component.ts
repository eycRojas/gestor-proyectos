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
import { UsuarioService } from '../../../services/usuario.service';
import { UsuarioAsignadoDTO } from '../../models/usuarioAsignadoDTO';
import { TareaDTO } from '../../models/tareaDTO';
import { Tarea } from '../../models/tarea';
import { TareaService } from '../../../services/tarea.service';
import { DropdownModule } from 'primeng/dropdown';
import { ProyectoDTO } from '../../models/proyectoDTO';
import { CommonModule } from '@angular/common';
import { UsuarioDTO } from '../../models/usuarioDTO';

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
    DropdownModule,
    CommonModule
  ],
  templateUrl: './proyectos-form-usuario.component.html',
  styleUrl: './proyectos-form-usuario.component.css',
})
export class ProyectosFormUsuarioComponent {
  formProyecto!: FormGroup;
  formUsuario!: FormGroup;
  formTarea!: FormGroup;
  formEmail!: FormGroup;
  isSaveInProgress: boolean = false;
  usuarioId: any;
  usuariosAsignados: UsuarioAsignadoDTO[] = [];
  usuario: UsuarioDTO | null = null;
  tareas: TareaDTO[] = [];
  proyecto: ProyectoDTO | null = null;
  emailUsuariosParaTareas: UsuarioAsignadoDTO[] = [];
  nuevaTarea: Tarea | null = null;

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
      descripcion: ['', Validators.required]

    });
    this.formUsuario = this.formBuilder.group({
      emailUsuario: ['', Validators.required]

    });
    this.formTarea = this.formBuilder.group({
      descripcion: ['', Validators.required],
    });

    this.formEmail = this.formBuilder.group({
      emailUsuarioAsignado: ['', Validators.required]
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
        this.proyecto = foundProyecto;
        this.formProyecto.patchValue(this.proyecto);
        this.usuariosAsignados = this.proyecto.usuariosAsignados;
        this.tareas = this.proyecto.tareas;
        this.usuarioId = this.proyecto.creadorId;
        this.emailUsuariosParaTareas = this.proyecto.usuariosAsignados;
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
    this.proyectoService.updateProyecto(this.formProyecto.value, this.usuarioId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'succes',
          summary: 'Creado',
          detail: 'Nombre y descripcion guardadas correctamente',
        });
        this.router.navigateByUrl('/proyectos/proyectos-form-usuario/' + this.proyecto?.id);
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

  addParticpante() {
    const formDataUsuario = this.formUsuario.value;
    this.usuarioService.getUsuarioByEmail(formDataUsuario.emailUsuario).subscribe({
      next: (usuarioDTO) => {

        if (this.proyecto) {
          this.proyectoService.addParticipante(this.proyecto.id, usuarioDTO.id).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'succes',
                summary: 'Creado',
                detail: 'Usuario agregado al proyecto correctamente',
              });

              this.router.navigateByUrl('/proyectos/proyectos-form-usuario/' + this.proyecto?.id);
            },
            error: (error) => {
              console.log(error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'El usuario no se agregó al proyecto correctamente',
              });
            }
          })
        }

      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Usuario con email ' + formDataUsuario.emailUsuario + ' no encontrado. Ingrese un email existente',
        });
        this.router.navigateByUrl('/proyectos/proyectos-form-usuario/' + this.proyecto?.id);
      },
    });
  }

  saveTarea() {
    if (this.formTarea.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Revise los campos e intente nuevamente',
      });
      return;
    }
    const formDataEmail = this.formEmail.value;
    const emailAsignado = formDataEmail.emailUsuarioAsignado.email;
    console.log(emailAsignado);
    this.usuarioService.getUsuarioByEmail(emailAsignado).subscribe({
      next: (usuarioDTO) => {
        if (this.proyecto) {
          this.tareaService.saveTarea(this.proyecto.id, usuarioDTO.id, this.formTarea.value).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'succes',
                summary: 'Creado',
                detail: 'Tarea creada y asignada correctamente',
              });
              this.router.navigateByUrl('/proyectos/proyectos-form-usuario/' + this.proyecto?.id);
            },
            error: (error) => {
              console.log(error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Erro al agregar la tarea',
              });
            }
          })

        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Erro al agregar la tarea',
        });
        this.router.navigateByUrl('/proyectos/proyectos-form-usuario/' + this.proyecto?.id);
      },
    });
  }
}
