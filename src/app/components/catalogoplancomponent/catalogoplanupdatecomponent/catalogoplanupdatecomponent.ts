import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { Catalogoplanservice } from '../../../services/catalogoplanservice';
import { CatalogoPlanDTO } from '../../../models/CatalogoPlanDTO';

@Component({
  selector: 'app-catalogoplanupdatecomponent',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  templateUrl: './catalogoplanupdatecomponent.html',
  styleUrl: './catalogoplanupdatecomponent.css',
})
export class Catalogoplanupdatecomponent implements OnInit {
  idPlan: number = 0;
  planForm: FormGroup;
  mensaje: string = '';
  encontrado: boolean = false;   // si no se encuentra el plan, no se permite guardar

  constructor(
    private cpS: Catalogoplanservice,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.planForm = this.fb.group({
      codigo: [0],
      nombre: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(0)]],
      sesiones: [0, [Validators.required, Validators.min(-1)]],
      diagnostico: [false],
      actividades: [false],
      derivacion: [false],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Recuperar el id desde la URL (/planes/editar/:id)
    this.idPlan = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.idPlan || isNaN(this.idPlan)) {
      this.mensaje = 'Plan no encontrado';
      return;
    }
    this.buscarPlan();
  }

  buscarPlan(): void {
    this.cpS.listId(this.idPlan).subscribe({
      next: (plan: CatalogoPlanDTO) => {
        this.encontrado = true;
        this.planForm.patchValue({
          codigo: plan.catalogoPlanId,
          nombre: plan.nombreCatalogoPlan,
          precio: plan.precioMensualCatalogoPlan,
          sesiones: plan.limiteSesionesMes,
          diagnostico: plan.incluyeDiagnostico,
          actividades: plan.incluyeActividades,
          derivacion: plan.permiteDerivacion,
          descripcion: plan.descripcionCatalogoPlan
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.encontrado = false;
        this.mensaje = 'Plan no encontrado';
        this.cdr.detectChanges();
      }
    });
  }

  actualizarPlan(): void {
    if (this.planForm.invalid) {
      this.planForm.markAllAsTouched();   // pinta en rojo los campos con error
      this.mensaje = 'Complete todos los campos correctamente';
      return;
    }

    const plan: CatalogoPlanDTO = {
      catalogoPlanId: this.planForm.value.codigo,
      nombreCatalogoPlan: this.planForm.value.nombre,
      precioMensualCatalogoPlan: this.planForm.value.precio,
      limiteSesionesMes: this.planForm.value.sesiones,
      incluyeDiagnostico: this.planForm.value.diagnostico,
      incluyeActividades: this.planForm.value.actividades,
      permiteDerivacion: this.planForm.value.derivacion,
      descripcionCatalogoPlan: this.planForm.value.descripcion,
      activoCatalogoPlan: true   // el back conserva el estado real del plan
    };

    this.cpS.update(plan).subscribe({
      next: () => {
        this.mensaje = 'Plan actualizado correctamente';
        this.cdr.detectChanges();
        // espera un momento para que se lea el mensaje y vuelve a la lista
        setTimeout(() => this.router.navigate(['/planes/listar']), 1200);
      },
      error: (err) => {
        console.log(err);
        if (err.status === 400) {
          this.mensaje = err.error?.message || 'El nombre del plan free no se puede cambiar';
        } else if (err.status === 404) {
          this.mensaje = 'Plan no encontrado';
        } else {
          this.mensaje = 'Error al actualizar el plan';
        }
        this.cdr.detectChanges();
      }
    });
  }
}