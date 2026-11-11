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
  displayedColumns: string[] = ['id', 'usuario', 'inicio', 'urgencia', 'emocion', 'resumen'];
  mensaje: string = '';

  constructor(private scS: Sesionclinicaservice, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listarDerivaciones();
  }

  listarDerivaciones(): void {
    this.scS.derivaciones().subscribe({
      next: (data: SesionClinicaDTO[]) => {
        this.dataSource = data;
        this.mensaje = data.length > 0 ? '' : 'No hay sesiones que requieran derivación';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.mensaje = 'Ocurrió un error al obtener las derivaciones';
        this.cdr.detectChanges();
      }
    });
  }
}
