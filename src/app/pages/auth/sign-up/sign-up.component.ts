import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent implements OnInit {
  formReg: FormGroup;
  isSaveInProgress: boolean = false;

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.formReg = new FormGroup({
      nombre: new FormControl(),
      apellidoPaterno: new FormControl(),
      apellidoMaterno: new FormControl(),
      email: new FormControl(),
      contrasenia: new FormControl(),
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    this.authService
      .register(this.formReg.value)
      .then((response) => {
        console.log(response);
        
        this.saveUsuario();

        this.router.navigate(['/auth/log-in']);
      })
      .catch((error) => console.log(error));
  }

  saveUsuario(){
    if (this.formReg.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Revise los campos e intente nuevamente',
      });
      return;
    } else {
      this.usuarioService.saveUsuario(this.formReg.value).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'succes',
            summary: 'Creado',
            detail: 'Usuario creado correctamente',
          });
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
