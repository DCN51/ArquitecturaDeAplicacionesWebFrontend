import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { Loginservice } from '../../services/loginservice';

@Component({
  selector: 'app-menucomponent',
  imports: [MatToolbarModule, MatButtonModule, MatMenuModule, MatIconModule, RouterLink],
  templateUrl: './menucomponent.html',
  styleUrl: './menucomponent.css',
})
export class Menucomponent {
  constructor(private readonly loginService: Loginservice,
    private readonly router: Router
  ) { }

  get username(): string {
    return this.loginService.getUsername();
  }

  get esAdmin(): boolean {
    return this.loginService.hasAnyRole(['ADMINISTRADOR']);
  }

  get esPaciente(): boolean {
    return this.loginService.hasAnyRole(['PACIENTE']);
  }

  get esPsicologo(): boolean {
    return this.loginService.hasAnyRole(['PSICOLOGO']);
  }

  cerrarSesion(): void {
    this.loginService.logout();
    void this.router.navigateByUrl('/iniciar-sesion', { replaceUrl: true });
  }
}