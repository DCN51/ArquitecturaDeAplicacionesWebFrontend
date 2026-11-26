import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Psicologoservice } from '../../../services/psicologoservice';
import { PsicologoDTO } from '../../../models/PsicologoDTO';
import { CapacidadPsicologoDTO } from '../../../models/CapacidadPsicologoDTO';

@Component({
  selector: 'app-psicologocapacidadcomponent',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './psicologocapacidadcomponent.html',
  styleUrl: './psicologocapacidadcomponent.css',
})
export class Psicologocapacidadcomponent implements OnInit {
  idPsicologo: number = 0;
  psicologo: PsicologoDTO | null = null;
  capacidadForm: FormGroup;
  mensaje: string = '';

  constructor(
    private pS: Psicologoservice,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.capacidadForm = this.fb.group({
      maxPacientes: [null, [Validators.required, Validators.min(1), Validators.max(500)]]
    });
  }

  ngOnInit(): void {
    this.idPsicologo = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.idPsicologo || isNaN(this.idPsicologo)) {
      this.mensaje = 'Psicólogo no encontrado';
      return;
    }
    this.buscarPsicologo();
  }

  buscarPsicologo(): void {
    this.pS.getPsicologos().subscribe({
      next: (data: PsicologoDTO[]) => {
        const p = data.find(x => x.psicologoId === this.idPsicologo);
        if (!p) {
          this.mensaje = 'Psicólogo no encontrado';
        } else {
          this.psicologo = p;
          this.capacidadForm.patchValue({ maxPacientes: p.maxPacientes });
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.mensaje = err.error?.message || 'Ocurrió un error al obtener el psicólogo';
        this.cdr.detectChanges();
      }
    });
  }

  guardarCapacidad(): void {
    if (!this.psicologo) {
      return;
    }
    if (this.capacidadForm.invalid) {
      this.capacidadForm.markAllAsTouched();
      this.mensaje = 'Ingrese una capacidad entre 1 y 500';
      return;
    }

    const dto: CapacidadPsicologoDTO = { maxPacientes: Number(this.capacidadForm.value.maxPacientes) };

    this.pS.cambiarCapacidad(this.idPsicologo, dto).subscribe({
      next: () => {
        this.mensaje = 'Capacidad actualizada correctamente';
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/psicologos/listar']), 1200);
      },
      error: (err) => {
        console.log(err);
        this.mensaje = err.error?.message || 'Error al actualizar la capacidad';
        this.cdr.detectChanges();
      }
    });
  }
}
