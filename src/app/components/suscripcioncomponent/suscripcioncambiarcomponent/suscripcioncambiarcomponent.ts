import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Suscripcionservice } from '../../../services/suscripcionservice';
import { Catalogoplanservice } from '../../../services/catalogoplanservice';
import { SuscripcionDTO } from '../../../models/SuscripcionDTO';
import { CatalogoPlanDTO } from '../../../models/CatalogoPlanDTO';

@Component({
  selector: 'app-suscripcioncambiarcomponent',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CurrencyPipe,
    DatePipe,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './suscripcioncambiarcomponent.html',
  styleUrl: './suscripcioncambiarcomponent.css',
})
export class Suscripcioncambiarcomponent implements OnInit {
  cambioForm: FormGroup;
  planes: CatalogoPlanDTO[] = [];
  metodosPago: string[] = ['tarjeta', 'yape', 'plin'];
  planEsDePago: boolean = false;
  mensaje: string = '';
  nuevaSuscripcion: SuscripcionDTO | null = null;

  constructor(
    private sS: Suscripcionservice,
    private cpS: Catalogoplanservice,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.cambioForm = this.fb.group({
      usuarioId: ['', [Validators.required, Validators.min(1)]],
      catalogoPlanId: ['', Validators.required],
      metodoPago: [''],
      referenciaPago: ['']
    });
  }

  ngOnInit(): void {
    this.cargarPlanes();
    // cada vez que cambia el plan elegido, se revisa si pide datos de pago
    this.cambioForm.get('catalogoPlanId')?.valueChanges.subscribe(id => {
      this.actualizarValidacionPago(id);
    });
  }

  // Solo se muestran los planes activos
  cargarPlanes(): void {
    this.cpS.getPlanes().subscribe({
      next: (data) => {
        this.planes = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.mensaje = 'Ocurrió un error al obtener los planes';
        this.cdr.detectChanges();
      }
    });
  }

  // Método y referencia de pago: obligatorios solo si el plan cuesta más de 0
  actualizarValidacionPago(planId: number): void {
    const plan = this.planes.find(p => p.catalogoPlanId === planId);
    this.planEsDePago = !!plan && plan.precioMensualCatalogoPlan > 0;

    const metodo = this.cambioForm.get('metodoPago');
    const referencia = this.cambioForm.get('referenciaPago');

    if (this.planEsDePago) {
      metodo?.setValidators(Validators.required);
      referencia?.setValidators(Validators.required);
    } else {
      metodo?.clearValidators();
      referencia?.clearValidators();
      metodo?.setValue('');
      referencia?.setValue('');
    }
    metodo?.updateValueAndValidity();
    referencia?.updateValueAndValidity();
  }

  nombrePlan(id: number): string {
    const plan = this.planes.find(p => p.catalogoPlanId === id);
    return plan ? plan.nombreCatalogoPlan : `Plan ${id}`;
  }

  cambiarDePlan(): void {
    if (this.cambioForm.invalid) {
      this.cambioForm.markAllAsTouched();
      this.mensaje = 'Complete todos los campos correctamente';
      return;
    }

    // Fechas y estado no se envían: los asigna el back
    const s: SuscripcionDTO = {
      suscripcionId: 0,
      fechaInicio: null,
      fechaFin: null,
      estadoSuscripcion: '',
      metodoPagoSuscripcion: this.planEsDePago ? this.cambioForm.value.metodoPago : null,
      referenciaPagoSuscripcion: this.planEsDePago ? this.cambioForm.value.referenciaPago : null,
      usuarioId: Number(this.cambioForm.value.usuarioId),
      catalogoPlanId: this.cambioForm.value.catalogoPlanId
    };

    this.nuevaSuscripcion = null;

    this.sS.cambiarPlan(s).subscribe({
      next: (data) => {
        this.nuevaSuscripcion = data;
        this.mensaje = 'Plan cambiado correctamente';
        this.cambioForm.reset({ usuarioId: '', catalogoPlanId: '', metodoPago: '', referenciaPago: '' });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        const mensajeBack = err.error?.message;
        if (err.status === 404) {
          // puede ser "No existe el usuario con el id: X" o "No tienes una suscripción activa"
          this.mensaje = mensajeBack || 'No tienes una suscripción activa';
        } else if (err.status === 400) {
          this.mensaje = mensajeBack || 'Ya estás suscrito a este plan';
        } else {
          this.mensaje = 'Error al cambiar de plan';
        }
        this.cdr.detectChanges();
      }
    });
  }
}