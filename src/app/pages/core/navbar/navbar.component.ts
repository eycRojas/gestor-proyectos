import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { AppComponent } from '../../../app.component';
import { UsuarioDTO } from '../../models/usuarioDTO';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  
  public logo: string="";
  usuario: UsuarioDTO | null = null;
  
  constructor(
    private AuthService: AuthService,
    private router: Router,
    private appComponent: AppComponent,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.logo = "assets/imagenes/logo.png";
    this.usuario = this.usuarioService.getUsuario();
  }

  cerrarSesion() {
    this.AuthService.logout()
      .then(() => {
        this.router.navigate(['/auth/log-in']);
      })
      .catch((error) => console.log(error));
  }
}
