import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { Sesionclinicaservice } from '../../../services/sesionclinicaservice';
import { SesionClinicaDTO } from '../../../models/SesionClinicaDTO';

@Component({
  selector: 'app-sesionclinicafinalizarcomponent',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    DatePipe,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './sesionclinicafinalizarcomponent.html',
  styleUrl: './sesionclinicafinalizarcomponent.css',
})
export class Sesionclinicafinalizarcomponent implements OnInit {
  idSesion: number = 0;
  sesion: SesionClinicaDTO | null = null;
  sesionForm: FormGroup;
  mensaje: string = '';
  editable: boolean = false;
  niveles: string[] = ['bajo', 'medio', 'alto', 'critico'];

  constructor(
    private scS: Sesionclinicaservice,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.sesionForm = this.fb.group({
      emocion: ['', Validators.maxLength(50)],
      urgencia: ['bajo', Validators.required],
      resumen: [''],
      derivacion: [false]
    });
  }

  ngOnInit(): void {
    this.idSesion = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.idSesion || isNaN(this.idSesion)) {
      this.mensaje = 'Sesión no encontrada';
      return;
    }
    this.buscarSesion();
  }

  buscarSesion(): void {
    this.scS.listId(this.idSesion).subscribe({
      next: (data: SesionClinicaDTO) => {
        this.sesion = data;
        this.editable = data.estado === 'en_curso';
        if (!this.editable) {
          this.mensaje = 'La sesión ya fue finalizada';
        }
        this.sesionForm.patchValue({
          emocion: data.emocionDetectada ?? '',
          urgencia: data.nivelUrgencia,
          resumen: data.resumenIa ?? '',
          derivacion: data.requiereDerivacion
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.editable = false;
        this.mensaje = 'Sesión no encontrada';
        this.cdr.detectChanges();
      }
    });
  }

  finalizarSesion(): void {
    if (this.sesionForm.invalid) {
      this.sesionForm.markAllAsTouched();
      this.mensaje = 'Complete todos los campos correctamente';
      return;
    }

    const datos: SesionClinicaDTO = new SesionClinicaDTO();
    datos.sesionClinicaId = this.idSesion;
    datos.usuarioId = this.sesion?.usuarioId ?? 0;
    datos.emocionDetectada = this.sesionForm.value.emocion?.trim() || null;
    datos.nivelUrgencia = this.sesionForm.value.urgencia;
    datos.resumenIa = this.sesionForm.value.resumen?.trim() || null;
    datos.requiereDerivacion = this.sesionForm.value.derivacion;

    this.scS.finalizar(this.idSesion, datos).subscribe({
      next: () => {
        this.mensaje = 'Sesión finalizada correctamente';
        this.editable = false;
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/sesiones/historial']), 1200);
      },
      error: (err) => {
        console.log(err);
        if (err.status === 400) {
          this.mensaje = err.error?.message || 'La sesión ya fue finalizada o los datos son inválidos';
        } else if (err.status === 404) {
          this.mensaje = 'Sesión no encontrada';
        } else {
          this.mensaje = 'Error al finalizar la sesión';
        }
        this.cdr.detectChanges();
      }
    });
  }
}
