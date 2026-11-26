import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RoleDTO } from '../../models/RoleDTO';
import { RegistroRequestDTO } from '../../models/RegistroRequestDTO';
import { Registrerservice } from '../../services/registrerservice';
import { Roleservice } from '../../services/roleservice';

@Component({
  selector: 'app-registrercomponent',
  imports: [ReactiveFormsModule, RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './registrercomponent.html',
  styleUrl: './registrercomponent.css',
})
export class Registrercomponent implements OnInit {
  registroForm: FormGroup;
  roles: RoleDTO[] = [];
  mensaje: string = '';
  errorRoles: string = '';
  enviando: boolean = false;
  registrado: boolean = false;
  readonly hoy = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  constructor(
    private fb: FormBuilder,
    private registrerService: Registrerservice,
    private roleService: Roleservice,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.registroForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/\S/)]],
      contrasena: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100), Validators.pattern(/\S/)]],
      confirmar: ['', Validators.required],
      rolId: [0, [Validators.required, Validators.min(1)]],
      nombres: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/\S/)]],
      apellidos: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/\S/)]],
      correoElectronico: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      telefono: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/\S/)]],
      fechaNacimiento: ['', Validators.required],
      genero: ['', [Validators.required, Validators.maxLength(20)]],
      numeroColegiatura: [''],
      especializacion: [''],
      anosExperiencia: [0],
    });
  }

  ngOnInit(): void {
    this.cargarRoles();
  }

  cargarRoles(): void {
    this.errorRoles = '';
    this.roleService.getRolesRegistro().subscribe({
      next: (data) => {
        this.roles = data.filter(rol => ['PACIENTE', 'PSICOLOGO'].includes(this.nombreRol(rol.name)));
        if (!this.roles.length) this.errorRoles = 'No hay roles disponibles para el registro. Contacta al administrador.';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.errorRoles = 'No se pudieron cargar los roles. Verifica que el servidor esté disponible.';
        this.cdr.detectChanges();
      }
    });
  }

  nombreRol(nombre: string): string {
    return nombre.toUpperCase().replace('ROLE_', '');
  }

  get esPsicologo(): boolean {
    const rol = this.roles.find(rol => rol.roleId === this.registroForm.value.rolId);
    return !!rol && this.nombreRol(rol.name) === 'PSICOLOGO';
  }

  cambiarRol(): void {
    const colegiatura = this.registroForm.get('numeroColegiatura');
    const especializacion = this.registroForm.get('especializacion');
    const experiencia = this.registroForm.get('anosExperiencia');

    if (this.esPsicologo) {
      colegiatura?.setValidators([Validators.required, Validators.maxLength(20), Validators.pattern(/\S/)]);
      especializacion?.setValidators([Validators.required, Validators.maxLength(150), Validators.pattern(/\S/)]);
      experiencia?.setValidators([Validators.required, Validators.min(0), Validators.max(2147483647), Validators.pattern(/^\d+$/)]);
    } else {
      colegiatura?.clearValidators();
      especializacion?.clearValidators();
      experiencia?.clearValidators();
    }
    colegiatura?.updateValueAndValidity();
    especializacion?.updateValueAndValidity();
    experiencia?.updateValueAndValidity();
  }

  registrar(): void {
    if (this.enviando || this.registrado) return;
    this.cambiarRol();
    const datos = this.registroForm.value;
    if (this.registroForm.invalid || !this.roles.some(rol => rol.roleId === datos.rolId)) {
      this.registroForm.markAllAsTouched();
      this.mensaje = 'Completa los datos obligatorios correctamente.';
      return;
    }
    if (datos.contrasena !== datos.confirmar) { this.mensaje = 'Las contraseñas no coinciden.'; return; }
    if (datos.fechaNacimiento > this.hoy) { this.mensaje = 'La fecha de nacimiento no puede ser futura.'; return; }
    const registro: RegistroRequestDTO = {
      username: datos.username.trim(), rolId: datos.rolId,
      nombres: datos.nombres.trim(), apellidos: datos.apellidos.trim(),
      correoElectronico: datos.correoElectronico.trim().toLowerCase(), contrasena: datos.contrasena,
      telefono: datos.telefono.trim(), fechaNacimiento: datos.fechaNacimiento, genero: datos.genero,
      numeroColegiatura: null,
      especializacion: null,
      anosExperiencia: null
    };
    if (this.esPsicologo) {
      registro.numeroColegiatura = datos.numeroColegiatura.trim();
      registro.especializacion = datos.especializacion.trim();
      registro.anosExperiencia = datos.anosExperiencia;
    }
    this.enviando = true;
    this.mensaje = '';
    this.registrerService.registrar(registro).subscribe({
      next: () => {
        this.registrado = true;
        this.enviando = false;
        this.registroForm.reset();
        this.router.navigate(['/iniciar-sesion'], { queryParams: { registrado: '1' } });
      },
      error: (err) => {
        console.log(err);
        this.enviando = false;
        if (err.status === 0) {
          this.mensaje = 'No se pudo conectar con el servidor.';
        } else if (err.status === 401 || err.status === 403) {
          this.mensaje = 'El servidor no permite el registro público.';
        } else {
          this.mensaje = err.error?.message || 'No se pudo registrar la cuenta';
        }
        this.cdr.detectChanges();
      }
    });
  }
}
