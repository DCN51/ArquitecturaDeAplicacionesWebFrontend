import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Sesionclinicaservice } from '../../../services/sesionclinicaservice';
import { SesionClinicaDTO } from '../../../models/SesionClinicaDTO';

@Component({
  selector: 'app-sesionclinicaderivacionescomponent',
  imports: [MatTableModule, DatePipe],
  templateUrl: './sesionclinicaderivacionescomponent.html',
  styleUrl: './sesionclinicaderivacionescomponent.css',
})
export class Sesionclinicaderivacionescomponent implements OnInit {
  dataSource: SesionClinicaDTO[] = [];
  displayedColumns: string[] = ['id', 'paciente', 'inicio', 'urgencia', 'emocion', 'resumen'];
  mensaje: string = '';
  cargando: boolean = true;

  constructor(private scS: Sesionclinicaservice, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listarDerivaciones();
  }

  listarDerivaciones(): void {
    this.scS.derivaciones().subscribe({
      next: (data: SesionClinicaDTO[]) => {
        this.dataSource = data;
        this.cargando = false;
        this.mensaje = data.length > 0 ? '' : 'No hay sesiones que requieran derivación';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.cargando = false;
        this.mensaje = err.error?.message || 'Ocurrió un error al obtener las derivaciones';
        this.cdr.detectChanges();
      }
    });
  }
}
