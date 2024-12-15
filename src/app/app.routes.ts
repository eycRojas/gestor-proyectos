import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';
import { LogInComponent } from './pages/auth/log-in/log-in.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { MisProyectosComponent } from './pages/componentes/mis-proyectos/mis-proyectos.component';
import { ProyectosAsignadosComponent } from './pages/componentes/proyectos-asignados/proyectos-asignados.component';
import { ProyectosFormComponent } from './pages/componentes/proyectos-form/proyectos-form.component';
import { ProyectosFormUsuarioComponent } from './pages/componentes/proyectos-form-usuario/proyectos-form-usuario.component';
import { ProyectosFormTareasComponent } from './pages/componentes/proyectos-form-tareas/proyectos-form-tareas.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  {
    path: 'home',
    component: HomeComponent,
    ...canActivate(() => redirectUnauthorizedTo(['/auth/log-in'])),
  },
  {
    path: 'auth',
    children: [
      {
        path: 'sign-up',
        component: SignUpComponent,
        title: 'Crear cuenta',
      },
      {
        path: 'log-in',
        component: LogInComponent,
        title: 'Inicio de sesión',
      },
    ],
  },
  {
    path: 'proyectos',
    children: [
      {
        path: 'mis-proyectos',
        component: MisProyectosComponent,
        title: 'Mis proyectos creados',
      },
      {
        path: 'proyectos-asignados',
        component: ProyectosAsignadosComponent,
        title: 'Mis proyectos asignados',
      },
      {
        path: 'proyectos-form',
        component: ProyectosFormComponent,
        title: 'Formulario de proyectos',
      },
      {
        path: 'proyectos-form-tareas/:id',
        component: ProyectosFormTareasComponent,
        title: 'Formulario de proyectos',
      },
      {
        path: 'proyectos-form-usuario/:id',
        component: ProyectosFormUsuarioComponent,
        title: 'Formulario de proyectos',
      },

    ],
    ...canActivate(() => redirectUnauthorizedTo(['/auth/log-in'])),
  },
  {
    path: '**', pathMatch: 'full', redirectTo: '/home'
  }
];
