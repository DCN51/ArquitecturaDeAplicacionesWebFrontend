import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Loginservice } from '../../../services/loginservice';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Suscripcionservice } from '../../../services/suscripcionservice';
import { Catalogoplanservice } from '../../../services/catalogoplanservice';
import { SuscripcionDTO } from '../../../models/SuscripcionDTO';
import { CatalogoPlanDTO } from '../../../models/CatalogoPlanDTO';

@Component({
  selector: 'app-suscripcionhistorialcomponent',
  imports: [
    DatePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './suscripcionhistorialcomponent.html',
  styleUrl: './suscripcionhistorialcomponent.css',
})
export class Suscripcionhistorialcomponent implements OnInit {
  usuarioId: number = 0;          // el usuario que inició sesión
  lista: SuscripcionDTO[] = [];
  mensaje: string = '';
  mensajeAccion: string = '';     // resultado de cancelar (HUF07)
  planes: CatalogoPlanDTO[] = [];

  // Columnas que ven todos
  private baseColumns: string[] = ['plan', 'inicio', 'fin', 'estado'];

  // Solo el paciente ve cancelar
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

  // HUF08 - el historial se carga solo al abrir la pantalla
  ngOnInit(): void {
    this.usuarioId = this.loginService.getUserId();
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.sS.historial(this.usuarioId).subscribe({
      next: (data: SuscripcionDTO[]) => {
        this.lista = data;   // el back ya las ordena de la más reciente a la más antigua
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

  // HUF07 - solo se llama desde la fila "activa" de un plan pagado (el free no se cancela)
  cancelarSuscripcion(s: SuscripcionDTO): void {
    const nombre = this.nombrePlan(s.catalogoPlanId);
    if (!confirm(`¿Seguro que deseas cancelar tu suscripción al plan "${nombre}"?`)) {
      return;
    }

    this.sS.cancelar(this.usuarioId).subscribe({
      next: () => {
        this.mensajeAccion = 'Suscripción cancelada correctamente. Volviste al plan Free';
        this.cargarHistorial();   // recarga la tabla: la fila pasa a "cancelada"
      },
      error: (err) => {
        console.log(err);
        if (err.status === 404) {
          this.mensajeAccion = 'No tienes una suscripción activa';
        } else if (err.status === 400) {
          this.mensajeAccion = 'El plan free no se puede cancelar';
        } else {
          this.mensajeAccion = 'Error al cancelar la suscripción';
        }
        this.cargarHistorial();
      }
    });
  }

  // Por cada plan del historial que aún no tenemos, lo pide con GET /api/CatalogoPlan/{id}
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