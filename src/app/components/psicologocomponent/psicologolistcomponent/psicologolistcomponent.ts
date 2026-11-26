import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Psicologoservice } from '../../../services/psicologoservice';
import { PsicologoDTO } from '../../../models/PsicologoDTO';

@Component({
  selector: 'app-psicologolistcomponent',
  imports: [RouterLink, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './psicologolistcomponent.html',
  styleUrl: './psicologolistcomponent.css',
})
export class Psicologolistcomponent implements OnInit {
  dataSource: PsicologoDTO[] = [];
  displayedColumns: string[] = ['nombre', 'colegiatura', 'especializacion', 'experiencia', 'cuenta', 'verificacion', 'pacientes', 'verificar', 'capacidad'];
  mensaje: string = 'Cargando...';
  mensajeAccion: string = '';

  constructor(private pS: Psicologoservice, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listarPsicologos();
  }

  listarPsicologos(): void {
    this.pS.getPsicologos().subscribe({
      next: (data: PsicologoDTO[]) => {
        this.dataSource = data;
        this.mensaje = data.length > 0 ? '' : 'No hay psicólogos registrados';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.mensaje = err.error?.message || 'Ocurrió un error al obtener los psicólogos';
        this.cdr.detectChanges();
      }
    });
  }

  verificarPsicologo(p: PsicologoDTO): void {
    if (!confirm(`¿Seguro que deseas verificar a ${p.nombres} ${p.apellidos}?`)) {
      return;
    }

    this.pS.verificar(p.psicologoId).subscribe({
      next: () => {
        this.mensajeAccion = 'Psicólogo verificado correctamente';
        this.listarPsicologos();
      },
      error: (err) => {
        console.log(err);
        this.mensajeAccion = err.error?.message || 'Error al verificar al psicólogo';
        this.cdr.detectChanges();
      }
    });
  }
}
