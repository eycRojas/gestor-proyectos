import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../core/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  public tittle: string = 'Gestor de proyectos';
}
