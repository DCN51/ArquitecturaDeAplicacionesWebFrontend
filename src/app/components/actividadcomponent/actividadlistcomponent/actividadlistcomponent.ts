import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Loginservice } from '../../../services/loginservice';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
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
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './actividadlistcomponent.html',
  styleUrl: './actividadlistcomponent.css',
})
export class Actividadlistcomponent implements OnInit {
  usuarioId: number | null = null;
  usuarioBuscado: number = 0;     // paciente cuya tabla se está mostrando
  lista: ActividadDTO[] = [];
  mensaje: string = '';
  mensajeAccion: string = '';

  // HUF40 - filtros ('' = todos)
  estadoFiltro: string = '';
  desde: string = '';   // yyyy-MM-dd
  hasta: string = '';

  // Ninguno ve el ID de la actividad (observación de la profesora)
  private baseColumns: string[] = ['titulo', 'tipo', 'asignada', 'estado', 'comentario'];

  // El psicólogo ve el diagnóstico, editar y eliminar; el paciente solo completar
  get displayedColumns(): string[] {
    return this.esPsicologo
      ? ['titulo', 'tipo', 'diagnostico', 'asignada', 'estado', 'comentario', 'editar', 'eliminar']
      : [...this.baseColumns, 'completar'];
  }

  get esPsicologo(): boolean {
    return this.loginService.hasAnyRole(['PSICOLOGO']);
  }

  get esPaciente(): boolean {
    return this.loginService.hasAnyRole(['PACIENTE']);
  }

  constructor(private loginService: Loginservice, private aS: Actividadservice, private cdr: ChangeDetectorRef) { }

  // El paciente no escribe su id: se toma del usuario que inició sesión
  ngOnInit(): void {
    if (this.esPaciente) {
      this.usuarioBuscado = this.loginService.getUserId();
      this.cargarActividades();
    }
  }

  get hayFiltros(): boolean {
    return this.estadoFiltro !== '' || this.desde !== '' || this.hasta !== '';
  }

  limpiarFiltros(): void {
    this.estadoFiltro = '';
    this.desde = '';
    this.hasta = '';
    this.buscarActividades();
  }

  buscarActividades(): void {
    this.mensajeAccion = '';
    if (this.esPaciente) {   // el paciente siempre consulta sus propias actividades
      this.cargarActividades();
      return;
    }
    if (!this.usuarioId || this.usuarioId < 1) {
      this.lista = [];
      this.mensaje = 'Ingrese el id del paciente';
      return;
    }
    this.usuarioBuscado = this.usuarioId;
    this.cargarActividades();
  }

  cargarActividades(): void {
    // HUF40: la fecha desde no puede ser mayor que la fecha hasta
    if (this.desde && this.hasta && this.desde > this.hasta) {
      this.lista = [];
      this.mensaje = 'La fecha desde no puede ser mayor que la fecha hasta';
      return;
    }
    this.aS.getActividades(this.usuarioBuscado, this.estadoFiltro, this.desde, this.hasta).subscribe({
      next: (data) => {
        this.lista = data;
        if (data.length > 0) {
          this.mensaje = '';
        } else {
          if (this.hayFiltros) {
            this.mensaje = 'No hay actividades con esos filtros';
          } else {
            this.mensaje = this.esPaciente ? 'No tienes actividades registradas' : 'El paciente no tiene actividades registradas';
          }
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.lista = [];
        if (err.status === 400) {
          this.mensaje = 'La fecha desde no puede ser mayor que la fecha hasta';
        } else if (err.status === 404) {
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