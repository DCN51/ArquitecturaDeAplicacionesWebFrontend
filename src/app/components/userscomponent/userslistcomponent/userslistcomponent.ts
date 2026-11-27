import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Roleservice } from '../../../services/roleservice';
import { RoleDTO } from '../../../models/RoleDTO';
import { Usersservice } from '../../../services/usersservice';
import { UserDTO } from '../../../models/UserDTO';

@Component({
  selector: 'app-userslistcomponent',
  imports: [MatTableModule, MatIconModule, MatButtonModule, RouterLink, FormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './userslistcomponent.html',
  styleUrl: './userslistcomponent.css',
})
export class Userslistcomponent implements OnInit {
  dataSource: UserDTO[] = [];
  displayedColumns: string[] = ['id', 'username', 'nombre', 'email', 'rol', 'estado', 'editar', 'desactivar'];
  mensaje: string = '';        // error al cargar la lista
  mensajeAccion: string = '';  // resultado de desactivar

  // HUF39 - filtros (null / '' = todos)
  roles: RoleDTO[] = [];
  rolFiltro: number | null = null;
  estadoFiltro: string = '';

  constructor(private uS: Usersservice, private rS: Roleservice, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.cargarRoles();
    this.listarUsuarios();
  }

  get hayFiltros(): boolean {
    return this.rolFiltro !== null || this.estadoFiltro !== '';
  }

  // Roles para el filtro
  cargarRoles(): void {
    this.rS.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.log(err)
    });
  }

  limpiarFiltros(): void {
    this.rolFiltro = null;
    this.estadoFiltro = '';
    this.mensajeAccion = '';
    this.listarUsuarios();
  }

  // Lista con los filtros elegidos (también se usa después de desactivar)
  listarUsuarios(): void {
    this.uS.getUsuarios(this.rolFiltro, this.estadoFiltro).subscribe({
      next: (data) => {
        this.dataSource = data;
        this.mensaje = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.mensaje = 'Ocurrió un error al obtener los usuarios';
        this.cdr.detectChanges();
      }
    });
  }

  nombreRol(nombre: string): string {
    return nombre.replace('ROLE_', '');
  }

  // HUF20
  desactivarUsuario(u: UserDTO): void {
    if (!confirm(`¿Seguro que deseas desactivar la cuenta de "${u.username}"?`)) {
      return;
    }

    this.uS.desactivar(u.userId).subscribe({
      next: () => {
        this.mensajeAccion = 'Cuenta desactivada correctamente';
        this.listarUsuarios();   // la cuenta sigue en la lista, ahora como INACTIVO
      },
      error: (err) => {
        console.log(err);
        if (err.status === 409) {
          this.mensajeAccion = 'La cuenta ya está inactiva';
        } else if (err.status === 404) {
          this.mensajeAccion = 'Usuario no encontrado';
        } else {
          this.mensajeAccion = 'Error al desactivar la cuenta';
        }
        this.listarUsuarios();
      }
    });
  }
}