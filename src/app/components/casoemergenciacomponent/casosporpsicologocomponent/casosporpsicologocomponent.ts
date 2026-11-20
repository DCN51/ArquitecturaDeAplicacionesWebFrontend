import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Casoemergenciaservice } from '../../../services/casoemergenciaservice';
import { CasosPorPsicologoDTO } from '../../../models/CasosPorPsicologoDTO';

@Component({
  selector: 'app-casosporpsicologocomponent',
  imports: [MatTableModule],
  templateUrl: './casosporpsicologocomponent.html',
  styleUrl: './casosporpsicologocomponent.css',
})
export class Casosporpsicologocomponent implements OnInit {
  dataSource: CasosPorPsicologoDTO[] = [];
  displayedColumns: string[] = ['psicologo', 'cantidad'];
  mensaje: string = '';
  cargando: boolean = true;

  constructor(private ceS: Casoemergenciaservice, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.ceS.contarPorPsicologo().subscribe({
      next: (data: CasosPorPsicologoDTO[]) => {
        this.dataSource = data;
        this.mensaje = data.length > 0 ? '' : 'Aún no hay casos asignados a psicólogos';
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.dataSource = [];
        this.cargando = false;
        if (err.status === 401 || err.status === 403) {
          this.mensaje = 'No tienes permiso para ver este reporte';
        } else {
          this.mensaje = 'Ocurrió un error al obtener el reporte';
        }
        this.cdr.detectChanges();
      }
    });
  }
}
