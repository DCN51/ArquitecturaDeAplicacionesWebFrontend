import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Roleservice } from '../../../services/roleservice';
import { RoleDTO } from '../../../models/RoleDTO';

@Component({
  selector: 'app-roleupdatecomponent',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './roleupdatecomponent.html',
  styleUrl: './roleupdatecomponent.css',
})
export class Roleupdatecomponent implements OnInit {
  idRol: number = 0;
  roleForm: FormGroup;
  mensaje: string = '';
  encontrado: boolean = false;   // si no se encuentra el rol, no se permite guardar

  constructor(
    private rS: Roleservice,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.roleForm = this.fb.group({
      codigo: [0],
      nombre: ['', [Validators.required, Validators.maxLength(25)]]
    });
  }

  ngOnInit(): void {
    // Recuperar el id desde la URL (/roles/editar/:id)
    this.idRol = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.idRol || isNaN(this.idRol)) {
      this.mensaje = 'Rol no encontrado';
      return;
    }
    this.buscarRol();
  }

  buscarRol(): void {
    this.rS.listId(this.idRol).subscribe({
      next: (role: RoleDTO) => {
        this.encontrado = true;
        this.roleForm.patchValue({
          codigo: role.roleId,
          nombre: role.name.replace('ROLE_', '')
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.encontrado = false;
        this.mensaje = 'Rol no encontrado';
        this.cdr.detectChanges();
      }
    });
  }

  // HUF27
  actualizarRol(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      this.mensaje = 'Complete el nombre del rol correctamente';
      return;
    }

    const role: RoleDTO = {
      roleId: this.roleForm.value.codigo,
      name: this.roleForm.value.nombre
    };

    this.rS.update(role).subscribe({
      next: () => {
        this.mensaje = 'Rol actualizado correctamente';
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/roles/listar']), 1200);
      },
      error: (err) => {
        console.log(err);
        if (err.status === 400) {
          this.mensaje = 'Los roles del sistema no se pueden modificar';
        } else if (err.status === 409) {
          this.mensaje = 'Ya existe un rol con ese nombre';
        } else if (err.status === 404) {
          this.mensaje = 'Rol no encontrado';
        } else {
          this.mensaje = 'Error al actualizar el rol';
        }
        this.cdr.detectChanges();
      }
    });
  }
}
