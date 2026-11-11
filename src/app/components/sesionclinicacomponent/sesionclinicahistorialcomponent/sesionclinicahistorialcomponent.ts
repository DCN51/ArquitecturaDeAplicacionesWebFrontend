import { ChangeDetectorRef, Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Sesionclinicaservice } from '../../../services/sesionclinicaservice';
import { SesionClinicaDTO } from '../../../models/SesionClinicaDTO';

@Component({
  selector: 'app-sesionclinicahistorialcomponent',
  imports: [
    FormsModule,
    DatePipe,
    RouterLink,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './sesionclinicahistorialcomponent.html',
  styleUrl: './sesionclinicahistorialcomponent.css',
})
export class Sesionclinicahistorialcomponent {
  usuarioId: number | null = null;
  usuarioBuscado: number = 0;
  lista: SesionClinicaDTO[] = [];
  mensaje: string = '';
  mensajeAccion: string = '';
  displayedColumns: string[] = ['id', 'inicio', 'fin', 'estado', 'emocion', 'urgencia', 'derivacion', 'finalizar', 'diagnostico', 'eliminar'];

  constructor(private scS: Sesionclinicaservice, private cdr: ChangeDetectorRef) { }

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
    this.scS.historial(this.usuarioBuscado).subscribe({
      next: (data: SesionClinicaDTO[]) => {
        this.lista = data;
        this.mensaje = data.length > 0 ? '' : 'No tienes sesiones registradas';
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
          this.mensajeAccion = 'Sesión no encontrada';
        } else {
          this.mensajeAccion = 'Error al eliminar la sesión';
        }
        this.cargarHistorial();
      }
    });
  }
}
