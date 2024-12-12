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
import { Tarea } from '../../models/tarea';
import { Proyecto } from '../../models/proyecto';

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
  templateUrl: './proyectos-form-usuario.component.html',
  styleUrl: './proyectos-form-usuario.component.css',
})
export class ProyectosFormUsuarioComponent {
  formProyecto!: FormGroup;
  formUsuario!: FormGroup;
  formTarea!: FormGroup;
  isSaveInProgress: boolean = false;
  usuarioId: any;
  usuariosAsignados: UsuarioAsignadoDTO[] | null = null;
  tareas: TareaDTO[] | null = null;
  nuevaTarea: Tarea | null = null;
  proyecto: Proyecto | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private proyectoService: ProyectoService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    private usuarioService: UsuarioService
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
      nombreTarea: ['', Validators.required],
      descripcionTarea: ['', Validators.required],
      emailUsuarioAsignado: ['', Validators.required]

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
        this.usuarioId = foundProyecto.creadorId;
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
    console.log(this.formUsuario.value);
    const formData = this.formUsuario.value;
    this.usuarioService.getUsuarioByEmail(formData.emailUsuario).subscribe({
      next: (usuarioDTO) => {
        this.messageService.add({
          severity: 'succes',
          summary: 'Creado',
          detail: 'Usuario agregado al proyecto correctamente',
        });        
        if (this.proyecto) {          
          this.proyectoService.addParticipante(this.proyecto.id, usuarioDTO.id);
        }
        this.router.navigateByUrl('/proyectos/proyectos-form-usuario/' + this.proyecto?.id);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Usuario con email ' + formData.emailUsuario + ' no encontrado. Ingrese un email existente',          
        });
        this.router.navigateByUrl('/proyectos/proyectos-form-usuario/' + this.proyecto?.id);
      },
    });
  }

  saveTarea() {
    const formData = this.formProyecto.value;
    /*this.nuevaTarea?.nombre = formData.nombreTarea;
    this.nuevaTarea?.descripcion = formData.descripcionTarea*/
  }

  verificarTareas() {
    if (!this.tareas || this.tareas.length === 0) {
      return false;
    } else {
      return true;
    }
  }
}
