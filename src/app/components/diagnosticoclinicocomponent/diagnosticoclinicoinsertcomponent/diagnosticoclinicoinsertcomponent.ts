import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Diagnosticoclinicoservice } from '../../../services/diagnosticoclinicoservice';
import { DiagnosticoClinicoDTO } from '../../../models/DiagnosticoClinicoDTO';

@Component({
  selector: 'app-diagnosticoclinicoinsertcomponent',
  imports: [
    ReactiveFormsModule,
    RouterLink,
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

  constructor(
    private dcS: Diagnosticoclinicoservice,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.diagnosticoForm = this.fb.group({
      sesionId: [null, [Validators.required, Validators.min(1)]],
      resultado: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: [''],
      riesgo: ['', Validators.required],
      recomendacion: ['']
    });
  }

  ngOnInit(): void {
    const sesionId = Number(this.route.snapshot.paramMap.get('sesionId'));
    if (sesionId && !isNaN(sesionId)) {
      this.diagnosticoForm.patchValue({ sesionId: sesionId });
    }
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
        this.diagnosticoForm.reset({
          sesionId: null, resultado: '', descripcion: '', riesgo: '', recomendacion: ''
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        if (err.status === 409) {
          this.mensaje = 'Esta sesión ya tiene un diagnóstico';
        } else if (err.status === 404) {
          this.mensaje = 'Sesión no encontrada';
        } else if (err.status === 400) {
          this.mensaje = err.error?.message || 'Solo se puede diagnosticar una sesión finalizada';
        } else {
          this.mensaje = 'Error al registrar el diagnóstico';
        }
        this.cdr.detectChanges();
      }
    });
  }
}
