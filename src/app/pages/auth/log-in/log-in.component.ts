import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario.service';
import { UsuarioDTO } from '../../models/usuarioDTO';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css',
})
export class LogInComponent implements OnInit {
  formLogin: FormGroup;
  usuario!: UsuarioDTO;

  constructor(
    private authService: AuthService,
    private router: Router,
    private usuarioService: UsuarioService,
    private messageService: MessageService
  ) {
    this.formLogin = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
    });
  }

  ngOnInit(): void { }

  onSubmit() {

    this.authService
      .login(this.formLogin.value)
      .then((response) => {
        console.log(response);

        const formData = this.formLogin.value;

        this.usuarioService.getUsuarioByEmail(formData.email).subscribe({
          next: (usuarioDTO) => {
            this.usuario = usuarioDTO;

            this.usuarioService.setUsuario(this.usuario);
            localStorage.setItem('usuarioId', usuarioDTO.id.toString());

            this.router.navigate(['/home']);
          },
          error: () => { },
        });
      })
      .catch((error) => {
        console.log(error);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Correo y/o contraseña incorrecta',
        });
      });
  }

  onClick() {
    this.authService
      .loginWithGoogle()
      .then((response) => {
        console.log(response);
        this.router.navigate(['/home']);
      })
      .catch((error) => console.log(error));
  }
}
