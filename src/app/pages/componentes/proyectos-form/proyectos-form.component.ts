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
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { UsuarioDTO } from '../../models/usuarioDTO';
import { UsuarioService } from '../../../services/usuario.service';

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
    CardModule
  ],
  templateUrl: './proyectos-form.component.html',
  styleUrl: './proyectos-form.component.css',
})
export class ProyectosFormComponent {
  formProyecto!: FormGroup;
  isSaveInProgress: boolean = false;
  edit: boolean = false;
  usuario: UsuarioDTO | null = null;
  usuarioId: any;
  usuarioEmail: any;

  constructor(
    private formBuilder: FormBuilder,
    private proyectoService: ProyectoService,
    private messageService: MessageService,
    private router: Router,
    private usuarioService: UsuarioService
  ) {
    this.formProyecto = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const usuarioIdString = localStorage.getItem('usuarioId');
    const usuarioId: number = Number(usuarioIdString);
    this.usuarioService.getUsuarioById(usuarioId).subscribe({
      next: (usuarioDTO) => {
        this.usuario = usuarioDTO;        
        this.usuarioService.setUsuario(this.usuario);        
      }
    })
  }

  saveProyecto() {
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
      this.usuarioEmail = this.usuario.email;
      this.proyectoService.saveProyecto(this.formProyecto.value, this.usuarioId).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'succes',
            summary: 'Creado',
            detail: 'Proyecto creado correctamente',
          });
          
          this.usuarioService.getUsuarioByEmail(this.usuarioEmail).subscribe({
            next: (usuarioDTO) => {
              this.usuario = usuarioDTO;
  
              this.usuarioService.setUsuario(this.usuario);              
            },
            error: () => { },
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
