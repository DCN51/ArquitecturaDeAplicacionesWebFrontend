import { ChangeDetectorRef, Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Diagnosticoclinicoservice } from '../../../services/diagnosticoclinicoservice';
import { DiagnosticoClinicoDTO } from '../../../models/DiagnosticoClinicoDTO';

@Component({
  selector: 'app-diagnosticoclinicovalidadoscomponent',
  imports: [
    FormsModule,
    DatePipe,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './diagnosticoclinicovalidadoscomponent.html',
  styleUrl: './diagnosticoclinicovalidadoscomponent.css',
})
export class Diagnosticoclinicovalidadoscomponent {
  psicologoId: number | null = null;
  lista: DiagnosticoClinicoDTO[] = [];
  mensaje: string = '';
  displayedColumns: string[] = ['id', 'usuario', 'sesion', 'resultado', 'riesgo', 'validacion'];

  constructor(private dcS: Diagnosticoclinicoservice, private cdr: ChangeDetectorRef) { }

  buscarValidados(): void {
    if (!this.psicologoId || this.psicologoId < 1) {
      this.lista = [];
      this.mensaje = 'Ingrese el id del psicólogo';
      return;
    }

    this.dcS.validadosPorPsicologo(this.psicologoId).subscribe({
      next: (data: DiagnosticoClinicoDTO[]) => {
        this.lista = data;
        this.mensaje = data.length > 0 ? '' : 'El psicólogo no tiene diagnósticos validados';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.lista = [];
        this.mensaje = 'Ocurrió un error al consultar los diagnósticos validados';
        this.cdr.detectChanges();
      }
    });
  }
}
