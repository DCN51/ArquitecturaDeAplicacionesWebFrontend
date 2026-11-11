import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Sesionclinicaservice } from '../../../services/sesionclinicaservice';
import { SesionClinicaDTO } from '../../../models/SesionClinicaDTO';

@Component({
  selector: 'app-sesionclinicainsertcomponent',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './sesionclinicainsertcomponent.html',
  styleUrl: './sesionclinicainsertcomponent.css',
})
export class Sesionclinicainsertcomponent {
  sesionForm: FormGroup;
  mensaje: string = '';
  sesionCreada: SesionClinicaDTO | null = null;

  constructor(
    private scS: Sesionclinicaservice,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.sesionForm = this.fb.group({
      usuarioId: [null, [Validators.required, Validators.min(1)]]
    });
  }

  iniciarSesion(): void {
    this.sesionCreada = null;
    if (this.sesionForm.invalid) {
      this.sesionForm.markAllAsTouched();
      this.mensaje = 'Ingrese un id de usuario válido';
      return;
    }

    const sesion: SesionClinicaDTO = new SesionClinicaDTO();
    sesion.usuarioId = this.sesionForm.value.usuarioId;

    this.scS.iniciar(sesion).subscribe({
      next: (data: SesionClinicaDTO) => {
        this.sesionCreada = data;
        this.mensaje = `Sesión ${data.sesionClinicaId} iniciada correctamente`;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        if (err.status === 409) {
          this.mensaje = 'El usuario ya tiene una sesión en curso';
        } else if (err.status === 404) {
          this.mensaje = 'No existe el usuario ingresado';
        } else {
          this.mensaje = err.error?.message || 'Error al iniciar la sesión';
        }
        this.cdr.detectChanges();
      }
    });
  }
}
