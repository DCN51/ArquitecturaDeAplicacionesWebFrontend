import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { Loginservice } from '../../services/loginservice';
import { Suscripcionservice } from '../../services/suscripcionservice';

@Component({
  selector: 'app-menucomponent',
  imports: [MatToolbarModule, MatButtonModule, MatMenuModule, MatIconModule, RouterLink],
  templateUrl: './menucomponent.html',
  styleUrl: './menucomponent.css',
})
export class Menucomponent implements OnInit {
  tienePlanPagado: boolean = false;   // free -> Contratar plan | pagado -> Cambiar plan

  constructor(private readonly loginService: Loginservice,
    private readonly router: Router,
    private readonly sS: Suscripcionservice,
    private readonly cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.revisarPlan();
  }

  // Se llama al cargar el menú y cada vez que se abre "Suscripción",
  // así siempre muestra la opción correcta aunque el plan haya cambiado
  revisarPlan(): void {
    if (!this.esPaciente) {
      return;
    }
    this.sS.tienePlanPagado(this.loginService.getUserId()).subscribe({
      next: (pagado) => {
        this.tienePlanPagado = pagado;
        this.cdr.detectChanges();
      },
      error: (err) => console.log(err)
    });
  }

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