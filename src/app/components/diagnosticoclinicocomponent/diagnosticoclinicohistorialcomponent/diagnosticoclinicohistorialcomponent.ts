import { ChangeDetectorRef, Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Diagnosticoclinicoservice } from '../../../services/diagnosticoclinicoservice';
import { DiagnosticoClinicoDTO } from '../../../models/DiagnosticoClinicoDTO';

@Component({
  selector: 'app-diagnosticoclinicohistorialcomponent',
  imports: [
    FormsModule,
    DatePipe,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './diagnosticoclinicohistorialcomponent.html',
  styleUrl: './diagnosticoclinicohistorialcomponent.css',
})
export class Diagnosticoclinicohistorialcomponent {
  usuarioId: number | null = null;
  usuarioBuscado: number = 0;
  lista: DiagnosticoClinicoDTO[] = [];
  mensaje: string = '';
  mensajeAccion: string = '';
  displayedColumns: string[] = ['id', 'sesion', 'fecha', 'resultado', 'riesgo', 'recomendacion', 'validacion', 'eliminar'];

  constructor(private dcS: Diagnosticoclinicoservice, private cdr: ChangeDetectorRef) { }

  buscarHistorial(): void {
    this.mensajeAccion = '';
    if (!this.usuarioId || this.usuarioId < 1) {
      this.lista = [];
      this.mensaje = 'Ingrese su id de usuario';
      return;
    }
    this.usuarioBuscado = this.usuarioId;
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.dcS.historial(this.usuarioBuscado).subscribe({
      next: (data: DiagnosticoClinicoDTO[]) => {
        this.lista = data;
        this.mensaje = data.length > 0 ? '' : 'No tienes diagnósticos registrados';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.lista = [];
        if (err.status === 404) {
          this.mensaje = 'No existe el usuario ingresado';
        } else {
          this.mensaje = 'Ocurrió un error al consultar el historial';
        }
        this.cdr.detectChanges();
      }
    });
  }

  eliminarDiagnostico(d: DiagnosticoClinicoDTO): void {
    if (!confirm(`¿Seguro que deseas eliminar el diagnóstico ${d.diagnosticoClinicoId}?`)) {
      return;
    }

    this.dcS.eliminar(d.diagnosticoClinicoId).subscribe({
      next: () => {
        this.mensajeAccion = 'Diagnóstico eliminado correctamente';
        this.cargarHistorial();
      },
      error: (err) => {
        console.log(err);
        if (err.status === 400) {
          this.mensajeAccion = err.error?.message || 'No se puede eliminar un diagnóstico validado';
        } else if (err.status === 404) {
          this.mensajeAccion = 'Diagnóstico no encontrado';
        } else {
          this.mensajeAccion = 'Error al eliminar el diagnóstico';
        }
        this.cargarHistorial();
      }
    });
  }
}
