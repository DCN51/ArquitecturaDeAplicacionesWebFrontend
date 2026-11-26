import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Suscripcionservice } from '../../../services/suscripcionservice';
import { SuscripcionDTO } from '../../../models/SuscripcionDTO';

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
  dias: number | null = 7;
  lista: SuscripcionDTO[] = [];
  mensaje: string = '';
  displayedColumns: string[] = ['id', 'paciente', 'plan', 'fin'];

  constructor(
    private sS: Suscripcionservice,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.consultar();
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
        this.lista = data;
        this.mensaje = data.length > 0 ? '' : `No hay suscripciones por vencer en los próximos ${dias} días`;
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
}