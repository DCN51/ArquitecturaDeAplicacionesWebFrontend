import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Sesionclinicaservice } from '../../../services/sesionclinicaservice';
import { SesionClinicaDTO } from '../../../models/SesionClinicaDTO';

@Component({
  selector: 'app-sesionclinicainsertcomponent',
  imports: [
    RouterLink,
    MatButtonModule
  ],
  templateUrl: './sesionclinicainsertcomponent.html',
  styleUrl: './sesionclinicainsertcomponent.css',
})
export class Sesionclinicainsertcomponent {
  mensaje: string = '';
  sesionCreada: SesionClinicaDTO | null = null;
  enviando: boolean = false;

  constructor(
    private scS: Sesionclinicaservice,
    private cdr: ChangeDetectorRef
  ) { }

  iniciarSesion(): void {
    if (this.enviando) {
      return;
    }
    this.sesionCreada = null;
    this.mensaje = '';
    this.enviando = true;

    this.scS.iniciar().subscribe({
      next: (data: SesionClinicaDTO) => {
        this.enviando = false;
        this.sesionCreada = data;
        this.mensaje = `Sesión ${data.sesionClinicaId} iniciada correctamente`;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.enviando = false;
        if (err.status === 409) {
          this.mensaje = err.error?.message || 'Ya tienes una sesión en curso';
        } else {
          this.mensaje = err.error?.message || 'Error al iniciar la sesión';
        }
        this.cdr.detectChanges();
      }
    });
  }
}
