import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Suscripcionservice } from '../../../services/suscripcionservice';
import { Usersservice } from '../../../services/usersservice';
import { Catalogoplanservice } from '../../../services/catalogoplanservice';
import { SuscripcionDTO } from '../../../models/SuscripcionDTO';
import { UserDTO } from '../../../models/UserDTO';
import { CatalogoPlanDTO } from '../../../models/CatalogoPlanDTO';

@Component({
  selector: 'app-suscripcionporvencercomponent',
  imports: [
    FormsModule,
    DatePipe,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './suscripcionporvencercomponent.html',
  styleUrl: './suscripcionporvencercomponent.css',
})
export class Suscripcionporvencercomponent implements OnInit {
  dias: number | null = 7;          // 7 por defecto, igual que el back
  lista: SuscripcionDTO[] = [];
  usuarios: UserDTO[] = [];         // para mostrar nombre y correo
  planes: CatalogoPlanDTO[] = [];   // para mostrar el nombre del plan
  mensaje: string = '';
  displayedColumns: string[] = ['id', 'usuario', 'correo', 'plan', 'fin'];

  constructor(
    private sS: Suscripcionservice,
    private uS: Usersservice,
    private cpS: Catalogoplanservice,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.consultar();   // al entrar muestra las que vencen en 7 días
  }

  cargarUsuarios(): void {
    this.uS.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.log('No se pudieron cargar los usuarios', err)
    });
  }

  consultar(): void {
    if (this.dias === null || this.dias < 0) {
      this.lista = [];
      this.mensaje = 'Ingrese un número de días válido (0 o más)';
      return;
    }

    const dias = this.dias;
    this.sS.porVencer(dias).subscribe({
      next: (data: SuscripcionDTO[]) => {
        this.lista = data;   // el back ya las ordena por fecha de fin
        this.mensaje = data.length > 0 ? '' : `No hay suscripciones por vencer en los próximos ${dias} días`;
        this.cargarNombresPlanes(data);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.lista = [];
        this.mensaje = err.status === 400
          ? 'Ingrese un número de días válido (0 o más)'
          : 'Ocurrió un error al consultar las suscripciones';
        this.cdr.detectChanges();
      }
    });
  }

  nombreUsuario(id: number): string {
    const u = this.usuarios.find(x => x.userId === id);
    return u ? `${u.firstName} ${u.lastName}` : `Usuario ${id}`;
  }

  correoUsuario(id: number): string {
    const u = this.usuarios.find(x => x.userId === id);
    return u ? u.email : '-';
  }

  // Igual que en el historial: pide cada plan que aún no tenemos
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