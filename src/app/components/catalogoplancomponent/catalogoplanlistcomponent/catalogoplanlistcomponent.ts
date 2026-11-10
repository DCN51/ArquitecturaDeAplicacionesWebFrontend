import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  displayedColumns: string[] = ['nombre', 'precio', 'sesiones', 'diagnostico', 'actividades', 'derivacion', 'descripcion', 'editar', 'desactivar'];
  mensaje: string = '';        // error al cargar la lista
  mensajeAccion: string = '';  // resultado de desactivar

  constructor(private cpS: Catalogoplanservice, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listarPlanes();
  }

  // HUF04
  listarPlanes(): void {
    this.cpS.getPlanes().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.mensaje = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Ocurrió un error al obtener los planes', err);
        this.mensaje = 'Ocurrió un error al obtener los planes';
        this.cdr.detectChanges();
      }
    });
  }

  // HUF03 - el plan free no se puede desactivar
  esPlanFree(plan: CatalogoPlanDTO): boolean {
    return plan.nombreCatalogoPlan.toLowerCase() === 'free';
  }

  // HUF03
  desactivarPlan(plan: CatalogoPlanDTO): void {
    if (!confirm(`¿Seguro que deseas desactivar el plan "${plan.nombreCatalogoPlan}"?`)) {
      return;
    }

    this.cpS.desactivar(plan.catalogoPlanId).subscribe({
      next: () => {
        this.mensajeAccion = 'Plan desactivado correctamente';
        this.listarPlanes();   // el plan desactivado ya no aparece en la lista
      },
      error: (err) => {
        console.log(err);
        if (err.status === 400) {
          this.mensajeAccion = 'El plan free no se puede desactivar';
        } else if (err.status === 409) {
          this.mensajeAccion = 'El plan ya está desactivado';
        } else if (err.status === 404) {
          this.mensajeAccion = 'Plan no encontrado';
        } else {
          this.mensajeAccion = 'Error al desactivar el plan';
        }
        this.listarPlanes();
      }
    });
  }
}