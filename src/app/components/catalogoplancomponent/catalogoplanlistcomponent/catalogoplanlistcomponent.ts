import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Loginservice } from '../../../services/loginservice';
import { CurrencyPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CatalogoPlanDTO } from '../../../models/CatalogoPlanDTO';
import { Catalogoplanservice } from '../../../services/catalogoplanservice';

@Component({
  selector: 'app-catalogoplanlistcomponent',
  imports: [MatTableModule, CurrencyPipe, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './catalogoplanlistcomponent.html',
  styleUrl: './catalogoplanlistcomponent.css',
})
export class Catalogoplanlistcomponent implements OnInit {
  dataSource: CatalogoPlanDTO[] = [];
  mensaje: string = '';
  mensajeAccion: string = '';

  private baseColumns: string[] = ['nombre', 'precio', 'sesiones', 'diagnostico', 'actividades', 'derivacion', 'descripcion'];

  get displayedColumns(): string[] {
    return this.esAdmin
      ? [...this.baseColumns, 'editar', 'desactivar']
      : this.baseColumns;
  }

  get esAdmin(): boolean {
    return this.loginService.hasAnyRole(['ADMINISTRADOR']);
  }

  constructor(private loginService: Loginservice, private cpS: Catalogoplanservice, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listarPlanes();
  }

  listarPlanes(): void {
    this.cpS.getPlanes().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.mensaje = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Ocurrió un error al obtener los planes', err);
        this.mensaje = err.error?.message || 'Ocurrió un error al obtener los planes';
        this.cdr.detectChanges();
      }
    });
  }

  esPlanFree(plan: CatalogoPlanDTO): boolean {
    return plan.nombreCatalogoPlan.toLowerCase() === 'free';
  }

  desactivarPlan(plan: CatalogoPlanDTO): void {
    if (!confirm(`¿Seguro que deseas desactivar el plan "${plan.nombreCatalogoPlan}"?`)) {
      return;
    }

    this.cpS.desactivar(plan.catalogoPlanId).subscribe({
      next: () => {
        this.mensajeAccion = 'Plan desactivado correctamente';
        this.listarPlanes();
      },
      error: (err) => {
        console.log(err);
        if (err.status === 400) {
          this.mensajeAccion = err.error?.message || 'El plan free no se puede desactivar';
        } else if (err.status === 409) {
          this.mensajeAccion = err.error?.message || 'El plan ya está desactivado';
        } else if (err.status === 404) {
          this.mensajeAccion = err.error?.message || 'Plan no encontrado';
        } else {
          this.mensajeAccion = err.error?.message || 'Error al desactivar el plan';
        }
        this.listarPlanes();
      }
    });
  }
}