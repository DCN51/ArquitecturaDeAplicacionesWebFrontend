import { ChangeDetectorRef, Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Actividadservice } from '../../../services/actividadservice';
import { ActividadDTO } from '../../../models/ActividadDTO';

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
export class Actividadinsertcomponent {
  actividadForm: FormGroup;
  mensaje: string = '';
  actividadCreada: ActividadDTO | null = null;
  tipos: string[] = ['Respiración', 'Relajación', 'Actividad física', 'Hábitos', 'Registro emocional'];

  constructor(
    private aS: Actividadservice,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.actividadForm = this.fb.group({
      usuarioId: ['', [Validators.required, Validators.min(1)]],
      diagnosticoId: ['', [Validators.required, Validators.min(1)]],
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.maxLength(255)]],
      tipo: ['', Validators.required]
    });
  }

  insertarActividad(): void {
    if (this.actividadForm.invalid) {
      this.actividadForm.markAllAsTouched();
      this.mensaje = 'Complete todos los campos correctamente';
      return;
    }

    // estado y fecha de asignación los pone el back (PENDIENTE y hoy)
    const a: ActividadDTO = {
      recommendedActivityId: 0,
      userId: Number(this.actividadForm.value.usuarioId),
      diagnosisId: Number(this.actividadForm.value.diagnosticoId),
      title: this.actividadForm.value.titulo,
      description: this.actividadForm.value.descripcion,
      type: this.actividadForm.value.tipo,
      assignedDate: null,
      completedDate: null,
      status: '',
      feedback: null
    };

    this.actividadCreada = null;

    this.aS.insert(a).subscribe({
      next: (data) => {
        this.actividadCreada = data;
        this.mensaje = 'Actividad registrada correctamente';
        this.actividadForm.reset({ usuarioId: '', diagnosticoId: '', titulo: '', descripcion: '', tipo: '' });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        if (err.status === 404) {
          this.mensaje = 'No existe un usuario con ese id';
        } else if (err.status === 400) {
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