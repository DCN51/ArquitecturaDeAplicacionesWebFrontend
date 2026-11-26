import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { Diagnosticoclinicoservice } from '../../../services/diagnosticoclinicoservice';
import { DiagnosticoClinicoDTO } from '../../../models/DiagnosticoClinicoDTO';
import { Sesionclinicaservice } from '../../../services/sesionclinicaservice';
import { SesionClinicaDTO } from '../../../models/SesionClinicaDTO';

@Component({
  selector: 'app-diagnosticoclinicoinsertcomponent',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    DatePipe,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './diagnosticoclinicoinsertcomponent.html',
  styleUrl: './diagnosticoclinicoinsertcomponent.css',
})
export class Diagnosticoclinicoinsertcomponent implements OnInit {
  diagnosticoForm: FormGroup;
  mensaje: string = '';
  niveles: string[] = ['bajo', 'medio', 'alto', 'critico'];
  sesiones: SesionClinicaDTO[] = [];

  constructor(
    private dcS: Diagnosticoclinicoservice,
    private scS: Sesionclinicaservice,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.diagnosticoForm = this.fb.group({
      sesionId: [null, Validators.required],
      resultado: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: [''],
      riesgo: ['', Validators.required],
      recomendacion: ['']
    });
  }

  ngOnInit(): void {
    const sesionId = Number(this.route.snapshot.paramMap.get('sesionId'));
    this.cargarSesiones(sesionId);
  }

  cargarSesiones(sesionId: number): void {
    this.scS.misSesiones().subscribe({
      next: (sesiones: SesionClinicaDTO[]) => {
        this.dcS.misDiagnosticos().subscribe({
          next: (diagnosticos: DiagnosticoClinicoDTO[]) => {
            const conDiagnostico = new Set<number>(diagnosticos.map(d => d.sesionClinicaId));
            this.sesiones = sesiones.filter(s => s.estado === 'finalizada' && !conDiagnostico.has(s.sesionClinicaId));
            if (this.sesiones.some(s => s.sesionClinicaId === sesionId)) {
              this.diagnosticoForm.patchValue({ sesionId: sesionId });
            }
            if (this.sesiones.length === 0) {
              this.mensaje = 'No tienes sesiones finalizadas pendientes de diagnóstico';
            }
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.log(err);
            this.mensaje = err.error?.message || 'Ocurrió un error al cargar tus diagnósticos';
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        console.log(err);
        this.mensaje = err.error?.message || 'Ocurrió un error al cargar tus sesiones';
        this.cdr.detectChanges();
      }
    });
  }

  insertarDiagnostico(): void {
    if (this.diagnosticoForm.invalid || !this.diagnosticoForm.value.resultado.trim()) {
      this.diagnosticoForm.markAllAsTouched();
      this.mensaje = 'Complete todos los campos correctamente';
      return;
    }

    const diagnostico: DiagnosticoClinicoDTO = new DiagnosticoClinicoDTO();
    diagnostico.sesionClinicaId = this.diagnosticoForm.value.sesionId;
    diagnostico.resultadoPrincipal = this.diagnosticoForm.value.resultado.trim();
    diagnostico.descripcionDetallada = this.diagnosticoForm.value.descripcion?.trim() || null;
    diagnostico.nivelRiesgo = this.diagnosticoForm.value.riesgo;
    diagnostico.recomendacionGeneral = this.diagnosticoForm.value.recomendacion?.trim() || null;

    this.dcS.insert(diagnostico).subscribe({
      next: (data: DiagnosticoClinicoDTO) => {
        this.mensaje = `Diagnóstico ${data.diagnosticoClinicoId} registrado correctamente`;
        this.sesiones = this.sesiones.filter(s => s.sesionClinicaId !== data.sesionClinicaId);
        this.diagnosticoForm.reset({
          sesionId: null, resultado: '', descripcion: '', riesgo: '', recomendacion: ''
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        if (err.status === 409) {
          this.mensaje = err.error?.message || 'Esta sesión ya tiene un diagnóstico';
        } else if (err.status === 404) {
          this.mensaje = err.error?.message || 'Sesión no encontrada';
        } else if (err.status === 400 || err.status === 403) {
          this.mensaje = err.error?.message || 'Solo se puede diagnosticar una sesión finalizada';
        } else {
          this.mensaje = err.error?.message || 'Error al registrar el diagnóstico';
        }
        this.cdr.detectChanges();
      }
    });
  }
}
