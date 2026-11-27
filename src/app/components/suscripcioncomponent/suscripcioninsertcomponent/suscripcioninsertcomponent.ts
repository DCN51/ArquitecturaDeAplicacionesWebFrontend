import { ChangeDetectorRef, Component, ViewChild, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Suscripcionservice } from '../../../services/suscripcionservice';
import { Loginservice } from '../../../services/loginservice';
import { Catalogoplanservice } from '../../../services/catalogoplanservice';
import { SuscripcionDTO } from '../../../models/SuscripcionDTO';
import { CatalogoPlanDTO } from '../../../models/CatalogoPlanDTO';

@Component({
  selector: 'app-suscripcioninsertcomponent',
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
  templateUrl: './suscripcioninsertcomponent.html',
  styleUrl: './suscripcioninsertcomponent.css',
})
export class Suscripcioninsertcomponent implements OnInit {
  suscripcionForm: FormGroup;
  // resetForm() limpia el formulario sin dejar los campos marcados en rojo
  @ViewChild(FormGroupDirective) formDir?: FormGroupDirective;
  planes: CatalogoPlanDTO[] = [];
  metodosPago: string[] = ['tarjeta', 'yape', 'plin'];
  planEsDePago: boolean = false;
  mensaje: string = '';
  suscripcionCreada: SuscripcionDTO | null = null;
  verificando: boolean = true;       // mientras se revisa el plan actual
  tienePlanPagado: boolean = false;  // si ya paga, debe usar Cambiar plan

  constructor(
    private sS: Suscripcionservice,
    private cpS: Catalogoplanservice,
    private loginService: Loginservice,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.suscripcionForm = this.fb.group({
      catalogoPlanId: ['', Validators.required],
      metodoPago: [''],
      referenciaPago: ['']
    });
  }

  ngOnInit(): void {
    this.revisarPlanActual();
    this.cargarPlanes();
    // cada vez que cambia el plan elegido, se revisa si pide datos de pago
    this.suscripcionForm.get('catalogoPlanId')?.valueChanges.subscribe(id => {
      this.actualizarValidacionPago(id);
    });
  }

  // Si el paciente ya tiene un plan pagado, no puede contratar otro
  revisarPlanActual(): void {
    this.sS.tienePlanPagado(this.loginService.getUserId()).subscribe({
      next: (pagado) => {
        this.tienePlanPagado = pagado;
        this.verificando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.verificando = false;   // si falla, el back igual valida al contratar
        this.cdr.detectChanges();
      }
    });
  }

  // Solo se muestran los planes activos (los trae el GET de planes)
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

    const metodo = this.suscripcionForm.get('metodoPago');
    const referencia = this.suscripcionForm.get('referenciaPago');

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
    return this.planes.find(p => p.catalogoPlanId === id)?.nombreCatalogoPlan ?? `Plan ${id}`;
  }

  contratarPlan(): void {
    if (this.suscripcionForm.invalid) {
      this.suscripcionForm.markAllAsTouched();
      this.mensaje = 'Complete todos los campos correctamente';
      return;
    }

    // Fechas y estado no se envían: los asigna el back
    const s: SuscripcionDTO = {
      suscripcionId: 0,
      fechaInicio: null,
      fechaFin: null,
      estadoSuscripcion: '',
      metodoPagoSuscripcion: this.planEsDePago ? this.suscripcionForm.value.metodoPago : null,
      referenciaPagoSuscripcion: this.planEsDePago ? this.suscripcionForm.value.referenciaPago : null,
      usuarioId: this.loginService.getUserId(),   // el usuario que inició sesión
      catalogoPlanId: this.suscripcionForm.value.catalogoPlanId
    };

    this.suscripcionCreada = null;

    this.sS.insert(s).subscribe({
      next: (data) => {
        this.suscripcionCreada = data;
        this.tienePlanPagado = data.fechaFin !== null;   // ya no puede volver a contratar
        this.mensaje = 'Plan contratado correctamente';
        this.formDir?.resetForm({ catalogoPlanId: '', metodoPago: '', referenciaPago: '' });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        const mensajeBack = err.error?.message;
        if (err.status === 409) {
          this.mensaje = mensajeBack || 'Ya tienes una suscripción activa';
        } else if (err.status === 400) {
          this.mensaje = mensajeBack || 'No se pudo contratar el plan';
        } else if (err.status === 404) {
          this.mensaje = mensajeBack || 'No existe el usuario o el plan';
        } else {
          this.mensaje = 'Error al contratar el plan';
        }
        this.cdr.detectChanges();
      }
    });
  }
}