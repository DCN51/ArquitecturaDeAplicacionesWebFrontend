import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Loginservice } from '../../../services/loginservice';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Actividadservice } from '../../../services/actividadservice';
import { ActividadDTO } from '../../../models/ActividadDTO';
import { Diagnosticoclinicoservice } from '../../../services/diagnosticoclinicoservice';
import { DiagnosticoClinicoDTO } from '../../../models/DiagnosticoClinicoDTO';

@Component({
  selector: 'app-actividadlistcomponent',
  imports: [
    FormsModule,
    DatePipe,
    RouterLink,
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './actividadlistcomponent.html',
  styleUrl: './actividadlistcomponent.css',
})
export class Actividadlistcomponent implements OnInit {
  usuarioId: number | null = null;
  usuarioBuscado: number = 0;
  lista: ActividadDTO[] = [];
  mensaje: string = '';
  mensajeAccion: string = '';
  pacientes: { id: number, nombre: string }[] = [];
  diagnosticos: Map<number, string> = new Map<number, string>();

  private baseColumns: string[] = ['id', 'titulo', 'tipo', 'diagnostico', 'asignada', 'estado', 'comentario'];

  get displayedColumns(): string[] {
    return this.esPsicologo
      ? [...this.baseColumns, 'editar', 'eliminar']
      : [...this.baseColumns, 'completar'];
  }

  get esPsicologo(): boolean {
    return this.loginService.hasAnyRole(['PSICOLOGO']);
  }

  constructor(
    private loginService: Loginservice,
    private aS: Actividadservice,
    private dcS: Diagnosticoclinicoservice,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (this.esPsicologo) {
      this.cargarPacientes();
    } else {
      this.mensaje = 'Cargando...';
      this.cargarActividades();
      this.cargarMisDiagnosticos();
    }
  }

  cargarMisDiagnosticos(): void {
    this.dcS.misDiagnosticos().subscribe({
      next: (data: DiagnosticoClinicoDTO[]) => {
        this.guardarDiagnosticos(data);
        this.cdr.detectChanges();
      },
      error: (err) => console.log(err)
    });
  }

  guardarDiagnosticos(data: DiagnosticoClinicoDTO[]): void {
    this.diagnosticos = new Map<number, string>(data.map(d => [d.diagnosticoClinicoId, d.resultadoPrincipal]));
  }

  nombreDiagnostico(id: number): string {
    return this.diagnosticos.get(id) ?? `Diagnóstico ${id}`;
  }

  cargarPacientes(): void {
    this.dcS.validadosPorPsicologo(this.loginService.getUserId()).subscribe({
      next: (data: DiagnosticoClinicoDTO[]) => {
        this.guardarDiagnosticos(data);
        const mapa = new Map<number, string>();
        data.forEach(d => mapa.set(d.usuarioId, d.nombrePaciente || `Paciente ${d.usuarioId}`));
        this.pacientes = [...mapa].map(([id, nombre]) => ({ id, nombre }));
        if (this.pacientes.length === 0) {
          this.mensaje = 'Aún no tienes pacientes con diagnósticos validados';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.mensaje = err.error?.message || 'Ocurrió un error al cargar tus pacientes';
        this.cdr.detectChanges();
      }
    });
  }

  buscarActividades(): void {
    this.mensajeAccion = '';
    if (!this.usuarioId || this.usuarioId < 1) {
      this.lista = [];
      this.mensaje = 'Elija un paciente';
      return;
    }
    this.usuarioBuscado = this.usuarioId;
    this.cargarActividades();
  }

  cargarActividades(): void {
    const consulta = this.esPsicologo
      ? this.aS.getActividades(this.usuarioBuscado)
      : this.aS.misActividades();
    consulta.subscribe({
      next: (data) => {
        this.lista = data;
        this.mensaje = data.length > 0 ? '' : (this.esPsicologo ? 'El paciente no tiene actividades registradas' : 'No tienes actividades asignadas');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.lista = [];
        if (err.status === 404) {
          this.mensaje = err.error?.message || 'No existe un usuario con ese id';
        } else if (err.status === 403 || err.status === 400) {
          this.mensaje = err.error?.message || 'No puedes ver las actividades de este paciente';
        } else {
          this.mensaje = err.error?.message || 'Ocurrió un error al obtener las actividades';
        }
        this.cdr.detectChanges();
      }
    });
  }

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
          this.mensajeAccion = err.error?.message || 'Solo se pueden eliminar actividades pendientes';
        } else if (err.status === 404) {
          this.mensajeAccion = err.error?.message || 'Actividad no encontrada';
        } else {
          this.mensajeAccion = err.error?.message || 'Error al eliminar la actividad';
        }
        this.cargarActividades();
      }
    });
  }
}