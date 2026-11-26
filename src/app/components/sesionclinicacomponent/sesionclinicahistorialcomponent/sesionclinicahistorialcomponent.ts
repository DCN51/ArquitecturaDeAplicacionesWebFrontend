import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Sesionclinicaservice } from '../../../services/sesionclinicaservice';
import { SesionClinicaDTO } from '../../../models/SesionClinicaDTO';
import { Diagnosticoclinicoservice } from '../../../services/diagnosticoclinicoservice';
import { DiagnosticoClinicoDTO } from '../../../models/DiagnosticoClinicoDTO';

@Component({
  selector: 'app-sesionclinicahistorialcomponent',
  imports: [
    DatePipe,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './sesionclinicahistorialcomponent.html',
  styleUrl: './sesionclinicahistorialcomponent.css',
})
export class Sesionclinicahistorialcomponent implements OnInit {
  lista: SesionClinicaDTO[] = [];
  mensaje: string = 'Cargando...';
  mensajeAccion: string = '';
  sesionesConDiagnostico: Set<number> = new Set<number>();
  displayedColumns: string[] = ['id', 'inicio', 'fin', 'estado', 'emocion', 'urgencia', 'derivacion', 'finalizar', 'diagnostico', 'eliminar'];

  constructor(
    private scS: Sesionclinicaservice,
    private dcS: Diagnosticoclinicoservice,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.scS.misSesiones().subscribe({
      next: (data: SesionClinicaDTO[]) => {
        this.lista = data;
        this.mensaje = data.length > 0 ? '' : 'No tienes sesiones registradas';
        this.cdr.detectChanges();
        this.cargarDiagnosticos();
      },
      error: (err) => {
        console.log(err);
        this.lista = [];
        this.mensaje = err.error?.message || 'Ocurrió un error al consultar el historial';
        this.cdr.detectChanges();
      }
    });
  }

  cargarDiagnosticos(): void {
    this.dcS.misDiagnosticos().subscribe({
      next: (data: DiagnosticoClinicoDTO[]) => {
        this.sesionesConDiagnostico = new Set<number>(data.map(d => d.sesionClinicaId));
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.sesionesConDiagnostico = new Set<number>();
        this.cdr.detectChanges();
      }
    });
  }

  tieneDiagnostico(s: SesionClinicaDTO): boolean {
    return this.sesionesConDiagnostico.has(s.sesionClinicaId);
  }

  eliminarSesion(s: SesionClinicaDTO): void {
    if (!confirm(`¿Seguro que deseas eliminar la sesión ${s.sesionClinicaId}?`)) {
      return;
    }

    this.scS.eliminar(s.sesionClinicaId).subscribe({
      next: () => {
        this.mensajeAccion = 'Sesión eliminada correctamente';
        this.cargarHistorial();
      },
      error: (err) => {
        console.log(err);
        if (err.status === 400) {
          this.mensajeAccion = err.error?.message || 'La sesión no se puede eliminar';
        } else if (err.status === 404) {
          this.mensajeAccion = err.error?.message || 'Sesión no encontrada';
        } else {
          this.mensajeAccion = err.error?.message || 'Error al eliminar la sesión';
        }
        this.cargarHistorial();
      }
    });
  }
}
