import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
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
export class Catalogoplaninsertcomponent {
  planForm: FormGroup;
  // resetForm() limpia el formulario sin dejar los campos marcados en rojo
  @ViewChild(FormGroupDirective) formDir?: FormGroupDirective;
  mensaje: string = '';

  constructor(
    private cpS: Catalogoplanservice,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.planForm = this.fb.group({
      nombre: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      sesiones: [1, [Validators.required, Validators.min(1)]],
      ilimitado: [false],
      diagnostico: [false],
      actividades: [false],
      derivacion: [false],
      descripcion: ['', Validators.required]
    });

    // Si se marca "Sesiones ilimitadas", el límite no se pide (se envía -1)
    this.planForm.get('ilimitado')?.valueChanges.subscribe(ilimitado => {
      const sesiones = this.planForm.get('sesiones');
      if (ilimitado) {
        sesiones?.disable();
      } else {
        sesiones?.enable();
      }
    });
  }

  insertarPlan(): void {
    if (this.planForm.invalid) {
      this.planForm.markAllAsTouched();   // pinta en rojo los campos con error
      this.mensaje = 'Complete todos los campos correctamente';
      return;
    }

    const plan: CatalogoPlanDTO = {
      catalogoPlanId: 0,
      nombreCatalogoPlan: this.planForm.value.nombre,
      precioMensualCatalogoPlan: this.planForm.value.precio,
      limiteSesionesMes: this.planForm.value.ilimitado ? -1 : this.planForm.value.sesiones,   // -1 = ilimitadas
      incluyeDiagnostico: this.planForm.value.diagnostico,
      incluyeActividades: this.planForm.value.actividades,
      permiteDerivacion: this.planForm.value.derivacion,
      descripcionCatalogoPlan: this.planForm.value.descripcion,
      activoCatalogoPlan: true
    };

    this.cpS.insert(plan).subscribe({
      next: () => {
        this.mensaje = 'Plan registrado correctamente';
        this.formDir?.resetForm({
          nombre: '', precio: 0, sesiones: 1, ilimitado: false,
          diagnostico: false, actividades: false, derivacion: false,
          descripcion: ''
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        if (err.status === 409) {
          this.mensaje = 'Ya existe un plan con ese nombre';
        } else {
          this.mensaje = err.error?.message || 'Error al registrar el plan';
        }
        this.cdr.detectChanges();
      }
    });
  }
}