import { ChangeDetectorRef, Component } from '@angular/core';
import { Loginservice } from '../../../services/loginservice';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Suscripcionservice } from '../../../services/suscripcionservice';
import { Catalogoplanservice } from '../../../services/catalogoplanservice';
import { SuscripcionDTO } from '../../../models/SuscripcionDTO';
import { CatalogoPlanDTO } from '../../../models/CatalogoPlanDTO';

@Component({
  selector: 'app-suscripcionhistorialcomponent',
  imports: [
    FormsModule,
    DatePipe,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './suscripcionhistorialcomponent.html',
  styleUrl: './suscripcionhistorialcomponent.css',
})
export class Suscripcionhistorialcomponent {
  usuarioId: number | null = null;
  usuarioBuscado: number = 0;
  lista: SuscripcionDTO[] = [];
  mensaje: string = '';
  mensajeAccion: string = '';
  planes: CatalogoPlanDTO[] = [];

  private baseColumns: string[] = ['plan', 'inicio', 'fin', 'estado'];

  get displayedColumns(): string[] {
    return this.esPaciente
      ? [...this.baseColumns, 'cancelar']
      : this.baseColumns;
  }

  get esPaciente(): boolean {
    return this.loginService.hasAnyRole(['PACIENTE']);
  }

  constructor(
    private loginService: Loginservice,
    private sS: Suscripcionservice,
    private cpS: Catalogoplanservice,
    private cdr: ChangeDetectorRef
  ) { }

  buscarHistorial(): void {
    this.mensajeAccion = '';
    if (!this.usuarioId || this.usuarioId < 1) {
      this.lista = [];
      this.mensaje = 'Ingrese su id de usuario';
      return;
    }
    this.usuarioBuscado = this.usuarioId;
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.sS.historial(this.usuarioBuscado).subscribe({
      next: (data: SuscripcionDTO[]) => {
        this.lista = data;
        this.mensaje = data.length > 0 ? '' : 'No tienes suscripciones registradas';
        this.cargarNombresPlanes(data);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.lista = [];
        this.mensaje = 'Ocurrió un error al consultar el historial';
        this.cdr.detectChanges();
      }
    });
  }

  cancelarSuscripcion(s: SuscripcionDTO): void {
    const nombre = this.nombrePlan(s.catalogoPlanId);
    if (!confirm(`¿Seguro que deseas cancelar tu suscripción al plan "${nombre}"?`)) {
      return;
    }

    this.sS.cancelar(this.usuarioBuscado).subscribe({
      next: () => {
        this.mensajeAccion = 'Suscripción cancelada correctamente';
        this.cargarHistorial();
      },
      error: (err) => {
        console.log(err);
        if (err.status === 404) {
          this.mensajeAccion = 'No tienes una suscripción activa';
        } else {
          this.mensajeAccion = 'Error al cancelar la suscripción';
        }
        this.cargarHistorial();
      }
    });
  }

  cargarNombresPlanes(lista: SuscripcionDTO[]): void {
    for (const s of lista) {
      const yaLoTengo = this.planes.some(p => p.catalogoPlanId === s.catalogoPlanId);

      if (!yaLoTengo) {
        this.cpS.listId(s.catalogoPlanId).subscribe({
          next: (plan: CatalogoPlanDTO) => {
            if (!this.planes.some(p => p.catalogoPlanId === plan.catalogoPlanId)) {
              this.planes.push(plan);
            }
            this.cdr.detectChanges();
          },
          error: (err) => console.log('No se pudo obtener el plan', err)
        });
      }
    }
  }

  nombrePlan(id: number): string {
    const plan = this.planes.find(p => p.catalogoPlanId === id);
    return plan ? plan.nombreCatalogoPlan : `Plan ${id}`;
  }
}