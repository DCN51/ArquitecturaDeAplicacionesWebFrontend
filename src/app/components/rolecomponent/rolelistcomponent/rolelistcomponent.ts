import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Roleservice } from '../../../services/roleservice';
import { RoleDTO } from '../../../models/RoleDTO';

@Component({
  selector: 'app-rolelistcomponent',
  imports: [MatTableModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './rolelistcomponent.html',
  styleUrl: './rolelistcomponent.css',
})
export class Rolelistcomponent implements OnInit {
  dataSource: RoleDTO[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'editar', 'eliminar'];
  mensaje: string = '';        // error al cargar la lista
  mensajeAccion: string = '';  // resultado de eliminar

  // Roles que usa la aplicación: no se editan ni se eliminan
  private rolesDelSistema: string[] = ['ROLE_ADMINISTRADOR', 'ROLE_PSICOLOGO', 'ROLE_PACIENTE'];

  constructor(private rS: Roleservice, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listarRoles();
  }

  // HUF18
  listarRoles(): void {
    this.rS.getRoles().subscribe({
      next: (data) => {
        this.dataSource = data;
        this.mensaje = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.mensaje = 'Ocurrió un error al obtener los roles';
        this.cdr.detectChanges();
      }
    });
  }

  // "ROLE_PACIENTE" -> "PACIENTE"
  nombreRol(nombre: string): string {
    return nombre.replace('ROLE_', '');
  }

  esRolDelSistema(role: RoleDTO): boolean {
    return this.rolesDelSistema.includes(role.name);
  }

  // HUF45
  eliminarRol(role: RoleDTO): void {
    if (!confirm(`¿Seguro que deseas eliminar el rol "${this.nombreRol(role.name)}"?`)) {
      return;
    }

    this.rS.delete(role.roleId).subscribe({
      next: () => {
        this.mensajeAccion = 'Rol eliminado correctamente';
        this.listarRoles();
      },
      error: (err) => {
        console.log(err);
        if (err.status === 400) {
          this.mensajeAccion = 'Los roles del sistema no se pueden eliminar';
        } else if (err.status === 409) {
          this.mensajeAccion = 'No se puede eliminar: hay usuarios con este rol';
        } else if (err.status === 404) {
          this.mensajeAccion = 'Rol no encontrado';
        } else {
          this.mensajeAccion = 'Error al eliminar el rol';
        }
        this.listarRoles();
      }
    });
  }
}
