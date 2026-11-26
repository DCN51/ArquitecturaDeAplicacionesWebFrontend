import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Loginservice } from '../../services/loginservice';
import { Sesionclinicaservice } from '../../services/sesionclinicaservice';
import { SesionClinicaDTO } from '../../models/SesionClinicaDTO';

@Component({
  selector: 'app-burbujamindcitocomponent',
  imports: [],
  templateUrl: './burbujamindcitocomponent.html',
  styleUrl: './burbujamindcitocomponent.css',
})
export class Burbujamindcitocomponent {
  cargando: boolean = false;
  mensaje: string = '';

  constructor(
    private loginService: Loginservice,
    private scS: Sesionclinicaservice,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  get visible(): boolean {
    return this.loginService.hasAnyRole(['PACIENTE']) && !this.router.url.startsWith('/sesiones/chat');
  }

  abrirChat(): void {
    if (this.cargando) {
      return;
    }
    this.cargando = true;
    this.mensaje = '';

    this.scS.misSesiones().subscribe({
      next: (data: SesionClinicaDTO[]) => {
        const enCurso = data.find(s => s.estado === 'en_curso');
        if (enCurso) {
          this.irAlChat(enCurso.sesionClinicaId);
        } else {
          this.iniciarSesion();
        }
      },
      error: (err) => this.mostrarError(err, 'No se pudieron consultar tus sesiones')
    });
  }

  private iniciarSesion(): void {
    this.scS.iniciar().subscribe({
      next: (data: SesionClinicaDTO) => this.irAlChat(data.sesionClinicaId),
      error: (err) => this.mostrarError(err, 'No se pudo iniciar la conversación')
    });
  }

  private irAlChat(id: number): void {
    this.cargando = false;
    void this.router.navigate(['/sesiones/chat', id]);
  }

  private mostrarError(err: any, texto: string): void {
    console.log(err);
    this.cargando = false;
    this.mensaje = err.error?.message || texto;
    this.cdr.detectChanges();
  }
}
