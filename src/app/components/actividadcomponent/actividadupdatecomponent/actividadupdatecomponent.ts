import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Actividadservice } from '../../../services/actividadservice';
import { ActividadDTO } from '../../../models/ActividadDTO';

@Component({
  selector: 'app-actividadupdatecomponent',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './actividadupdatecomponent.html',
  styleUrl: './actividadupdatecomponent.css',
})
export class Actividadupdatecomponent implements OnInit {
  userId: number = 0;
  idActividad: number = 0;
  actividad: ActividadDTO | null = null;   // la actividad original
  actividadForm: FormGroup;
  mensaje: string = '';
  tipos: string[] = ['Respiración', 'Relajación', 'Actividad física', 'Hábitos', 'Registro emocional'];

  constructor(
    private aS: Actividadservice,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.actividadForm = this.fb.group({
      codigo: [0],
      usuarioId: [0],
      diagnosticoId: [0],
      estado: [''],
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.maxLength(255)]],
      tipo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // /actividades/editar/:userId/:id
    this.userId = Number(this.route.snapshot.paramMap.get('userId'));
    this.idActividad = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.userId || !this.idActividad || isNaN(this.userId) || isNaN(this.idActividad)) {
      this.mensaje = 'Actividad no encontrada';
      return;
    }
    this.buscarActividad();
  }

  // Sin GET por id: se trae la lista del paciente y se busca con find()
  buscarActividad(): void {
    this.aS.getActividades(this.userId).subscribe({
      next: (data: ActividadDTO[]) => {
        const a = data.find(x => x.recommendedActivityId === this.idActividad);

        if (!a) {
          this.mensaje = 'Actividad no encontrada';
        } else {
          this.actividad = a;
          this.actividadForm.patchValue({
            codigo: a.recommendedActivityId,
            usuarioId: a.userId,
            diagnosticoId: a.diagnosisId,
            estado: a.status,
            titulo: a.title,
            descripcion: a.description,
            tipo: a.type
          });
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.mensaje = 'Actividad no encontrada';
        this.cdr.detectChanges();
      }
    });
  }

  actualizarActividad(): void {
    if (!this.actividad) {
      return;
    }
    if (this.actividadForm.invalid) {
      this.actividadForm.markAllAsTouched();
      this.mensaje = 'Complete todos los campos correctamente';
      return;
    }

    // El back pide paciente y diagnóstico aunque no cambien; estado y comentario los conserva él
    const dto: ActividadDTO = {
      ...this.actividad,
      title: this.actividadForm.value.titulo,
      description: this.actividadForm.value.descripcion,
      type: this.actividadForm.value.tipo
    };

    this.aS.update(this.idActividad, dto).subscribe({
      next: () => {
        this.mensaje = 'Actividad actualizada correctamente';
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/actividades/listar']), 1200);
      },
      error: (err) => {
        console.log(err);
        if (err.status === 404) {
          this.mensaje = 'Actividad no encontrada';
        } else if (err.status === 400) {
          this.mensaje = 'Revise los datos de la actividad';
        } else {
          this.mensaje = 'Error al actualizar la actividad';
        }
        this.cdr.detectChanges();
      }
    });
  }
}