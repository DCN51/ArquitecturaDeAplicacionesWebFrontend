import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Roleservice } from '../../../services/roleservice';
import { RoleDTO } from '../../../models/RoleDTO';

@Component({
  selector: 'app-roleinsertcomponent',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './roleinsertcomponent.html',
  styleUrl: './roleinsertcomponent.css',
})
export class Roleinsertcomponent {
  roleForm: FormGroup;
  mensaje: string = '';

  constructor(
    private rS: Roleservice,
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.roleForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(25)]]
    });
  }

  // HUF43
  registrarRol(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      this.mensaje = 'Complete el nombre del rol correctamente';
      return;
    }

    const role: RoleDTO = {
      roleId: 0,
      name: this.roleForm.value.nombre   // el back le agrega "ROLE_" y lo pasa a mayúsculas
    };

    this.rS.insert(role).subscribe({
      next: () => {
        this.mensaje = 'Rol registrado correctamente';
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/roles/listar']), 1200);
      },
      error: (err) => {
        console.log(err);
        if (err.status === 409) {
          this.mensaje = 'Ya existe un rol con ese nombre';
        } else if (err.status === 400) {
          this.mensaje = 'El nombre del rol no es válido';
        } else {
          this.mensaje = 'Error al registrar el rol';
        }
        this.cdr.detectChanges();
      }
    });
  }
}
