import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Loginservice } from '../../../services/loginservice';
import { Casoemergenciaservice } from '../../../services/casoemergenciaservice';
import { Usersservice } from '../../../services/usersservice';
import { CasoEmergenciaDTO } from '../../../models/CasoEmergenciaDTO';
import { UserDTO } from '../../../models/UserDTO';

@Component({
  selector: 'app-casoemergencialistcomponent',
  imports: [MatTableModule, MatButtonModule, MatIconModule, DatePipe, RouterLink],
  templateUrl: './casoemergencialistcomponent.html',
  styleUrl: './casoemergencialistcomponent.css',
})
export class Casoemergencialistcomponent implements OnInit {
  dataSource: CasoEmergenciaDTO[] = [];
  mensaje: string = '';
  mensajeAccion: string = '';
  cargando: boolean = true;
  usuarios: UserDTO[] = [];

  // Columnas que ven todos
  private baseColumns: string[] = ['id', 'paciente', 'psicologo', 'sesion', 'fecha', 'urgencia', 'estado', 'cierre'];

  // El psicólogo ve editar; el administrador ve eliminar
  get displayedColumns(): string[] {
    const columnas = [...this.baseColumns];
    if (this.esPsicologo) columnas.push('editar');
    if (this.esAdmin) columnas.push('eliminar');
    return columnas;
  }

  get esPsicologo(): boolean {
    return this.loginService.hasAnyRole(['PSICOLOGO']);
  }

  get esAdmin(): boolean {
    return this.loginService.hasAnyRole(['ADMINISTRADOR']);
  }

  constructor(
    private loginService: Loginservice,
    private ceS: Casoemergenciaservice,
    private uS: Usersservice,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.listarCasos();
  }

  cargarUsuarios(): void {
    this.uS.getUsuarios().subscribe({
      next: (data: UserDTO[]) => {
        this.usuarios = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.usuarios = [];
        this.cdr.detectChanges();
      }
    });
  }

  nombrePsicologo(id: number | null): string {
    if (id == null) {
      return 'Sin asignar';
    }
    const p = this.usuarios.find(u => u.userId === id);
    return p ? `${p.firstName} ${p.lastName}` : `Psicólogo ${id}`;
  }

  listarCasos(): void {
    this.ceS.list().subscribe({
      next: (data: CasoEmergenciaDTO[]) => {
        this.dataSource = data;
        this.mensaje = '';
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.dataSource = [];
        this.cargando = false;
        if (err.status === 401 || err.status === 403) {
          this.mensaje = 'No tienes permiso para ver los casos de emergencia';
        } else {
          this.mensaje = 'Ocurrió un error al obtener los casos de emergencia';
        }
        this.cdr.detectChanges();
      }
    });
  }

  eliminarCaso(c: CasoEmergenciaDTO): void {
    if (!confirm(`¿Seguro que deseas eliminar el caso ${c.casoEmergenciaId}?`)) {
      return;
    }

    this.ceS.delete(c.casoEmergenciaId).subscribe({
      next: () => {
        this.mensajeAccion = 'Caso eliminado correctamente';
        this.listarCasos();
      },
      error: (err) => {
        console.log(err);
        if (err.status === 404) {
          this.mensajeAccion = 'Caso no encontrado';
        } else if (err.status === 401 || err.status === 403) {
          this.mensajeAccion = 'No tienes permiso para eliminar casos';
        } else {
          this.mensajeAccion = 'Error al eliminar el caso';
        }
        this.listarCasos();
      }
    });
  }
}