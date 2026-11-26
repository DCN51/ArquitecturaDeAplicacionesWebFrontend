import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { Catalogoplanservice } from '../../../services/catalogoplanservice';
import { CatalogoPlanDTO } from '../../../models/CatalogoPlanDTO';

@Component({
  selector: 'app-catalogoplaninsertcomponent',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './catalogoplaninsertcomponent.html',
  styleUrl: './catalogoplaninsertcomponent.css',
})
export class Catalogoplaninsertcomponent implements OnInit {
  planForm: FormGroup;
  mensaje: string = '';

  constructor(
    private cpS: Catalogoplanservice,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.planForm = this.fb.group({
      nombre: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      ilimitadas: [false],
      sesiones: [1, [Validators.required, Validators.min(1)]],
      diagnostico: [false],
      actividades: [false],
      derivacion: [false],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.planForm.get('ilimitadas')?.valueChanges.subscribe(valor => this.alternarIlimitadas(valor));
  }

  alternarIlimitadas(ilimitadas: boolean): void {
    const sesiones = this.planForm.get('sesiones');
    if (ilimitadas) {
      sesiones?.setValue(null);
      sesiones?.disable();
    } else {
      sesiones?.enable();
    }
  }

  private limiteSesiones(): number {
    return this.planForm.value.ilimitadas ? -1 : Number(this.planForm.value.sesiones);
  }

  insertarPlan(): void {
    if (this.planForm.invalid) {
      this.planForm.markAllAsTouched();
      this.mensaje = 'Complete todos los campos correctamente';
      return;
    }

    const plan: CatalogoPlanDTO = {
      catalogoPlanId: 0,
      nombreCatalogoPlan: this.planForm.value.nombre,
      precioMensualCatalogoPlan: this.planForm.value.precio,
      limiteSesionesMes: this.limiteSesiones(),
      incluyeDiagnostico: this.planForm.value.diagnostico,
      incluyeActividades: this.planForm.value.actividades,
      permiteDerivacion: this.planForm.value.derivacion,
      descripcionCatalogoPlan: this.planForm.value.descripcion,
      activoCatalogoPlan: true
    };

    this.cpS.insert(plan).subscribe({
      next: () => {
        this.mensaje = 'Plan registrado correctamente';
        this.planForm.reset({
          nombre: '', precio: 0, ilimitadas: false, sesiones: 1,
          diagnostico: false, actividades: false, derivacion: false,
          descripcion: ''
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        if (err.status === 409) {
          this.mensaje = err.error?.message || 'Ya existe un plan con ese nombre';
        } else {
          this.mensaje = err.error?.message || 'Error al registrar el plan';
        }
        this.cdr.detectChanges();
      }
    });
  }
}