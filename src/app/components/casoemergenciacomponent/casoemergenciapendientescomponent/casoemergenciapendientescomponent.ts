import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Casoemergenciaservice } from '../../../services/casoemergenciaservice';
import { CasoEmergenciaDTO } from '../../../models/CasoEmergenciaDTO';

@Component({
  selector: 'app-casoemergenciapendientescomponent',
  imports: [MatTableModule, MatButtonModule, MatIconModule, DatePipe, RouterLink],
  templateUrl: './casoemergenciapendientescomponent.html',
  styleUrl: './casoemergenciapendientescomponent.css',
})
export class Casoemergenciapendientescomponent implements OnInit {
  dataSource: CasoEmergenciaDTO[] = [];
  displayedColumns: string[] = ['id', 'urgencia', 'fecha', 'paciente', 'sesion', 'resumen', 'atender'];
  mensaje: string = '';
  cargando: boolean = true;

  constructor(private ceS: Casoemergenciaservice, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.ceS.listarPendientes().subscribe({
      next: (data: CasoEmergenciaDTO[]) => {
        this.dataSource = data;
        this.mensaje = data.length > 0 ? '' : 'No hay casos pendientes';
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.dataSource = [];
        this.cargando = false;
        if (err.status === 401 || err.status === 403) {
          this.mensaje = 'No tienes permiso para ver los casos pendientes';
        } else {
          this.mensaje = 'Ocurrió un error al obtener los casos pendientes';
        }
        this.cdr.detectChanges();
      }
    });
  }
}
