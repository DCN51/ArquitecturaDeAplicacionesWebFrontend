import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Actividadservice } from '../../../services/actividadservice';
import { ActividadDTO } from '../../../models/ActividadDTO';
import { Loginservice } from '../../../services/loginservice';
import { Diagnosticoclinicoservice } from '../../../services/diagnosticoclinicoservice';
import { DiagnosticoClinicoDTO } from '../../../models/DiagnosticoClinicoDTO';

@Component({
  selector: 'app-actividadinsertcomponent',
  imports: [
    ReactiveFormsModule,
    DatePipe,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './actividadinsertcomponent.html',
  styleUrl: './actividadinsertcomponent.css',
})
export class Actividadinsertcomponent implements OnInit {
  actividadForm: FormGroup;
  mensaje: string = '';
  actividadCreada: ActividadDTO | null = null;
  diagnosticos: DiagnosticoClinicoDTO[] = [];
  tipos: string[] = ['Respiración', 'Relajación', 'Actividad física', 'Hábitos', 'Registro emocional'];

  constructor(
    private aS: Actividadservice,
    private dcS: Diagnosticoclinicoservice,
    private loginService: Loginservice,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.actividadForm = this.fb.group({
      diagnosticoId: ['', Validators.required],
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.maxLength(255)]],
      tipo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.dcS.validadosPorPsicologo(this.loginService.getUserId()).subscribe({
      next: (data: DiagnosticoClinicoDTO[]) => {
        this.diagnosticos = data;
        if (data.length === 0) {
          this.mensaje = 'Aún no tienes diagnósticos validados para asignar actividades';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.mensaje = 'Ocurrió un error al cargar tus diagnósticos validados';
        this.cdr.detectChanges();
      }
    });
  }

  insertarActividad(): void {
    if (this.actividadForm.invalid) {
      this.actividadForm.markAllAsTouched();
      this.mensaje = 'Complete todos los campos correctamente';
      return;
    }

    const diagnostico = this.diagnosticos.find(d => d.diagnosticoClinicoId === this.actividadForm.value.diagnosticoId);
    if (!diagnostico) {
      this.mensaje = 'Elija un diagnóstico';
      return;
    }

    const a: ActividadDTO = {
      recommendedActivityId: 0,
      userId: diagnostico.usuarioId,
      diagnosisId: diagnostico.diagnosticoClinicoId,
      title: this.actividadForm.value.titulo,
      description: this.actividadForm.value.descripcion,
      type: this.actividadForm.value.tipo,
      assignedDate: null,
      completedDate: null,
      status: '',
      feedback: null,
      nombrePaciente: ''
    };

    this.actividadCreada = null;

    this.aS.insert(a).subscribe({
      next: (data) => {
        this.actividadCreada = data;
        this.mensaje = 'Actividad registrada correctamente';
        this.actividadForm.reset({ diagnosticoId: '', titulo: '', descripcion: '', tipo: '' });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        if (err.status === 404) {
          this.mensaje = err.error?.message || 'No existe el paciente o el diagnóstico';
        } else if (err.status === 400 || err.status === 403) {
          this.mensaje = err.error?.message ||
            'Datos no válidos: el usuario debe ser paciente y el diagnóstico debe existir y pertenecerle';
        } else {
          this.mensaje = 'Error al registrar la actividad';
        }
        this.cdr.detectChanges();
      }
    });
  }
}