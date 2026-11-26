import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Loginservice } from '../../../services/loginservice';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Suscripcionservice } from '../../../services/suscripcionservice';
import { SuscripcionDTO } from '../../../models/SuscripcionDTO';

@Component({
  selector: 'app-suscripcionhistorialcomponent',
  imports: [
    FormsModule,
    DatePipe,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './suscripcionhistorialcomponent.html',
  styleUrl: './suscripcionhistorialcomponent.css',
})
export class Suscripcionhistorialcomponent implements OnInit {
  usuarioId: number | null = null;
  usuarioBuscado: number = 0;
  lista: SuscripcionDTO[] = [];
  mensaje: string = '';
  mensajeAccion: string = '';

  private baseColumns: string[] = ['plan', 'inicio', 'fin', 'estado'];

  get displayedColumns(): string[] {
    return this.esPaciente
      ? [...this.baseColumns, 'cancelar']
      : this.baseColumns;
  }

  get esPaciente(): boolean {
    return this.loginService.hasAnyRole(['PACIENTE']);
  }

  constructor(
    private loginService: Loginservice,
    private sS: Suscripcionservice,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (this.esPaciente) {
      this.mensaje = 'Cargando...';
      this.cargarHistorial();
    }
  }

  buscarHistorial(): void {
    this.mensajeAccion = '';
    if (!this.usuarioId || this.usuarioId < 1) {
      this.lista = [];
      this.mensaje = 'Ingrese el id del paciente';
      return;
    }
    this.usuarioBuscado = this.usuarioId;
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    const consulta = this.esPaciente
      ? this.sS.misSuscripciones()
      : this.sS.historial(this.usuarioBuscado);
    consulta.subscribe({
      next: (data: SuscripcionDTO[]) => {
        this.lista = data;
        this.mensaje = data.length > 0 ? '' : (this.esPaciente ? 'No tienes suscripciones registradas' : 'El paciente no tiene suscripciones registradas');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.lista = [];
        this.mensaje = err.error?.message || 'Ocurrió un error al consultar el historial';
        this.cdr.detectChanges();
      }
    });
  }

  cancelarSuscripcion(s: SuscripcionDTO): void {
    const nombre = s.nombrePlan;
    if (!confirm(`¿Seguro que deseas cancelar tu suscripción al plan "${nombre}"?`)) {
      return;
    }

    this.sS.cancelar().subscribe({
      next: () => {
        this.mensajeAccion = 'Suscripción cancelada correctamente';
        this.cargarHistorial();
      },
      error: (err) => {
        console.log(err);
        if (err.status === 404) {
          this.mensajeAccion = err.error?.message || 'No tienes una suscripción activa';
        } else {
          this.mensajeAccion = err.error?.message || 'Error al cancelar la suscripción';
        }
        this.cargarHistorial();
      }
    });
  }
}