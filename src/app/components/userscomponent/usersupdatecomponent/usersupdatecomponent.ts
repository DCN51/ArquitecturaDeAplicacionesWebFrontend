import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Usersservice } from '../../../services/usersservice';
import { Loginservice } from '../../../services/loginservice';
import { UserDTO } from '../../../models/UserDTO';
import { UserUpdateDTO } from '../../../models/UserUpdateDTO';

@Component({
  selector: 'app-usersupdatecomponent',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule
  ],
  templateUrl: './usersupdatecomponent.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './usersupdatecomponent.css',
})
export class Usersupdatecomponent implements OnInit {
  idUsuario: number = 0;
  esPerfil: boolean = false;
  usuarioForm: FormGroup;
  mensaje: string = '';
  encontrado: boolean = false;
  generos: string[] = ['Masculino', 'Femenino', 'Otro'];

  constructor(
    private uS: Usersservice,
    private loginService: Loginservice,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.usuarioForm = this.fb.group({
      codigo: [0],
      username: [''],
      nombres: ['', [Validators.required, Validators.maxLength(100)]],
      apellidos: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      telefono: ['', Validators.maxLength(20)],
      fechaNacimiento: [null],
      genero: [''],
      password: ['', Validators.minLength(8)]
    });
  }

  ngOnInit(): void {
    this.esPerfil = !this.route.snapshot.paramMap.has('id');
    if (this.esPerfil) {
      this.buscarUsuario();
      return;
    }

    this.idUsuario = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.idUsuario || isNaN(this.idUsuario)) {
      this.mensaje = 'Usuario no encontrado';
      return;
    }
    this.buscarUsuario();
  }

  buscarUsuario(): void {
    const consulta = this.esPerfil ? this.uS.getPerfil() : this.uS.listId(this.idUsuario);
    consulta.subscribe({
      next: (u: UserDTO) => {
        this.encontrado = true;
        this.usuarioForm.patchValue({
          codigo: u.userId,
          username: u.username,
          nombres: u.firstName,
          apellidos: u.lastName,
          email: u.email,
          telefono: u.phone,
          fechaNacimiento: this.aFecha(u.birthDate),
          genero: u.gender
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.encontrado = false;
        this.mensaje = 'Usuario no encontrado';
        this.cdr.detectChanges();
      }
    });
  }

  actualizarUsuario(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      this.mensaje = 'Complete todos los campos correctamente';
      return;
    }

    const dto: UserUpdateDTO = {
      firstName: this.usuarioForm.value.nombres,
      lastName: this.usuarioForm.value.apellidos,
      email: this.usuarioForm.value.email,
      password: this.usuarioForm.value.password ? this.usuarioForm.value.password : null,
      phone: this.usuarioForm.value.telefono,
      birthDate: this.aTexto(this.usuarioForm.value.fechaNacimiento),
      gender: this.usuarioForm.value.genero
    };

    const guardar = this.esPerfil ? this.uS.updatePerfil(dto) : this.uS.update(this.idUsuario, dto);
    guardar.subscribe({
      next: (u: UserDTO) => {
        this.mensaje = 'Datos actualizados correctamente';
        if (this.esPerfil) {
          this.loginService.actualizarNombre(u.firstName, u.lastName);
        }
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate([this.rutaVolver]), 1200);
      },
      error: (err) => {
        console.log(err);
        if (err.status === 409) {
          this.mensaje = 'El correo ya pertenece a otro usuario';
        } else if (err.status === 404) {
          this.mensaje = 'Usuario no encontrado';
        } else if (err.status === 400) {
          this.mensaje = 'Revise el formato de los datos';
        } else {
          this.mensaje = 'Error al actualizar los datos';
        }
        this.cdr.detectChanges();
      }
    });
  }

  get rutaVolver(): string {
    return this.esPerfil ? '/app' : '/usuarios/listar';
  }

  private aFecha(texto: string | null): Date | null {
    if (!texto) {
      return null;
    }
    const [anio, mes, dia] = texto.split('-').map(Number);
    return new Date(anio, mes - 1, dia);
  }

  private aTexto(fecha: Date | null): string | null {
    return fecha ? fecha.toLocaleDateString('en-CA') : null;
  }
}