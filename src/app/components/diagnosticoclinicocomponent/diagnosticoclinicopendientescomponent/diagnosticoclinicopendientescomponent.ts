import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Loginservice } from '../../../services/loginservice';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Diagnosticoclinicoservice } from '../../../services/diagnosticoclinicoservice';
import { DiagnosticoClinicoDTO } from '../../../models/DiagnosticoClinicoDTO';

@Component({
  selector: 'app-diagnosticoclinicopendientescomponent',
  imports: [MatTableModule, DatePipe, MatButtonModule, MatIconModule],
  templateUrl: './diagnosticoclinicopendientescomponent.html',
  styleUrl: './diagnosticoclinicopendientescomponent.css',
})
export class Diagnosticoclinicopendientescomponent implements OnInit {
  dataSource: DiagnosticoClinicoDTO[] = [];
  mensaje: string = '';
  mensajeAccion: string = '';
  cargando: boolean = true;

  private baseColumns: string[] = ['id', 'usuario', 'sesion', 'fecha', 'resultado', 'riesgo'];

  get displayedColumns(): string[] {
    return this.esPsicologo
      ? [...this.baseColumns, 'validar']
      : this.baseColumns;
  }

  get esPsicologo(): boolean {
    return this.loginService.hasAnyRole(['PSICOLOGO']);
  }

  constructor(private loginService: Loginservice, private dcS: Diagnosticoclinicoservice, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listarPendientes();
  }

  listarPendientes(): void {
    this.dcS.pendientes().subscribe({
      next: (data: DiagnosticoClinicoDTO[]) => {
        this.dataSource = data;
        this.cargando = false;
        this.mensaje = data.length > 0 ? '' : 'No hay diagnósticos pendientes de validar';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.cargando = false;
        this.mensaje = 'Ocurrió un error al obtener los diagnósticos pendientes';
        this.cdr.detectChanges();
      }
    });
  }

  validarDiagnostico(d: DiagnosticoClinicoDTO): void {
    if (!confirm(`¿Seguro que deseas validar el diagnóstico ${d.diagnosticoClinicoId}?`)) {
      return;
    }

    this.dcS.validar(d.diagnosticoClinicoId).subscribe({
      next: () => {
        this.mensajeAccion = 'Diagnóstico validado correctamente';
        this.listarPendientes();
      },
      error: (err) => {
        console.log(err);
        if (err.status === 409) {
          this.mensajeAccion = 'El diagnóstico ya fue validado';
        } else if (err.status === 400) {
          this.mensajeAccion = err.error?.message || 'Solo un psicólogo puede validar un diagnóstico';
        } else if (err.status === 404) {
          this.mensajeAccion = 'Diagnóstico no encontrado';
        } else {
          this.mensajeAccion = 'No se pudo validar: se requiere iniciar sesión como psicólogo';
        }
        this.cdr.detectChanges();
      }
    });
  }
}