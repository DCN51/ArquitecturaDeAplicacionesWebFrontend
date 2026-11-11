import { ChangeDetectorRef, Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Actividadservice } from '../../../services/actividadservice';
import { ActividadDTO } from '../../../models/ActividadDTO';

@Component({
  selector: 'app-actividadlistcomponent',
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
  templateUrl: './actividadlistcomponent.html',
  styleUrl: './actividadlistcomponent.css',
})
export class Actividadlistcomponent {
  usuarioId: number | null = null;
  usuarioBuscado: number = 0;     // paciente cuya tabla se está mostrando
  lista: ActividadDTO[] = [];
  mensaje: string = '';
  mensajeAccion: string = '';
  displayedColumns: string[] = ['id', 'titulo', 'tipo', 'diagnostico', 'asignada', 'estado', 'comentario', 'editar', 'completar', 'eliminar'];

  constructor(private aS: Actividadservice, private cdr: ChangeDetectorRef) { }

  buscarActividades(): void {
    this.mensajeAccion = '';
    if (!this.usuarioId || this.usuarioId < 1) {
      this.lista = [];
      this.mensaje = 'Ingrese el id del paciente';
      return;
    }
    this.usuarioBuscado = this.usuarioId;
    this.cargarActividades();
  }

  cargarActividades(): void {
    this.aS.getActividades(this.usuarioBuscado).subscribe({
      next: (data) => {
        this.lista = data;
        this.mensaje = data.length > 0 ? '' : 'El paciente no tiene actividades registradas';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.lista = [];
        if (err.status === 404) {
          this.mensaje = 'No existe un usuario con ese id';
        } else if (err.status === 403) {
          this.mensaje = 'El usuario indicado no es un paciente';
        } else {
          this.mensaje = 'Ocurrió un error al obtener las actividades';
        }
        this.cdr.detectChanges();
      }
    });
  }

  // HUF25 - solo actividades PENDIENTE
  eliminarActividad(a: ActividadDTO): void {
    if (!confirm(`¿Seguro que deseas eliminar la actividad "${a.title}"?`)) {
      return;
    }

    this.aS.delete(a.recommendedActivityId).subscribe({
      next: () => {
        this.mensajeAccion = 'Actividad eliminada correctamente';
        this.cargarActividades();
      },
      error: (err) => {
        console.log(err);
        if (err.status === 409) {
          this.mensajeAccion = 'Solo se pueden eliminar actividades pendientes';
        } else if (err.status === 404) {
          this.mensajeAccion = 'Actividad no encontrada';
        } else {
          this.mensajeAccion = 'Error al eliminar la actividad';
        }
        this.cargarActividades();
      }
    });
  }
}